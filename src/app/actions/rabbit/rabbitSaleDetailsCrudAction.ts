// src/app/actions/rabbit/rabbitSaleDetailsCrudAction.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
    Rabbit_CreateSaleDetailsDTO, 
    Rabbit_UpdateSaleDetailsDTO, 
    Rabbit_SaleDetailsDTO
} from '@/api/types/AngoraDTOs';
import {
    CreateSaleDetails, 
    UpdateSaleDetails, 
    DeleteSaleDetails
} from '@/api/endpoints/rabbitController';

// ====================== TYPES ======================

export type SaleDetailsResult =
    | { success: true; data: Rabbit_SaleDetailsDTO; message: string }
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
 * @param saleDetailsId ID på salgsdetaljer der skal opdateres
 * @param saleDetails Opdaterede salgsdetaljer
 * @returns Resultat med opdaterede salgsdetaljer eller fejlbesked
 */
export async function updateRabbitSaleDetails(
    saleDetailsId: number,
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
        
        const result = await UpdateSaleDetails(saleDetailsId, saleDetails, accessToken);
        
        return {
            success: true,
            data: result,
            message: 'Salgsdetaljer opdateret'
        };
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
 * @param saleDetailsId ID på salgsdetaljer der skal slettes
 * @returns Resultat med success flag og besked
 */
export async function deleteRabbitSaleDetails(
    saleDetailsId: number
): Promise<DeleteSaleDetailsResult> {
    try {
        const accessToken = await getAccessToken();
        
        if (!accessToken) {
            return {
                success: false,
                error: 'Du er ikke logget ind'
            };
        }
        
        await DeleteSaleDetails(saleDetailsId, accessToken);
        
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