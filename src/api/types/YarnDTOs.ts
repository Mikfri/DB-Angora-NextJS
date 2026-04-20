// src/api/types/YarnDTOs.ts

import { SaleDetailsBasePostPutDTO, SaleDetailsFilterDTO, SaleDetailsPrivateDTO } from "./SaleDetailsDTOs";

/**
 * Repræsenterer en enkelt fiberkomponent i en garnsammensætning.
 */
export interface YarnFiberComponentDTO {
  type: string;                       // enum (FiberType) fx "Uld", "Bomuld", "Alpaca" etc.
  percentage: number;                 // Procentdel af denne FiberType op imod andre YarnFiberComponentDTO i fiberComponents arrayet. Skal summeres til 100% for hele garnet.
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
  // --- Quality
  plyCount?: number | null;
  twistAmount?: string | null;
  // --- Gauge (Strikkefasthed)
  needleSizeRange_MinMm?: number | null;      // SKAL sættes
  needleSizeRange_MaxMm?: number | null;      // SKAL sættes
  wpiCategory?: string | null;                // Enum (YarnWpiCategory) Alternativ til at angive needleSizeRange_MinMm og needleSizeRange_MaxMm
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
}

/**
 * Output/profil DTO (private profil view), der svarer til C#-record:
 * YarnSaleProfilePrivateDTO : SaleDetailsPrivateDTO
 */
export interface YarnSaleProfilePrivateDTO extends SaleDetailsPrivateDTO {
  // === FYSISKE MÅL ===
  weightInGrams: number;
  lengthInMeters: number;
  // Snapshot/computed
  gristDescription: string;         // Løbelængdebeskrivelse, fx "100m/50g" (beregnet ud fra weightInGrams og lengthInMeters)
  // === KATEGORISERING ===
  applicationCategory: string;      // enum
  weightCategory: string;           // enum (beregnes ud fra Gauge.NeedleSizeRange)

  // === TEKNISKE DETALJER ===
  plyCount?: number | null;
  gauge: {                          // Strikkefasthed
    recommendedNeedleSizeRange: {
      minMm: number | null;
      maxMm: number | null;
      midpoint: number | null;
    } | null;
    stitchesPer10Cm: number | null;
    rowsPer10Cm: number | null;
  };
  twistAmount?: string;

  // === FARVE OG FIBER ===
  color: {
    naturalColor: string | null;    // enum (WoolNaturalColors)
    dyedColor: string | null;       // enum (WoolDyedColors)
    isDyed: boolean;
  };
  fiberComponents: YarnFiberComponentDTO[];
}
