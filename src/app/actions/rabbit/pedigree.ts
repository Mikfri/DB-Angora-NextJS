// src/app/actions/rabbit/pedigree.ts
'use server';

import { GetRabbitPedigree } from "@/api/endpoints/rabbitController";
import { Rabbit_PedigreeDTO } from "@/api/types/AngoraDTOs";
import { getAccessToken } from "@/app/actions/auth/session";
import { cache } from 'react';

export type PedigreeResult = 
  | { success: true; data: Rabbit_PedigreeDTO }
  | { success: false; error: string; status: number };

/**
 * Server Action: Henter stamtræet for en specifik kanin
 * Wrapper omkring GetRabbitPedigree der håndterer token-hentning
 * 
 * @param earCombId - Kaninens øremærke-id
 * @returns Object med success flag, pedigree data og evt. fejlbesked
 */
export const getRabbitPedigree = cache(async function(
  earCombId: string
): Promise<PedigreeResult> {
  try {
    // Performance måling
    const startTime = performance.now();
    
    // Hent token direkte via server action
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: "Du skal være logget ind for at se stamtræet",
        status: 401
      };
    }
    
    // Get data from API
    const pedigree = await GetRabbitPedigree(accessToken, earCombId);
    
    // Log performance
    const endTime = performance.now();
    console.log(`Fetched pedigree for rabbit ${earCombId} in ${Math.round(endTime - startTime)}ms`);
    
    return {
      success: true,
      data: pedigree
    };
  } catch (error) {
    console.error(`Error fetching pedigree for rabbit ${earCombId}:`, error);
    
    // Håndtering af specifikke fejl
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return {
          success: false,
          error: "Stamtræ for denne kanin blev ikke fundet",
          status: 404
        };
      }
      
      if (error.message.includes('403')) {
        return {
          success: false,
          error: "Du har ikke adgang til at se denne kanins stamtræ",
          status: 403
        };
      }
    }
    
    // Generisk fejl
    return {
      success: false,
      error: "Der opstod en fejl ved indlæsning af kaninens stamtræ",
      status: 500
    };
  }
});

/**
 * Hjælpefunktion til at flattene et stamtræ til en liste af nodes
 * Bruges til nem adgang til alle knuder i træet for f.eks. søgning eller visualisering
 * 
 * @param pedigree - Stamtræsobjektet
 * @returns Array med alle knuder i stamtræet som en flad liste
 */
export async function flattenPedigree(pedigree: Rabbit_PedigreeDTO | null): Promise<Rabbit_PedigreeDTO[]> {
  if (!pedigree) return [];
  
  const result: Rabbit_PedigreeDTO[] = [pedigree];
  
  if (pedigree.Father) {
    result.push(...await flattenPedigree(pedigree.Father));
  }
  
  if (pedigree.Mother) {
    result.push(...await flattenPedigree(pedigree.Mother));
  }
  
  return result;
}

/**
 * Beregner maksimal dybde af stamtræet
 * 
 * @param pedigree - Stamtræsobjektet
 * @returns Det maksimale antal generationer i stamtræet
 */
export async function calculateMaxDepth(pedigree: Rabbit_PedigreeDTO | null): Promise<number> {
  if (!pedigree) return 0;
  
  const fatherDepth = pedigree.Father ? await calculateMaxDepth(pedigree.Father) : 0;
  const motherDepth = pedigree.Mother ? await calculateMaxDepth(pedigree.Mother) : 0;
  
  return 1 + Math.max(fatherDepth, motherDepth);
}

/**
 * Server Action: Finder de mest fremtrædende forfædre i stamtræet
 * baseret på hvor ofte de optræder
 * 
 * @param earCombId - Kaninens øremærke-id
 * @returns Objekt med success flag og forfædre-statistik
 */
export async function getProminentAncestors(earCombId: string): Promise<{
  success: boolean;
  data?: {
    ancestorId: string;
    name: string | null; 
    occurrences: number;
  }[];
  error?: string;
}> {
  try {
    const pedigreeResult = await getRabbitPedigree(earCombId);
    
    if (!pedigreeResult.success) {
      return {
        success: false,
        error: pedigreeResult.error
      };
    }
    
    // Flatten stamtræet til en liste
    const allNodes = await flattenPedigree(pedigreeResult.data);
    
    // Tæl forekomster af hver forfader
    const ancestorCounts = new Map<string, { name: string | null; count: number }>();
    
    // Start fra index 1 for at springe hovedkaninen selv over
    for (let i = 1; i < allNodes.length; i++) {
      const node = allNodes[i];
      const currentCount = ancestorCounts.get(node.EarCombId)?.count || 0;
      
      ancestorCounts.set(node.EarCombId, {
        name: node.NickName,
        count: currentCount + 1
      });
    }
    
    // Konverter til array og sorter efter hyppighed
    const sortedAncestors = Array.from(ancestorCounts.entries())
      .map(([ancestorId, { name, count }]) => ({
        ancestorId,
        name,
        occurrences: count
      }))
      .sort((a, b) => b.occurrences - a.occurrences);
    
    return {
      success: true,
      data: sortedAncestors
    };
  } catch (error) {
    console.error(`Error analyzing pedigree for rabbit ${earCombId}:`, error);
    return {
      success: false,
      error: "Der opstod en fejl ved analyse af stamtræet"
    };
  }
}