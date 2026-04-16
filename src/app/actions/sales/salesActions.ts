// src/app/actions/sales/salesActions.ts
'use server';

import {
    SaleDetailsPublicCardDTO,
    SaleDetailsProfileDTO,
    ResultPagedDTO,
    SaleDetailsFilterDTO
} from '@/api/types/AngoraDTOs';
import { PeltSaleFilterDTO } from '@/api/types/PeltDTOs';
import { YarnSaleFilterDTO } from '@/api/types/YarnDTOs';
import { WoolRawSaleFilterDTO } from '@/api/types/WoolRawDTOs';
import { WoolCardedSaleFilterDTO } from '@/api/types/WoolCardedDTOs';
import {
    GetAllSaleItemsFiltered,
    GetRabbitSaleItemsFiltered,
    GetYarnSaleItemsFiltered,
    GetWoolRawSaleItemsFiltered,
    GetWoolCardedSaleItemsFiltered,
    GetPeltSaleItemsFiltered,
    GetSaleItemsByBreederRegNo,
    GetSaleDetailsBySlug
} from '@/api/endpoints/saleController';
import { RabbitSaleFilterDTO } from '@/api/types/RabbitSaleDTOs';

// ====================== TYPES ======================

export type SaleListResult =
    | { success: true; data: ResultPagedDTO<SaleDetailsPublicCardDTO> }
    | { success: false; error: string };

export type SaleDetailsResult =
    | { success: true; data: SaleDetailsProfileDTO }
    | { success: false; error: string };


// ====================== READ (BY SLUG) ======================

export async function getSaleDetailsBySlug(slug: string): Promise<SaleDetailsResult> {
    try {
        const data = await GetSaleDetailsBySlug(slug);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der opstod en fejl ved hentning af salgsdetaljer' };
    }
}


// ====================== READ (BY BREEDER) ======================

export async function getSaleItemsByBreederRegNo(
    breederRegNo: string,
    page: number = 1,
    pageSize: number = 12
): Promise<SaleListResult> {
    try {
        const data = await GetSaleItemsByBreederRegNo(breederRegNo, page, pageSize);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}


// ====================== READ (ALL) ======================

export async function getAllSaleItemsFiltered(
    filter: SaleDetailsFilterDTO,
    page: number = 1,
    pageSize: number = 12
): Promise<SaleListResult> {
    try {
        const data = await GetAllSaleItemsFiltered(filter, page, pageSize);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}


// ====================== READ (RABBITS) ======================

export async function getRabbitSaleItems(
    filter: RabbitSaleFilterDTO = {},
    page: number = 1,
    pageSize: number = 12
): Promise<SaleListResult> {
    try {
        const data = await GetRabbitSaleItemsFiltered(filter, page, pageSize);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}


// ====================== READ (YARNS) ======================

export async function getYarnSaleItems(
    filter: YarnSaleFilterDTO = {},
    page: number = 1,
    pageSize: number = 12
): Promise<SaleListResult> {
    try {
        const data = await GetYarnSaleItemsFiltered(filter, page, pageSize);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}


// ====================== READ (WOOL RAW) ======================

export async function getWoolRawSaleItems(
    filter: WoolRawSaleFilterDTO = {},
    page: number = 1,
    pageSize: number = 12
): Promise<SaleListResult> {
    try {
        const data = await GetWoolRawSaleItemsFiltered(filter, page, pageSize);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}


// ====================== READ (WOOL CARDED) ======================

export async function getWoolCardedSaleItems(
    filter: WoolCardedSaleFilterDTO = {},
    page: number = 1,
    pageSize: number = 12
): Promise<SaleListResult> {
    try {
        const data = await GetWoolCardedSaleItemsFiltered(filter, page, pageSize);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}


// ====================== READ (PELTS) ======================

export async function getPeltSaleItems(
    filter: PeltSaleFilterDTO = {},
    page: number = 1,
    pageSize: number = 12
): Promise<SaleListResult> {
    try {
        const data = await GetPeltSaleItemsFiltered(filter, page, pageSize);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}
