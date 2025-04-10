// src/app/actions/rabbit/rabbitSaleDetailsCrudAction.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
    Rabbit_CreateSaleDetailsDTO, Rabbit_UpdateSaleDetailsDTO, Rabbit_SaleDetailsDTO
} from '@/api/types/AngoraDTOs';
import {
    CreateSaleDetails, UpdateSaleDetails, DeleteSaleDetails
} from '@/api/endpoints/rabbitController';

export type SaleDetailsResult =
    | { success: true; data: Rabbit_SaleDetailsDTO; message: string }
    | { success: false; error: string };

export type DeleteSaleDetailsResult =
    | { success: true; message: string }
    | { success: false; error: string };

/**
 * Server Action: Opretter salgsdetaljer for en kanin
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

/**
 * Server Action: Opdaterer salgsdetaljer for en kanin
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

        //console.log('Updating sale details with ID:', saleDetailsId, 'Data:', saleDetails);

        const result = await UpdateSaleDetails(saleDetailsId, saleDetails, accessToken);

        console.log('Update result:', result);

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

/**
 * Server Action: Sletter salgsdetaljer for en kanin
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