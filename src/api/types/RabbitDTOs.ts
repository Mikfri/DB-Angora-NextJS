// src/api/types/RabbitDTOs.ts

import { PhotoPrivateDTO, PhotoPublicDTO } from './PhotoDTOs';
import { RabbitSaleProfilePrivateDTO } from './RabbitSaleDTOs';
import { SaleDetailsBaseAndEntityDTO, SaleDetailsBasePostPutDTO, SaleDetailsPrivateDTO, SaleDetailsFilterDTO } from './SaleDetailsDTOs';

/**
 * Indeholder de properties som benyttes i oversigten over unger på en kanin profil.
 */
export interface Rabbit_ChildPreviewDTO {
    earCombId: string;
    dateOfBirth: string;
    nickName?: string | null;
    color: string;
    gender: string;
    otherParentId?: string | null;
    profilePhotoUrl?: string | null;
}

/**
 * Indeholder de properties som brugeren skal udfylde for at oprette en kanin.
 */
export interface Rabbit_CreateDTO {
    rightEarId: string;
    leftEarId: string;
    nickName?: string | null;
    race: string;               // Required, men ikke nullable
    gender: string;             // Required, men ikke nullable
    color: string;              // Required, men ikke nullable
    dateOfBirth: string;        // string($date)
    dateOfDeath?: string | null;    
    isForBreeding: boolean;
    fatherId_Placeholder?: string | null;
    motherId_Placeholder?: string | null;
}

/**
 * Filter interface for kaniner til avl. Alle felter er valgfrie da søgning kan udføres på hvilken som helst kombination
 */
export interface Rabbit_ForbreedingFilterDTO {
    rightEarId?: string | null;
    bornAfter?: string | null;
    minZipCode?: number | null;
    maxZipCode?: number | null;
    city?: string | null;
    race?: string | null;
    gender?: string | null;
    color?: string | null;
    approvedRaceColorCombination?: boolean | null;
}

/**
 * Preview oplysningerne for kaniner, som er tilgængelige for avl. 
 * Indeholder kun properties som er relevante for at kunne filtrerer på via CSR.
 */
export interface Rabbit_ForbreedingPreviewDTO {      // Preview for avlerer
    // --- Rabbit
    earCombId: string;
    nickName: string | null;
    race: string | null;
    color: string | null;
    approvedRaceColorCombination: boolean | null;
    gender: string | null;
    dateOfBirth: string | null;
    //dateOfDeath: string | null;
    ungdyrGruppe_M: boolean | null;
    //isForBreeding: boolean | null;
    fatherId_Placeholder: string | null;
    father_EarCombId: string | null;
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    inbreedingCoefficient: number;
    profilePhotoUrl: string;
    // --- Rabbit.UserOwner
    ownerFullName: string | null;
    city: string;
    zipCode: number;
    
}
export type Rabbits_ForbreedingPreviewList = Rabbit_ForbreedingPreviewDTO[];

/**
 * Kanin avls-profil oplysningerne, inclusive dens tilhørende:
 * - Salgsoplysninger
 * - Billeder
 */
export interface Rabbit_ForbreedingProfileDTO {
    earCombId: string;
    nickName: string | null;
    //ownerId: string;
    ownerFullName: string | null;
    //originFullName: string | null;
    race: string;
    gender: string;
    color: string;
    approvedRaceColorCombination: boolean;
    dateOfBirth: string;        // API: string($date) format, nullable
    //dateOfDeath: string | null; // Ikke relevant for avls-profil
    ungdyrGruppe_M: boolean;
    //isForBreeding: boolean | null; // Ikke relevant for avls-profil
    fatherId_Placeholder: string | null;
    father_EarCombId: string | null;
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    inbreedingCoefficient: number;
    profilePhotoUrl: string | null;
    // --- DTO'er
    saleDetailsEmbedded: SaleDetailsBaseAndEntityDTO | null;
    photos: PhotoPublicDTO[];
    //children: Rabbit_ChildPreviewDTO[]; // Ikke relevant for avls-profil
}


/**
 * Filter interface for brugerens egne kaniner. Alle filtre er valgfrie søgeparametre, da brugeren kan vælge at filtrere på hvilken som helst kombination af parametre.
 * Indeholder både Rabbit-specifikke filtre, UserOwner-filtre og SaleDetails-filtre, da disse alle er relevante for at kunne filtrere på egne kaniner.
 * Dog ingen filtre på RabbitSaleDetails, da disse ikke er standard for alle entitetstyper.
 * 
 * NB: Er muligvis bedst at undlade server filtrering og i stedet blot benytte CSR, efter hentning uden udfyldte filtre.
 */
