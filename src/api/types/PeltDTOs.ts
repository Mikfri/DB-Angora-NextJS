// src/api/types/PeltDTOs.ts

import { SaleDetailsBasePostPutDTO, SaleDetailsFilterDTO, SaleDetailsPrivateDTO } from "./SaleDetailsDTOs";

/**
 * DTO til oprettelse og opdatering af Pelt med tilhørende SaleDetails. 
 * DTO'en bruges ved oprettelse eller opdatering af en Pelt, hvor både de generelle salgsdetaljer og de specifikke pelt-egenskaber skal angives i én samlet payload.
 * 
 * Denne DTO indeholder to sektioner:
 * 1. baseProperties: Indeholder de generelle salgsdetaljer, som er fælles for alle typer af salgsoplysninger (Rabbit, Wool, etc.). Disse detaljer håndteres i SaleDetailsBasePostPutDTO.
 * 2. Pelt-specifikke properties: Disse er unikke for Pelt-entiteten og inkluderer egenskaber som farve, race, garvningsmetode, pelskondition, længde og bredde.
 */
export interface PeltPostPutSaleDetailsDTO {
    // --- BASE SALEDETAILS PROPERTIES (NESTED)
    baseProperties: SaleDetailsBasePostPutDTO;
    // --- PELT-SPECIFIC PROPERTIES
    color: string;
    race: string;
    tanningMethod: string;
    peltCondition: string;
    lengthCm: number;
    widthCm: number;
}

export interface PeltSaleFilterDTO extends SaleDetailsFilterDTO {
    // --- PELT-SPECIFIC FILTERS
    race?: string | null;
    color?: string | null;
    tanningMethod?: string | null;
    condition?: string | null;
    minLengthCm?: number | null;
    maxLengthCm?: number | null;
    minWidthCm?: number | null;
    maxWidthCm?: number | null;
}

export interface PeltSaleProfilePrivateDTO extends SaleDetailsPrivateDTO {
    color: string;
    race: string;
    tanningMethod: string;
    condition: string;
    lengthCm: number;
    widthCm: number;
}