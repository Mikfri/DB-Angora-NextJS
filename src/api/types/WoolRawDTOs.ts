// src/api/types/WoolRawDTOs.ts
import { SaleDetailsBasePostPutDTO, SaleDetailsFilterDTO, SaleDetailsPrivateDTO } from "./SaleDetailsDTOs";

export interface WoolRawPostPutSaleDetailsDTO {
    // --- Base SaleDetails properties
    baseProperties: SaleDetailsBasePostPutDTO;
    // --- WoolRawSaleDetails properties
    fiberType: string;
    naturalColor: string | null;
    fiberLengthInCm: number;
    weightInGrams: number;
}

export interface WoolRawSaleFilterDTO extends SaleDetailsFilterDTO {
    fiberType?: string;
    naturalColor?: string | null;
    minFiberLengthCm?: number;
    maxFiberLengthCm?: number;
    minWeightGrams?: number;
    maxWeightGrams?: number;
}

/**
 * Viser alle relevante oplysninger en salgsannonce for rå uld.
 * 
 * Metoden er henvendt til en authoriseret bruger, 
 * da den via SaleDetailsPrivateDTO, viser følsomme oplysninger.
 */
export interface WoolRawSaleProfilePrivateDTO extends SaleDetailsPrivateDTO {
    fiberType: string;
    naturalColor: string;
    fiberLengthInCm: number;
    weightInGrams: number;
}