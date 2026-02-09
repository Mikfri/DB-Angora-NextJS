// src/api/endpoints/saleController.ts
import { SaleDetailsCardDTO, SaleDetailsProfileDTO, ResultPagedDTO, SaleDetails_FilterDTO } from '../types/AngoraDTOs';
import { Rabbit_ForSaleFilterDTO } from "../types/filterTypes";
import { getApiUrl } from "../config/apiConfig";

/**
 * Henter de nyeste salgsopslag på tværs af alle kategorier med paginering
 * @param page Sidenummer (starter fra 1)
 * @param pageSize Antal opslag pr. side
 * @returns Pagineret resultat af de nyeste salgskort
 */
export async function GetLatestSaleItems(
    page: number,
    pageSize: number
): Promise<ResultPagedDTO<SaleDetailsCardDTO>> {
    const response = await fetch(getApiUrl(`Sale/Latest?page=${page}&pageSize=${pageSize}`), {
        method: 'GET',
        headers: {
            'accept': 'text/plain'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
        });
        throw new Error(`Kunne ikke hente nyeste salgsartikler: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Henter alle salgsopslag med filtreringsmuligheder og paginering
 * @param filter Filtreringsparametre for salgsopslag inkl. paginering
 * @returns Pagineret resultat af filtrerede salgskort
 */
export async function GetAllSaleItemsFiltered(
    filter: SaleDetails_FilterDTO
): Promise<ResultPagedDTO<SaleDetailsCardDTO>> {
    // Konverter filter objekt til query params
    const queryParams = new URLSearchParams();

    // Tilføj paginering
    if (filter.page !== undefined) queryParams.append('page', filter.page.toString());
    if (filter.pageSize !== undefined) queryParams.append('pageSize', filter.pageSize.toString());

    // Tilføj filtrering
    if (filter.minPrice !== undefined) queryParams.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice !== undefined) queryParams.append('maxPrice', filter.maxPrice.toString());
    if (filter.canBeShipped !== undefined) queryParams.append('canBeShipped', filter.canBeShipped.toString());

    const response = await fetch(getApiUrl(`Sale/All?${queryParams.toString()}`), {
        method: 'GET',
        headers: {
            'accept': 'text/plain'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            sentFilter: filter
        });
        throw new Error(`Kunne ikke hente filtrerede salgsartikler: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Henter kanin-specifikke salgsopslag med mulighed for at filtrere på kaninegenskaber og paginering
 * @param filter Filtreringsparametre specifikt for kaninsalg med paginering
 * @returns Pagineret resultat af kaninsalgskort DTOer
 */
export async function GetRabbitSaleItemsFiltered(
    filter?: Rabbit_ForSaleFilterDTO
): Promise<ResultPagedDTO<SaleDetailsCardDTO>> {
    // Konverter filter objekt til query params
    const queryParams = new URLSearchParams();

    // Tilføj alle filter parametre hvis de findes
    if (filter) {
        if (filter.rightEarId) queryParams.append('rightEarId', filter.rightEarId);
        if (filter.bornAfter) queryParams.append('bornAfter', filter.bornAfter);
        if (filter.minZipCode) queryParams.append('minZipCode', filter.minZipCode.toString());
        if (filter.maxZipCode) queryParams.append('maxZipCode', filter.maxZipCode.toString());
        if (filter.city) queryParams.append('city', filter.city);
        if (filter.race) queryParams.append('race', filter.race);
        if (filter.color) queryParams.append('color', filter.color);
        if (filter.gender) queryParams.append('gender', filter.gender);
        if (filter.page) queryParams.append('page', filter.page.toString());
        if (filter.pageSize) queryParams.append('pageSize', filter.pageSize.toString());
    }

    // URL med eller uden query params
    const url = filter && queryParams.toString()
        ? getApiUrl(`Sale/Rabbits?${queryParams.toString()}`)
        : getApiUrl('Sale/Rabbits');

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'text/plain'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            sentFilter: filter
        });
        throw new Error(`Kunne ikke hente kaninsalgsartikler: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Henter detaljeret information om et specifikt salgsopslag baseret på dets ID
 * @param saleDetailsId ID for salgsdetaljen
 * @param entityType Type af entitet (fx "Rabbit", "Wool")
 * @returns Detaljeret salgsprofil
 */
export async function GetSaleDetailsById(
    saleDetailsId: number,
    entityType: string
): Promise<SaleDetailsProfileDTO> {
    const response = await fetch(getApiUrl(`Sale/ById/${saleDetailsId}?entity=${entityType}`), {
        method: 'GET',
        headers: {
            'accept': 'text/plain'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
        });

        if (response.status === 404) {
            throw new Error(`Salgsopslag med ID '${saleDetailsId}' blev ikke fundet.`);
        }

        throw new Error(`Kunne ikke hente salgsdetaljer: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Henter salgsprofil baseret på slug
 * @param slug Salgsopslagets slug
 * @returns Komplet salgsprofil
 */
export async function GetSaleDetailsBySlug(slug: string): Promise<SaleDetailsProfileDTO> {
    const url = getApiUrl(`Sale/${slug}`);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'text/plain'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch sale details: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}