export interface Rabbit_OwnedFilterDTO {
    onlyDeceased?: boolean | null;
    rightEarId?: string | null;
    leftEarId?: string | null;
    nickName?: string | null;
    race?: string | null;
    gender?: string | null;
    color?: string | null;
    approvedRaceColorCombination?: boolean | null;
    bornAfter?: string | null;
    deathAfter?: string | null;
    fatherId_Placeholder?: string | null;
    motherId_Placeholder?: string | null;
    ungdyrGruppe_M?: boolean | null;
    isForBreeding?: boolean | null;
    includeLinkedRabbits?: boolean | null;
}

/**
 * Preview oplysningerne for ejede kaniner, som benyttes i lister.
 * Indeholder kun properties som er relevante for at kunne filtrerer på.
 */
export interface Rabbit_OwnedPreviewDTO {
    earCombId: string;
    nickName: string | null;
    race: string;
    gender: string;
    color: string;
    approvedRaceColorCombination: boolean;
    dateOfBirth: string;        // DateOnly i C#, string i TS
    dateOfDeath: string | null; // DateOnly i C#, string i TS
    ungdyrGruppe_M: boolean;
    isForBreeding: boolean | null;
    hasSaleDetails: boolean;    // Bemærk: ikke nullable i C#
    
    fatherId_Placeholder: string | null;
    father_EarCombId: string | null;
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    inbreedingCoefficient: number;  // 0.0 - 1.0
    profilePhotoUrl: string | null;
    // --- UserOwner
    isOwnedByTargetedUser: boolean;
    originFullName: string | null;
    ownerFullName: string | null;

}
export type Rabbits_PreviewList = Rabbit_OwnedPreviewDTO[];

/**
 * Benyttes ved oprettelse af en kanin for at tjekke kaninens relation findes og er gyldig.
 */
export interface Rabbit_ParentValidationResultDTO {
    earCombId: string;
    nickName: string;
    race: string;
    color: string;
    isValidParent: boolean;
}


/**
 * Profil oplysningerne for en kanin, inclusive dens tilhørende:
 * - Salgsoplysninger
 * - Billeder
 * - Evt unger, oversigt
 */
export interface Rabbit_ProfileDTO {
    // --- Rabbit
    earCombId: string;
    nickName?: string | null;    
    race: string;
    gender: string;
    color: string;
    approvedRaceColorCombination: boolean;
    dateOfBirth: string;        // API: string($date) format, nullable
    dateOfDeath?: string | null;
    ungdyrGruppe_M: boolean;
    isForBreeding?: boolean | null;
    fatherId_Placeholder?: string | null;
    father_EarCombId?: string | null;
    motherId_Placeholder?: string | null;
    mother_EarCombId?: string | null;
    inbreedingCoefficient: number;
    profilePhotoId?: string | null;
    profilePhotoUrl?: string | null;
    // --- UserOwner
    ownerId: string;
    ownerFullName?: string | null;
    // --- UserOrigin
    originFullName?: string | null;
    // --- DTO'er
    saleDetailsEmbedded?: RabbitSaleProfilePrivateDTO | null;
    photos?: PhotoPrivateDTO[]  | null;
    children?: Rabbit_ChildPreviewDTO[] | null;
}

/**
 * Indeholder de properties som man må redigere på en kanin.
 */
export interface Rabbit_UpdateDTO {
    nickName: string | null;
    race: string | null;
    gender: string | null;
    color: string | null;
    dateOfBirth: string | null;
    dateOfDeath: string | null;
    isForBreeding: boolean | null;
    fatherId_Placeholder: string | null;
    motherId_Placeholder: string | null;
}



/**
 * Historiske snapshot oplysninger for en kanin i forbindelse med en transfer, som viser kaninens data frozen på tidspunktet for transfer-accept.
 * Indeholder både Rabbit-data, UserOwner-data og SaleDetails-data, som de så ud på tidspunktet for transfer-accept.
 * Benyttes til at kunne vise historiske data for kaninen i forbindelse med en transfer, uden at disse påvirkes af efterfølgende ændringer i kaninens profil.
 */
export interface RabbitSnapshotDTO {
    id: number;
    snapshotDate: string;
    reason: string;
    // --- Party names (frozen at time of snapshot)
    issuerFullName: string;
    recipientFullName: string;
    // --- Rabbit data
    earCombId: string;
    rightEarId: string;
    leftEarId: string;
    nickName: string | null;
    race: string;
    gender: string;
    color: string;
    dateOfBirth: string;
    dateOfDeath: string | null;
    profilePhotoUrl: string | null;
    // --- Sale terms at time of transfer
    salePrice: number | null;
    saleConditions: string | null;
    wasLitterTrained: boolean;
    wasNeutered: boolean;
    homeEnvironment: string;
}