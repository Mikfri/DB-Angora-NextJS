// src/api/types/PedigreeDTOs.ts

/**
 * Viser de enkelte bidragydere til en kanins indavlskoefficient (COI).
 * Hver bidragyder repræsenterer en fælles forfader, og indeholder information om denne forfader,
 * samt hvor meget denne forfader bidrager til den samlede COI.
 * NB! Denne DTO har stort forbagstav i dens properties grundet json-serialisering
 */
export interface COIContributorDTO {
    EarCombId: string;
    NickName: string | null;
    Contribution: number;           // (absolut værdi, 0.0-1.0)
    ContributionPercent: number;    // (procent af total COI)
    AncestorPaths: string[];
}

/**
 * Resultat DTO for stamtavle-beregning.
 * Indeholder den beregnede indavlskoefficient, en liste af bidragende forfædre,
 * samt den fulde stamtavle for kaninen.
 * NB! Denne DTO har stort forbagstav i dens properties grundet json-serialisering
 */
export interface PedigreeResultDTO {
    CalculatedInbreedingCoefficient: number;
    COIContributors: COIContributorDTO[];
    Pedigree: Rabbit_PedigreeDTO;
}



/**
 * DTO til visning af en kanins stamtavle.
 * Indeholder også forfaderens stamtavle rekursivt.
 */
export interface Rabbit_PedigreeDTO {
    Generation: number;
    Relation: string;
    EarCombId: string;
    NickName: string | null;
    Gender: string;
    DateOfBirth: string;
    Race: string;
    Color: string;
    UserOriginName: string | null;
    UserOwnerName: string | null;
    ProfilePhotoUrl: string | null;
    InbreedingCoefficient: number | null;
    AncestorPaths: string[];        // Stier til denne forfader
    // --- DTO'er
    Father: Rabbit_PedigreeDTO | null;
    Mother: Rabbit_PedigreeDTO | null;
}
