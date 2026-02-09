// src/app/actions/sale/saleActions.ts
'use server';

/**
 * @fileoverview Server actions til håndtering af salgsopslag
 * 
 * BEMÆRK: Modsat andre server actions i projektet kræver disse endpoints IKKE authentication.
 * Derfor importeres og bruges getAccessToken() ikke i denne fil.
 * 
 * Alle endpoints i SaleController er designet som offentlige endpoints, så de kan tilgås
 * uden authorization headers. Dette gør det muligt for ikke-indloggede brugere at se
 * salgsopslag.
 * 
 * Denne fil indeholder server actions til:
 * - Hentning af nyeste salgsopslag på tværs af kategorier
 * - Filtrering af salgsopslag baseret på diverse kriterier
 * - Hentning af kanin-specifikke salgsopslag
 * - Hentning af detaljerede salgsdetaljer via ID eller slug
 */

import { 
  SaleDetailsCardDTO,
  SaleDetailsProfileDTO,
  ResultPagedDTO,
  SaleDetails_FilterDTO
} from '@/api/types/AngoraDTOs';
import { 
  GetLatestSaleItems,
  GetAllSaleItemsFiltered,
  GetRabbitSaleItemsFiltered,
  GetSaleDetailsById,
  GetSaleDetailsBySlug
} from '@/api/endpoints/saleController';
import { Rabbit_ForSaleFilterDTO } from '@/api/types/filterTypes';

// ====================== TYPES ======================

export type SaleListResult = 
  | { success: true; data: ResultPagedDTO<SaleDetailsCardDTO> }
  | { success: false; error: string };

export type SaleDetailsResult = 
  | { success: true; data: SaleDetailsProfileDTO }
  | { success: false; error: string; status?: number };

// ====================== READ (LATEST) ======================

/**
 * Server Action: Henter de seneste salgsopslag på tværs af alle kategorier
 * @param page Sidenummer (starter fra 1)
 * @param pageSize Antal opslag pr. side
 * @returns Pagineret liste af salgsopslag
 */
export async function getLatestSaleItems(
  page: number = 1,
  pageSize: number = 12
): Promise<SaleListResult> {
  try {   
    const saleItems = await GetLatestSaleItems(page, pageSize);
    
    return {
      success: true,
      data: saleItems
    };
  } catch (error) {
    console.error('Failed to fetch latest sale items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

// ====================== READ (ALL) ======================

/**
 * Server Action: Henter filtrerede salgsopslag på tværs af alle kategorier
 * @param filter Filtreringsparametre
 * @returns Pagineret liste af filtrerede salgsopslag
 */
export async function getAllSaleItemsFiltered(
  filter: SaleDetails_FilterDTO
): Promise<SaleListResult> {
  try {   
    // Sikrer at page og pageSize er gyldige
    if (!filter.page || filter.page < 1) {
      filter.page = 1;
    }
    
    if (!filter.pageSize || filter.pageSize < 1) {
      filter.pageSize = 12;
    }
    
    // Fjernet accessToken parameter - API'en kræver ikke authentication
    const saleItems = await GetAllSaleItemsFiltered(filter);
    
    return {
      success: true,
      data: saleItems
    };
  } catch (error) {
    console.error('Failed to fetch filtered sale items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

// ====================== READ (RABBITS) ======================

/**
 * Server Action: Henter filtrerede kanin-salgsopslag
 * @param filter Filtreringsparametre for kaniner til salg
 * @returns Pagineret liste af kaniner til salg
 */
export async function getRabbitSaleItems(
  filter?: Rabbit_ForSaleFilterDTO
): Promise<SaleListResult> {
  try {
    // Initialiser filter hvis det ikke er angivet
    if (!filter) {
      filter = {};
    }
    
    // Sikrer at page og pageSize er gyldige
    if (!filter.page || filter.page < 1) {
      filter.page = 1;
    }
    
    if (!filter.pageSize || filter.pageSize < 1) {
      filter.pageSize = 12;
    }
    
    const rabbitSaleItems = await GetRabbitSaleItemsFiltered(filter);
    
    return {
      success: true,
      data: rabbitSaleItems
    };
  } catch (error) {
    console.error('Failed to fetch rabbit sale items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

// ====================== READ (BY ID) ======================

/**
 * Server Action: Henter detaljeret information om et specifikt salgsopslag via ID
 * @param saleDetailsId ID for salgsopslaget
 * @param entityType Type af entitet (fx "Rabbit", "Wool")
 * @returns Detaljeret salgsprofil eller fejlbesked
 */
export async function getSaleDetailsById(
  saleDetailsId: number,
  entityType: string // Ændret fra EntityType til string
): Promise<SaleDetailsResult> {
  try {
    if (!saleDetailsId) {
      return {
        success: false,
        error: 'Manglende salgsopslag ID',
        status: 400
      };
    }
    
    // Kalder GetSaleDetailsById fra saleController.ts med string parameter
    const saleDetails = await GetSaleDetailsById(saleDetailsId, entityType);
    
    return {
      success: true,
      data: saleDetails
    };
  } catch (error) {
    console.error(`Failed to fetch sale details with ID ${saleDetailsId}:`, error);
    
    if (error instanceof Error && error.message.includes('blev ikke fundet')) {
      return {
        success: false,
        error: `Salgsopslag med ID '${saleDetailsId}' blev ikke fundet.`,
        status: 404
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
      status: 500
    };
  }
}

// ====================== READ (BY SLUG) ======================

/**
 * Server Action: Henter detaljeret information om et specifikt salgsopslag via slug
 * @param slug Slug for salgsopslaget
 * @returns Detaljeret salgsprofil eller fejlbesked
 */
export interface SaleResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Henter detaljer for et salgsopslag baseret på slug
 * @param slug Salgsopslagets slug
 * @returns Salgsprofilen
 */
export async function getSaleDetailsBySlug(slug: string): Promise<SaleResult<SaleDetailsProfileDTO>> {
  try {
    const saleDetails = await GetSaleDetailsBySlug(slug);

    return {
      success: true,
      data: saleDetails
    };
  } catch (error) {
    console.error('Error getting sale details by slug:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der opstod en fejl ved hentning af salgsdetaljer'
    };
  }
}