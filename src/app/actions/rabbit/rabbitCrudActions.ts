'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { Rabbit_CreateDTO, Rabbit_ProfileDTO } from '@/api/types/AngoraDTOs';
import { 
  CreateRabbit, 
  GetRabbitProfile, 
  EditRabbit, 
  DeleteRabbit 
} from '@/api/endpoints/rabbitController';

// ====================== TYPES ======================

export type CreateRabbitResult = 
  | { success: true; earCombId: string }
  | { success: false; error: string };

export type ProfileResult = 
  | { success: true; data: Rabbit_ProfileDTO }
  | { success: false; error: string; status: number };

export type UpdateRabbitResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type DeleteRabbitResult = 
  | { success: true; message: string }
  | { success: false; error: string };

// ====================== CREATE ======================

/**
 * Server Action: Opretter en ny kanin
 * @param rabbitData Data for den nye kanin
 * @returns Resultat af oprettelsen med earCombId ved succes
 */
export async function createRabbit(rabbitData: Rabbit_CreateDTO): Promise<CreateRabbitResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    // Validér data på server-siden
    if (!rabbitData.rightEarId || !rabbitData.leftEarId || !rabbitData.nickName) {
      return {
        success: false, 
        error: 'Manglende påkrævede felter'
      };
    }
    
    // Kald API endpoint
    const newRabbit = await CreateRabbit(rabbitData, accessToken);
    
    // Returner et success objekt med det nye ID
    return {
      success: true,
      earCombId: newRabbit.earCombId
    };
  } catch (error) {
    console.error('Failed to create rabbit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

// ====================== READ ======================

/**
 * Server Action: Henter en kanin profil baseret på øremærke
 * @param earCombId Kaninens øremærke-id
 * @returns Kaninens profil data eller fejlbesked
 */
export async function getRabbitProfile(earCombId: string): Promise<ProfileResult> {
  try {
    if (!earCombId) {
      return {
        success: false,
        error: "Missing earCombId parameter",
        status: 400
      };
    }
    
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: "Authentication required",
        status: 401
      };
    }
    
    const rabbit = await GetRabbitProfile(accessToken, earCombId);
    
    if (!rabbit) {
      return {
        success: false,
        error: "Rabbit not found",
        status: 404
      };
    }
    
    return {
      success: true,
      data: rabbit
    };
  } catch (error) {
    console.error(`Error fetching rabbit profile:`, error);
    return {
      success: false,
      error: "Failed to fetch rabbit profile",
      status: 500
    };
  }
}

// ====================== UPDATE ======================

/**
 * Server Action: Opdaterer en eksisterende kanin
 * @param earCombId Kaninens øremærke-id
 * @param updatedData De opdaterede data for kaninen
 * @returns Resultat af opdateringen
 */
export async function updateRabbit(
  earCombId: string,
  updatedData: Rabbit_ProfileDTO
): Promise<UpdateRabbitResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }

    if (!earCombId) {
      return {
        success: false,
        error: 'Manglende øremærke-id'
      };
    }

    if (!updatedData.nickName || updatedData.nickName.trim() === '') {
      return {
        success: false,
        error: 'Navn er påkrævet'
      };
    }
      
    // Valider datoer
    if (updatedData.dateOfBirth) {
      const birthDate = new Date(updatedData.dateOfBirth);
      if (isNaN(birthDate.getTime())) {
        return {
          success: false,
          error: 'Ugyldig fødselsdato'
        };
      }
      
      // Fremtidige fødselsdatoer er ikke tilladt
      if (birthDate > new Date()) {
        return {
          success: false,
          error: 'Fødselsdato kan ikke være i fremtiden'
        };
      }
    }
      
    if (updatedData.dateOfDeath) {
      const deathDate = new Date(updatedData.dateOfDeath);
      if (isNaN(deathDate.getTime())) {
        return {
          success: false,
          error: 'Ugyldig dødsdato'
        };
      }
      
      // Hvis både fødsel og død er angivet, skal død være efter fødsel
      if (updatedData.dateOfBirth) {
        const birthDate = new Date(updatedData.dateOfBirth);
        if (deathDate < birthDate) {
          return {
            success: false,
            error: 'Dødsdato kan ikke være før fødselsdato'
          };
        }
      }
    }

    // Kald API endpoint
    await EditRabbit(earCombId, updatedData, accessToken);

    // Returner et success objekt
    return {
      success: true,
      message: 'Kaninen blev opdateret'
    };
  } catch (error) {
    console.error('Failed to update rabbit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl ved opdatering af kaninen'
    };
  }
}

// ====================== DELETE ======================

/**
 * Server Action: Sletter en kanin
 * @param earCombId Kaninens øremærke-id
 * @returns Resultat af sletningen med success flag og besked
 */
export async function deleteRabbit(earCombId: string): Promise<DeleteRabbitResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    if (!earCombId) {
      return {
        success: false, 
        error: 'Manglende øremærke-id'
      };
    }
    
    // Kald API endpoint
    await DeleteRabbit(earCombId, accessToken);
    
    // Returner et success objekt
    return {
      success: true,
      message: 'Kaninen blev slettet'
    };
  } catch (error) {
    console.error('Failed to delete rabbit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl ved sletning af kaninen'
    };
  }
}