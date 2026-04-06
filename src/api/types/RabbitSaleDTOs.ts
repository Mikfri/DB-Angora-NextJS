// src/api/types/RabbitSaleDTOs.ts

import { SaleDetailsBasePostPutDTO, SaleDetailsFilterDTO, SaleDetailsPrivateDTO } from "./SaleDetailsDTOs";

/**
 * DTO til oprettelse og opdatering af RabbitSaleDetails, tilhørende en kanin.
 * Bruger composition med SaleDetailsBasePostPutDTO for base properties.
 * 
 * NOTE: Status opdateres via dedikeret UpdateSaleStatusAsync metode i SaleServices.
 */
export interface RabbitPostPutSaleDetailsDTO {
    // --- SaleDetails
    baseProperties: SaleDetailsBasePostPutDTO;
    // --- RabbitSaleDetails
    isLitterTrained: boolean;
    isNeutered: boolean;
    homeEnvironment: string;
}

/**
 * Filter interface for kaniner til salg. Alle felter er valgfrie da søgning kan udføres på hvilken som helst kombination.
 * NB! Indeholder både Rabbit-specifikke filtre, UserOwner-filtre og SaleDetails-filtre, da disse alle er relevante for at kunne filtrere på kaniner til salg.
 * Dog ingen filtre på RabbitSaleDetails, da disse ikke er standard for alle entitetstyper.
 */
export interface RabbitSaleFilterDTO extends SaleDetailsFilterDTO {
    rightEarId?: string | null;
    bornAfter?: string | null;
    race?: string | null;
    gender?: string | null;
    color?: string | null;
}

/**
 * Indeholder RabbitSaleDetails propertiesne, inklusive base SaleDetails med photos og profilePhotoUrl.
 * 
 * NB: (extends SaleDetailsPrivateDTO)
 */
export interface RabbitSaleProfilePrivateDTO extends SaleDetailsPrivateDTO {
    isLitterTrained: boolean;
    isNeutered: boolean;
    homeEnvironment: string;        // enums: "Indendørs", "Udendørs", "Indendørs_og_udendørs"
}