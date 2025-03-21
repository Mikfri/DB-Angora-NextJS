// src/app/actions/rabbit/myRabbits.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { GetOwnRabbits } from '@/api/endpoints/accountController';
import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';

/**
 * Server Action: Henter alle brugerens kaniner
 * Wrapper omkring GetOwnRabbits der håndterer token-hentning
 * @returns Object med success flag, data og evt. fejlbesked
 */
export async function getMyRabbits(): Promise<{
  success: boolean;
  data: Rabbit_PreviewDTO[];
  error?: string;
}> {
  try {
    // Hent token direkte via server action
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        data: [],
        error: "Du skal være logget ind for at se dine kaniner"
      };
    }
    
    // Brug den eksisterende GetOwnRabbits funktion
    const rabbits = await GetOwnRabbits(accessToken);
    return {
      success: true,
      data: rabbits
    };
  } catch (error) {
    console.error("Error in getMyRabbits server action:", error);
    return {
      success: false,
      data: [],
      error: "Der opstod en fejl ved indlæsning af dine kaniner"
    };
  }
}


// Nedenstående er Server filtrering.. Hvis DB-AngoraREST API'en understøtter det,
// vil den kunne bruge denne metode..

/**
 * Server Action: Filtrerer brugerens kaniner baseret på søgekriterier
 * Henter data via getMyRabbits og anvender filtre på server-siden
 */
// export async function searchMyRabbits(filters: {
//   search?: string;
//   Gender?: string;
//   Race?: string;
//   Color?: string;
//   ForSale?: boolean;
//   ForBreeding?: boolean;
//   showDeceased?: boolean;
//   raceColorApproval?: string;
//   bornAfterDate?: string | null;
// }): Promise<Rabbit_PreviewDTO[]> {
//   try {
//     const rabbits = await getMyRabbits();
    
//     if (!rabbits.length) return [];
//     if (!Object.keys(filters).length) return rabbits;
    
//     // Implementering der matcher din eksisterende client-side filter
//     return rabbits.filter(rabbit => {
//       const isDeceased = rabbit.dateOfDeath !== null;
//       if (filters.showDeceased !== undefined && filters.showDeceased !== isDeceased) return false;

//       const matchesSearch = !filters.search || (
//         (rabbit.nickName?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
//         (rabbit.earCombId.toLowerCase().includes(filters.search.toLowerCase())) ||
//         (rabbit.race?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
//         (rabbit.color?.toLowerCase().includes(filters.search.toLowerCase()) ?? false)
//       );

//       const matchesRaceColorApproval = !filters.raceColorApproval || 
//         (filters.raceColorApproval === 'Approved' && rabbit.approvedRaceColorCombination === true) ||
//         (filters.raceColorApproval === 'NotApproved' && rabbit.approvedRaceColorCombination === false);
      
//       const matchesBornAfter = !filters.bornAfterDate ||
//         (rabbit.dateOfBirth && new Date(rabbit.dateOfBirth) >= new Date(filters.bornAfterDate));
      
//       const matchesGender = !filters.Gender || rabbit.gender === filters.Gender;
//       const matchesRace = !filters.Race || rabbit.race === filters.Race;
//       const matchesColor = !filters.Color || rabbit.color === filters.Color;
//       const matchesForSale = !filters.ForSale || rabbit.hasSaleDetails === true;
//       const matchesForBreeding = !filters.ForBreeding || rabbit.forBreeding === 'Ja';

//       return matchesSearch &&
//         matchesGender &&
//         matchesRace &&
//         matchesColor &&
//         matchesForSale &&
//         matchesForBreeding &&
//         matchesRaceColorApproval &&
//         matchesBornAfter;
//     });
//   } catch (error) {
//     console.error("Error in searchMyRabbits server action:", error);
//     return [];
//   }
// }