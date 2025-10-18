// src/app/actions/rabbit/pedigree.ts
'use server';

import { Rabbit_PedigreeDTO } from "@/api/types/AngoraDTOs";

export type PedigreeResult = 
  | { success: true; data: Rabbit_PedigreeDTO }
  | { success: false; error: string; status: number };



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