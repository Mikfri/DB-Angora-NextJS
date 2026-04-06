// src/api/types/YarnDTOs.ts

import { SaleDetailsBasePostPutDTO, SaleDetailsFilterDTO } from "./SaleDetailsDTOs";

/**
 * Repræsenterer en enkelt fiberkomponent i en garnsammensætning.
 */
export interface YarnFiberComponentDTO {
    type: string;                       // fiber type
    percentage: number; 
    fiberLengthInCm?: number | null;    // Valgfri property, relevant for visse fiber typer
}

/**
 * DTO til oprettelse og opdatering af garn salgsannonce.
 * Bruges af både POST og PUT endpoints.
 * 
 * NOTE: Status opdateres via dedikeret UpdateSaleStatusAsync metode i SaleServices.
 */
export interface YarnPostPutSaleDetailsDTO {
    // --- Base SaleDetails properties
    baseProperties: SaleDetailsBasePostPutDTO;
    // --- Garn-specifikke properties
    weightInGrams: number;
    lengthInMeters: number;
    // --- Categorization
    applicationCategory: string;
    consistency: string;
    // --- Quality
    plyCount?: number | null;
    twistAmount?: string | null;
    softnessScore?: number | null;      // 1-10 skala, hvor 10 er mest blødt
    durabilityScore?: number | null;    // 1-10 skala, hvor 10 er mest holdbart
    // --- Gauge
    needleSizeRange_MinMm?: number | null;
    needleSizeRange_MaxMm?: number | null;
    wpiCategory?: string | null;
    stitchesPer10cm?: number | null;
    rowsPer10cm?: number | null;
    // --- Color
    naturalColor: string | null;
    dyedColor: string | null;
    // --- Fiber components
    fiberComponents: YarnFiberComponentDTO[];
}


export interface YarnSaleFilterDTO extends SaleDetailsFilterDTO {
    // --- Garn-specifikke filters
    applicationCategory?: string | null;
    weightCategory?: string | null;
    fiberType?: string | null;
    plyCount?: number | null;
    minNeedleSizeMm?: number | null;
    maxNeedleSizeMm?: number | null;
    minSoftnessScore?: string | null;
    minDurabilityScore?: string | null;
}

/**
 * Output/profil DTO (private profil view), der svarer til C#-record:
 * YarnSaleProfilePrivateDTO : SaleDetailsPrivateDTO
 */
export interface YarnSaleProfilePrivateDTO {
  // === FYSISKE MÅL ===
  weightInGrams: number;
  lengthInMeters: number;
  // Snapshot/computed
  gristDescription: string;
  // === KATEGORISERING ===
  applicationCategory: string;
  weightCategory: string;

  // === TEKNISKE DETALJER ===
  plyCount?: number | null;
  gauge: string;
  twistAmount?: string;
  // === KVALITATIVE BESKRIVELSER ===
  consistency: string;
  softness?: string;
  durability?: string;

  // === FARVE OG FIBER ===
  color: string;        // enten enum WoolNaturalColor eller WoolDyedColor 
  fiberComponents: YarnFiberComponentDTO[];
}