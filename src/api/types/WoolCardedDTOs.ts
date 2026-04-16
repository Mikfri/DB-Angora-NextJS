// src/api/types/WoolCardedDTOs.ts

import { SaleDetailsBasePostPutDTO, SaleDetailsFilterDTO, SaleDetailsPrivateDTO } from "./SaleDetailsDTOs";

/**
 * Repræsenterer en enkelt fiberkomponent i kartet uld.
 * Bruger vægt-baseret model (procent beregnes automatisk i domain).
 * 
 * Benyttes i POST/PUT
 */
export interface WoolCardedFiberComponentDTO {
    type: string;
    weightInGrams: number;
}
export type WoolCardedFiberComponentsList = WoolCardedFiberComponentDTO[];

/**
 * Repræsenterer en enkelt fiberkomponent i kartet uld, inklusive den beregnede procentdel baseret på vægt i forhold til totalvægt.
 * 
 * Benyttes i GET (læsning), hvor procentdelen er relevant at vise.
 */
export interface WoolCardedFiberComponentReadDTO {
    type: string;
    weightInGrams: number;
    percentage: number; 
}

/**
 * DTO til oprettelse og opdatering af en kartet-uld salgsannonce.
 * Bruger composition med SaleDetailsBasePostPutDTO for base properties.
 */
export interface WoolCardedPostPutSaleDetailsDTO {
    baseProperties: SaleDetailsBasePostPutDTO;
    averageFiberLengthInCm: number;
    // --- Color
    naturalColor: string | null;
    dyedColor: string | null;
    // --- Fiber components
    fiberComponents: WoolCardedFiberComponentDTO[];
}

export interface WoolCardedSaleFilterDTO extends SaleDetailsFilterDTO {
    // --- WoolCarded-specific filters
    isDyed?: boolean | null; // true = kun farvet, false = kun naturlig, null/undefined = begge
    naturalColor?: string | null;
    dyedColor?: string | null;
    fiberType?: string | null; // Filtrering på specifik fiber type i fiberComponents (fx "Angora", "Alpaca", etc.)
    minAverageFiberLengthCm?: number | null;
    maxAverageFiberLengthCm?: number | null;
    minTotalWeightGrams?: number | null;
    maxTotalWeightGrams?: number | null;
}

/**
 * Viser alle relevante oplysninger en salgsannonce for kartet uld.
 * 
 * Metoden er henvendt til en authoriseret bruger, 
 * da den via SaleDetailsPrivateDTO, viser følsomme oplysninger.
 */
export interface WoolCardedSaleProfilePrivateDTO extends SaleDetailsPrivateDTO {
    color: string;      // WoolColor
    averageFiberLengthInCm?: number  | null;
    totalWeightInGrams: number;
    fiberComponents: WoolCardedFiberComponentReadDTO[];
}
