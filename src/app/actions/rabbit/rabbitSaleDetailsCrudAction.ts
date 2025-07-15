// src/app/actions/rabbit/rabbitSaleDetailsCrudAction.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
    Rabbit_CreateSaleDetailsDTO, 
    Rabbit_UpdateSaleDetailsDTO, 
    RabbitSaleDetailsEmbeddedDTO
} from '@/api/types/AngoraDTOs';
import {
    CreateSaleDetails, 
    UpdateSaleDetails, 
    DeleteSaleDetails
} from '@/api/endpoints/rabbitController';

// ====================== TYPES ======================

export type SaleDetailsResult =
    | { success: true; data: RabbitSaleDetailsEmbeddedDTO; message: string }
    | { success: false; error: string };

export type DeleteSaleDetailsResult =
    | { success: true; message: string }
    | { success: false; error: string };

// ====================== CREATE ======================

/**
 * Server Action: Opretter salgsdetaljer for en kanin
 * @param saleDetails Data for at oprette salgsdetaljer
 * @returns Resultat med salgsdetaljer eller fejlbesked
 */
export async function createRabbitSaleDetails(
    saleDetails: Rabbit_CreateSaleDetailsDTO
): Promise<SaleDetailsResult> {
    try {
        const accessToken = await getAccessToken();
        
        if (!accessToken) {
            return {
                success: false,
                error: 'Du er ikke logget ind'
            };
        }
        
        const result = await CreateSaleDetails(saleDetails, accessToken);
        
        return {
            success: true,
            data: result,
            message: 'Kaninen er nu sat til salg'
        };
    } catch (error) {
        console.error('Failed to create sale details:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
        };
    }
}

// ====================== UPDATE ======================

/**
 * Server Action: Opdaterer salgsdetaljer for en kanin
 * @param earCombId Kaninens øremærke-id
 * @param saleDetails Opdaterede salgsdetaljer
 * @returns Resultat med opdaterede salgsdetaljer eller fejlbesked
 */
export async function updateRabbitSaleDetails(
    earCombId: string,  // Ændret fra saleDetailsId: number
    saleDetails: Rabbit_UpdateSaleDetailsDTO
): Promise<SaleDetailsResult> {
    try {
        const accessToken = await getAccessToken();
        
        if (!accessToken) {
            return {
                success: false,
                error: 'Du er ikke logget ind'
            };
        }
        
        const success = await UpdateSaleDetails(earCombId, saleDetails, accessToken);
        
        if (success) {
            // Vi har ikke den opdaterede data tilbage, så vi konstruerer et resultat
            return {
                success: true,
                // Dette er en simplificeret version - du skal opdatere profilen i stedet
                data: {} as RabbitSaleDetailsEmbeddedDTO, 
                message: 'Salgsdetaljer opdateret'
            };
        } else {
            return {
                success: false,
                error: 'Kunne ikke opdatere salgsdetaljer'
            };
        }
    } catch (error) {
        console.error('Failed to update sale details:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
        };
    }
}

// ====================== DELETE ======================

/**
 * Server Action: Sletter salgsdetaljer for en kanin
 * @param earCombId Kaninens øremærke-id
 * @returns Resultat med success flag og besked
 */
export async function deleteRabbitSaleDetails(
    earCombId: string  // Ændret fra saleDetailsId: number
): Promise<DeleteSaleDetailsResult> {
    try {
        const accessToken = await getAccessToken();
        
        if (!accessToken) {
            return {
                success: false,
                error: 'Du er ikke logget ind'
            };
        }
        
        await DeleteSaleDetails(earCombId, accessToken);
        
        return {
            success: true,
            message: 'Kaninen er ikke længere til salg'
        };
    } catch (error) {
        console.error('Failed to delete sale details:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
        };
    }
}