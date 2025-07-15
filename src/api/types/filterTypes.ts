// src/api/types/filterTypes.ts

/**
 * Filter interface for kaniner til salg
 * Alle felter er valgfrie da søgning kan udføres på hvilken som helst kombination
 */
export interface Rabbit_ForSaleFilterDTO {
    rightEarId?: string | null;
    bornAfter?: string | null;
    minZipCode?: number | null;
    maxZipCode?: number | null;
    city?: string | null;
    race?: string | null;
    color?: string | null;
    gender?: string | null;
    page?: number;
    pageSize?: number;
}

/**
 * Filter interface for brugerens egne kaniner
 * Alle filtre er valgfrie søgeparametre
 */
// src/api/types/filterTypes.ts
export interface OwnFilters {
    search?: string;
    gender?: string | null;
    race?: string | null;
    color?: string | null;
    forSale?: boolean;  // true = kun til salg, false = alle
    isForBreeding?: boolean;
    lifeStatus?: boolean | null;  // NULL = vis alle, true = kun døde, false = kun levende
    showJuveniles?: boolean; 
    raceColorApproval?: string | null;
    bornAfterDate?: string | null;
}

/**
 * Filter interface for avlskaniner
 * Alle filtre er valgfrie søgeparametre
 */
export interface BreedingFilters {
    search?: string;
    Gender?: string | undefined;
    Race?: string | undefined;
    Color?: string | undefined;
    raceColorApproval?: string | undefined;
    bornAfterDate?: string | null;
    minZipCode?: number | undefined;
    maxZipCode?: number | undefined;
}