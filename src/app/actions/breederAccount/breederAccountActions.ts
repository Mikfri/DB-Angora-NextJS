// src/app/actions/breederAccount/breederAccountActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { GetOwnRabbits, GetReceivedTransferRequests, GetSentTransferRequests, UpdateBreederAccount } from '@/api/endpoints/breederAccountController';
import { BreederAccount_PrivateProfileDTO, BreederAccount_UpdateDTO, PagedResultDTO, Rabbit_PreviewDTO, TransferRequestPreviewDTO, TransferRequestPreviewFilterDTO } from '@/api/types/AngoraDTOs';


/**
 * Server Action: Henter alle brugerens kaniner med paginering
 * Wrapper omkring GetOwnRabbits der håndterer token-hentning
 * @param page Sidetal (starter fra 1)
 * @param pageSize Antal elementer per side
 * @returns Object med success flag, pagineret data og evt. fejlbesked
 */
export async function getMyRabbits(
  page: number = 1, 
  pageSize: number = 10
): Promise<{
  success: boolean;
  data?: PagedResultDTO<Rabbit_PreviewDTO>;
  error?: string;
}> {
  try {
    console.log(`Server Action: getMyRabbits called with page=${page}, pageSize=${pageSize}`);
    // Hent token direkte via server action
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: "Du skal være logget ind for at se dine kaniner"
      };
    }
    
    // Pass the page and pageSize parameters explicitly
    const pagedResult = await GetOwnRabbits(accessToken, page, pageSize);
    
    console.log(`Server Action: getMyRabbits received page ${pagedResult.page} of ${pagedResult.totalPages}`);
    
    return {
      success: true,
      data: pagedResult
    };
  } catch (error) {
    console.error("Error in getMyRabbits server action:", error);
    return {
      success: false,
      error: "Der opstod en fejl ved indlæsning af dine kaniner"
    };
  }
}

/**
 * Server Action: Henter modtagne overførselsanmodninger for brugeren (med filtrering)
 * @param filter Filtreringsparametre (valgfri)
 * @returns Liste af modtagne anmodninger eller fejl
 */
export async function getReceivedTransferRequests(
  filter?: TransferRequestPreviewFilterDTO
): Promise<{
  success: boolean;
  data?: TransferRequestPreviewDTO[];
  error?: string;
}> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Du skal være logget ind for at se modtagne overførselsanmodninger"
      };
    }
    const data = await GetReceivedTransferRequests(accessToken, filter);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Der skete en uventet fejl"
    };
  }
}

/**
 * Server Action: Henter udstedte (sendte) overførselsanmodninger for brugeren (med filtrering)
 * @param filter Filtreringsparametre (valgfri)
 * @returns Liste af sendte anmodninger eller fejl
 */
export async function getSentTransferRequests(
  filter?: TransferRequestPreviewFilterDTO
): Promise<{
  success: boolean;
  data?: TransferRequestPreviewDTO[];
  error?: string;
}> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Du skal være logget ind for at se sendte overførselsanmodninger"
      };
    }
    const data = await GetSentTransferRequests(accessToken, filter);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Der skete en uventet fejl"
    };
  }
}

/**
 * Server Action: Opdaterer en opdrætterkonto (BreederAccount)
 * @param breederAccountId ID på opdrætterkontoen der skal opdateres
 * @param updateDTO De nye profildata
 * @returns Den opdaterede opdrætterprofil eller fejl
 */
export async function updateBreederAccount(
  breederAccountId: string,
  updateDTO: BreederAccount_UpdateDTO
): Promise<{
  success: boolean;
  data?: BreederAccount_PrivateProfileDTO;
  error?: string;
}> {
  try {
    if (!breederAccountId || !updateDTO) {
      return {
        success: false,
        error: 'Opdrætterkonto ID og opdateringsdata er påkrævet'
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: 'Ingen adgang - log venligst ind igen'
      };
    }

    const updatedProfile = await UpdateBreederAccount(accessToken, breederAccountId, updateDTO);

    return {
      success: true,
      data: updatedProfile
    };
  } catch (error) {
    // Brug type guard for Error
    let message = 'Der opstod en fejl ved opdatering af opdrætterkonto';
    if (error instanceof Error) {
      message = error.message;
    }
    console.error('Error updating breeder account:', error);
    return {
      success: false,
      error: message
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