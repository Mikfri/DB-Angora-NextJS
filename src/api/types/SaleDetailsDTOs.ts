// src/api/types/SaleDetailsDTOs.ts

import { PhotoPrivateDTO, PhotoPublicDTO } from './PhotoDTOs';



/**
 * Generisk SaleDetails DTO, som indeholder SaleDetails + [EntityType]SaleDetails via en dictionary
 */
export interface SaleDetailsBaseAndEntityDTO {
    // --- SaleDetails (base)
    id: number;
    entityType: string;     // "Rabbit", "WoolSD", YarnSD etc...
    title: string;
    price: number;
    status: string;         // "Active", "OnHold", "Sold"
    dateListed: string;
    canBeShipped: boolean;
    viewCount: number;
    description: string;
    // --- Entity-specific SaleDetails properties
    entityTypeSaleProperties: { [key: string]: string };
}

/**
 * Indeholder de basale properties fra SaleDetails, som opretteren selv skal angive.
 * 
 * NB: Status håndteres separat.
 */
export interface SaleDetailsBasePostPutDTO {
    title: string;
    price: number;
    description: string;
    canBeShipped: boolean;
}


/**
 * En liste af SaleDetailsCardDTO'er, som kan bruges til at vise flere salgsoplysninger i en liste eller grid.
 * Dette er blot en typealias for bedre læsbarhed og semantisk klarhed i koden.
 */
export type SaleDetailsPublicCardList = SaleDetailsPublicCardDTO[];




/**
 * Filtreringsparametre til søgning af base SaleDetails oplysninger (inklusive ejer oplysninger).
 * 
 * Alle parametre er valgfrie.
 */
export interface SaleDetailsFilterDTO {
    minPrice?: number | null;
    maxPrice?: number | null;
    canBeShipped?: boolean | null;
    entityType?: string | null;     // "Rabbit", "WoolSD", etc.
    city?: string | null;
    minZipCode?: number | null;
    maxZipCode?: number | null;
    sortBy?: string | null;          // "Newest", "MostViewed"
}

/**
 * Indeholder base SaleDetails + UserOwner kontaktoplysninger.
 * Er målrettet til brug for private salgs visninger med følsomme oplysninger - nødvendig for redigering.
 */
export interface SaleDetailsPrivateCardDTO {
    // --- SaleDetails
    id: number;
    slug: string;
    entityType: string;     // Type af entitet (Rabbit, WoolSD, YarnSD, etc.)
    title: string;
    //subtitle?: string | null; // Udtaget
    status: string;         // "Active", "OnHold", "Sold"
    price: number;
    dateListed: string;     // DateTime
    canBeShipped: boolean;
    viewCount: number;
    profilePhotoUrl: string | null;
}

/**
 * Indeholder base SaleDetails + UserOwner lokation oplysninger. 
 * 
 * Benyttes via arv af DTO'er af typen: [EntityType]SaleProfilePrivateDTO. 
 */
export interface SaleDetailsPrivateDTO {
    // --- NON-EDITABLE PROPERTIES (base SaleDetails + UserOwner)
    id: number;
    entityType: string;     // "Rabbit", "WoolSD", etc.
    slug: string;
    dateListed: string;     // DateTime
    lastUpdated: string;    // DateTime    
    //dateSold?: string | null; // DateTime (endnu  ikke implementeret)
    viewCount: number;
    // --- EDITABLE POPERTIES
    status: string;         // "Active", "OnHold", "Sold"
    title: string;          // (styrer også slug)
    price: number;
    canBeShipped: boolean;
    description: string;
    // --- Relationer
    //ownerId: number;
    //profilePhotoId: number | null;
    // --- Photos
    profilePhotoUrl: string | null;
    photos: PhotoPrivateDTO[];
}

/**
 * Indeholder alle nødvendige oplysninger for en entitet, der er til salg.
 * DTO'en benytter en dynamisk tilgang ved brug af en Dictionary for:
 * EntityTypeSaleProperties og EntityProperties.
 * Dette gør altså at den samme DTO kan vise entitets specifikke properties.
 */
export interface SaleDetailsProfileDTO {
    // --- USER PROPERTIES
    sellerName: string;
    sellerContact: string; // (phone)
    city: string;
    zipCode: number;
    sellerPhotoUrl?: string | null;
    // --- SALEDETAIL + [ENTITYTYPE]SALEDETAILS
    saleDetails: SaleDetailsBaseAndEntityDTO;
    // --- ENTITY PROPERTIES (extra liste af properties fra en entitet, med 1:1 relation til [EntityType]SaleDetails såsom Rabbit)
    entityProperties: { [key: string]: string };
    // --- Photos
    profilePhotoUrl: string | null;
    photos: PhotoPublicDTO[];
}

/**
 * Indeholder base SaleDetails + UserOwner lokation oplysninger.
 * Er målrettet til brug for offentlige visninger uden følsomme oplysninger.
 * 
 * NB! Indeholder IKKE [EntityType]SaleDetails properties
 */
export interface SaleDetailsPublicCardDTO {
    // --- SaleDetails
    slug: string;
    entityType: string;     // Type af entitet (Rabbit, WoolSD, YarnSD, etc.)
    title: string;
    //subtitle?: string | null; // Udtaget
    price: number;
    status: string;         // "Active", "OnHold", "Sold"
    dateListed: string;     // DateTime
    canBeShipped: boolean;
    viewCount: number;
    profilePhotoUrl: string | null;
    // --- UserOwner
    city: string;
    zipCode: number;
}

