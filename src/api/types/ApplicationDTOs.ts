// src/api/types/ApplicationDTOs.ts


export interface ApplicationBreeder_CreateDTO {
    requestedBreederRegNo: string; // Det ønskedede AvlerNummer
    documentationPath: string;     // Billede dokumentation i form af et billede uploadet til Cloudinary (URL)
}

/**
 * DTO for at vise information om en avleransøgning, typisk til admin/moderator visning.
 */
export interface ApplicationBreeder_DTO {
    id: number; 
    userName: string;
    fullName: string;
    requestedBreederRegNo: string;
    aprovedBreederRegNo: string | null; // Det godkendte AvlerNummer, eller null hvis ansøgningen stadig er under behandling
    applicationStatus: string;          // "Pending", "Approved", "Rejected"
    dateSubmitted: string;
    documentationPath: string;          // Billede dokumentation i form af et billede uploadet til Cloudinary (URL)
    rejectionReason?: string | null;    // Valgfrit felt der indeholder årsagen til afvisning, hvis ansøgningen er afvist
    reviewedById?: string | null;       // Id på administrator der har behandlet ansøgningen, eller null hvis den stadig er under behandling
    reviewedByName?: string | null;     // Navn på administrator der har behandlet ansøgningen, eller null hvis den stadig er under behandling
    reviewedAt?: string | null;         // Dato og tid for hvornår ansøgningen blev behandlet, eller null hvis den stadig er under behandling
    isReviewed: boolean;
    hasExistingRabbits: boolean;        // Om ansøgeren allerede har kaniner i systemet, der kan linkes. (Hvis andre avlere har kaniner med ansøgerens avler nummer i sit højre-øre.)
    potentialRabbitLinksCount: number;  // Antal kaniner, der vil blive linket ved godkendelse
}


// export interface ApplicationBreeder_PreviewDTO {
//     id: number;
//     applicationStatus: string; // "Pending", "Approved", "Rejected"
//     dateSubmitted: string;
//     userApplicant_FullName: string;
//     userApplicant_RequestedBreederRegNo: string;
//     userApplicant_DocumentationPath: string;
//     userApplicant_RejectionReason?: string | null;
// }

/**
 * DTO til respons på avleransøgning (godkendelse eller afvisning) udført af administrator/moderator.
 */
export interface ApplicationBreeder_ResponseDTO {
    isApproved: boolean;
    overrideBreederRegNo?: string | null; // Hvis admin ønsker at godkende ansøgningen, men tildele et andet avlernummer end det ansøgeren har foreslået, kan det gøres her. Skal være unikt og opfylde kravene for avlernumre.
    rejectionReason?: string | null; // Hvis admin ønsker at afvise ansøgningen, kan en årsag til afvisningen angives her. Dette er valgfrit,    
}

export interface ApplicationBreederFilterDTO {
    applicationStatus?: string | null; // "Pending", "Approved", "Rejected"
    fromDate?: string | null; // ISO date string
    toDate?: string | null;   // ISO date string
    requestedRegNoContains?: string | null; // Søgning efter del af det ønskede avlernummer
    userNameContains?: string | null; // Søgning efter del af ansøgerens brugernavn
    fullNameContains?: string | null; // Søgning efter del af ansøgerens fulde navn
    reviewedById?: string | null; // Filtrering efter administrator der har behandlet ansøgningen
    isReviewed?: boolean | null; // Filtrering efter om ansøgningen er blevet behandlet (godkendt eller afvist)
    pageSize?: number;
    pageNumber?: number;
}
