// src/api/types/BreederAccountDTOs.ts

import { PhotoPrivateDTO, PhotoPublicDTO } from './PhotoDTOs';

/**
 * DTO til oprettelse af en ny opdrætterkonto.
 */
export interface BreederAccount_CreateDTO {
    //memberNo: string;                 // Denne property er endnu ikke implementeret i backenden
    breederRegNo: string;
    brandName: string;
    brandDescription?: string | null;
}

/**
 * Filtreringsparametre til filtrering af BreederAccounts. Valgfrie parametre.
 */
export interface BreederAccount_FilterDTO {
    page: number;
    pageSize: number;

    city?: string | null;
    minZipCode?: number | null;
    maxZipCode?: number | null;
    brandName?: string | null;
    breederRegNo?: string | null;
    hasRabbitsForSale?: boolean | null;
    hasWoolsForSale?: boolean | null;
    sortBy?: string | null;         // "nearest" (zipcode), "name", "most-items", "newest"
    sortDescending?: boolean | null;
}

/**
 * Preview-card DTO til liste af synlige opdrættere.
 */
export interface BreederAccount_PreviewCardDTO {
    breederRegNo: string;
    brandName: string;
    brandDescription: string;
    profilePhotoUrl?: string | null;
    city?: string | null;
    zipCode?: number | null;
    rabbitsForSaleCount: number;
    woolsForSaleCount: number;
    totalItemsForSale: number;
}

/**
 * Indeholder de private oplysninger for en opdrætter.
 * Disse oplysninger er kun tilgængelige for ejeren af kontoen og evt. administrator.
 */
export interface BreederAccount_PrivateProfileDTO {
    breederRegNo: string;
    memberNo?: string | null;
    brandName: string;
    brandDescription: string;
    isFindable: boolean;
    profilePhotoId?: number | null;
    profilePhotoUrl?: string | null;
    rabbitsOwnedCount: number;
    rabbitsLinkedCount: number;
    woolsOwnedCount: number;
    // --- DTO'er
    photos?: PhotoPrivateDTO[];
}

/**
 * Offentlig opdrætterprofil — tilgængelig uden autentifikation.
 */
export interface BreederAccount_PublicProfileDTO {
    breederRegNo: string;
    brandName: string;
    brandDescription: string;
    profilePhotoUrl?: string | null;
    // Lokation
    city?: string | null;
    zipCode?: number | null;
    rabbitsOwnedCount: number;
    // --- DTO'er
    photos?: PhotoPublicDTO[];
}

/**
 * Inderholder de properties som en opdrætter er istand til at redigere.
 */
export interface BreederAccount_UpdateDTO {
    brandName: string;
    brandDescription: string;
    isFindable: boolean;
}

/**
 * Letvægts DTO til at vise grundlæggende BreederAccount info i "GetMe" endpoint
 */
export interface BreederAccountSummaryDTO {
    breederRegNo: string;
    memberNo: string;
    brandName: string;
    isFindable: boolean;
}
