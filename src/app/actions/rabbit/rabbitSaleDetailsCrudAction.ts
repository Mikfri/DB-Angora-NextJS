// src/app/actions/rabbit/rabbitSaleDetailsCrudAction.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { 
  Rabbit_CreateSaleDetailsDTO, 
  Rabbit_UpdateSaleDetailsDTO,
  SaleDetailsProfileDTO
} from '@/api/types/AngoraDTOs';
import { 
  CreateSaleDetails, 
  UpdateSaleDetails, 
  DeleteSaleDetails 
} from '@/api/endpoints/rabbitController';

// =============== TYPES ===============

export type CreateSaleDetailsResult = 
  | { success: true; data: SaleDetailsProfileDTO }
  | { success: false; error: string };

export type UpdateSaleDetailsResult = 
  | { success: true; message: string }
  | { success: false; error: string };

export type DeleteSaleDetailsResult = 
  | { success: true; message: string }
  | { success: false; error: string };

// =============== CREATE ===============

/**
 * Server Action: Opretter et salgsopslag for en kanin
 * @param earCombId Kaninens øremærke-id
 * @param saleDetailsData Data for det nye salgsopslag
 * @returns Resultat af oprettelsen med det nye salgsopslag ved succes
 */
export async function createRabbitSaleDetails(
  earCombId: string,
  saleDetailsData: Rabbit_CreateSaleDetailsDTO
): Promise<CreateSaleDetailsResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }

    // Kald API endpoint og håndter API-fejlbeskeder
    try {
      const saleDetails = await CreateSaleDetails(
        earCombId,
        saleDetailsData,
        accessToken
      );
      return {
        success: true,
        data: saleDetails
      };
    } catch (apiError) {
      // API-fejl (fx 400, 401, 403, 404)
      return {
        success: false,
        error: apiError instanceof Error ? apiError.message : 'Der skete en fejl ved oprettelse'
      };
    }
  } catch (error) {
    console.error('Failed to create sale details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

// =============== UPDATE ===============

/**
 * Server Action: Opdaterer et eksisterende salgsopslag for en kanin
 * @param earCombId Kaninens øremærke-id
 * @param updatedData De opdaterede salgsdata
 * @returns Resultat af opdateringen
 */
export async function updateRabbitSaleDetails(
  earCombId: string,
  updatedData: Rabbit_UpdateSaleDetailsDTO
): Promise<UpdateSaleDetailsResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    // Validér data på server-siden
    if (!updatedData.title || updatedData.title.trim() === '') {
      return {
        success: false, 
        error: 'Titel er påkrævet'
      };
    }
    
    if (updatedData.price <= 0) {
      return {
        success: false, 
        error: 'Prisen skal være større end 0'
      };
    }
    
    // Kald API endpoint
    const success = await UpdateSaleDetails(
      earCombId, 
      updatedData, 
      accessToken
    );
    
    if (!success) {
      return {
        success: false,
        error: 'Kunne ikke opdatere salgsopslaget'
      };
    }
    
    // Returner et success objekt
    return {
      success: true,
      message: 'Salgsopslaget blev opdateret'
    };
  } catch (error) {
    console.error('Failed to update sale details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

// =============== DELETE ===============

/**
 * Server Action: Sletter et salgsopslag for en kanin
 * @param earCombId Kaninens øremærke-id
 * @returns Resultat af sletningen
 */
export async function deleteRabbitSaleDetails(
  earCombId: string
): Promise<DeleteSaleDetailsResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    // Kald API endpoint
    await DeleteSaleDetails(earCombId, accessToken);
    
    // Returner et success objekt
    return {
      success: true,
      message: 'Salgsopslaget blev slettet'
    };
  } catch (error) {
    console.error('Failed to delete sale details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}