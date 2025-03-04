// src/api/types/filterTypes.ts

/**
 * Filter interface for kaniner til salg
 * Alle felter er valgfrie da søgning kan udføres på hvilken som helst kombination
 */
export interface ForSaleFilters {
    RightEarId?: string | null;
    BornAfter?: string | null;
    MinZipCode?: number | null;
    MaxZipCode?: number | null;
    Race?: string | null;
    Color?: string | null;
    Gender?: string | null;
}

/**
 * Filter interface for brugerens egne kaniner
 * Alle filtre er valgfrie søgeparametre
 */
export interface OwnFilters {
    search?: string;
    Gender?: string;
    Race?: string;
    Color?: string;
    ForSale?: boolean;
    ForBreeding?: boolean;
    showDeceased?: boolean;
    raceColorApproval?: string;
    bornAfterDate?: string | null;
}

/**
 * Filter interface for avlskaniner
 * Alle filtre er valgfrie søgeparametre
 */
export interface BreedingFilters {
    search?: string;
    Gender?: string;
    Race?: string;
    Color?: string;
    raceColorApproval?: string;
    bornAfterDate?: string | null;
    minZipCode?: number;
    maxZipCode?: number;
}