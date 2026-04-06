// src/api/endpoints/salesController.ts

/** 
 * Henter alle [EntityType]SaleDetails, som findes i form af Cards eller profiler,afhængigt af endpointet.
 * Alle endpoints i denne controller benytter det samme filterobjekt, SaleDetailsFilterDTO,
 * som indeholder både generelle felter og entity-specifikke felter (f.eks. RabbitSaleFilterDTO).
 * Metoderne i denne controller håndterer selv at mappe filterobjektets felter til query params,
 * og er null-sikre for bool, number og string (dvs. at false/0/'' vil blive sendt som query param, mens null/undefined vil blive udeladt).
 * 
*/

import { SaleDetailsPublicCardDTO, SaleDetailsProfileDTO, ResultPagedDTO, SaleDetailsFilterDTO } from '../types/AngoraDTOs';
import { PeltSaleFilterDTO } from '../types/PeltDTOs';
import { RabbitSaleFilterDTO } from '../types/RabbitSaleDTOs';
import { YarnSaleFilterDTO } from '../types/YarnDTOs';
import { WoolRawSaleFilterDTO } from '../types/WoolRawDTOs';
import { WoolCardedSaleFilterDTO } from '../types/WoolCardedDTOs';
import { getApiUrl } from '../config/apiConfig';
import { parseApiError } from '../client/errorHandlers';



/** Appends all SaleDetailsFilterDTO base fields as query params — null-safe for bool, number and string */
function appendBaseFilterParams(params: URLSearchParams, filter: SaleDetailsFilterDTO): void {
    if (filter.minPrice     != null) params.append('minPrice',     filter.minPrice.toString());
    if (filter.maxPrice     != null) params.append('maxPrice',     filter.maxPrice.toString());
    if (filter.canBeShipped != null) params.append('canBeShipped', filter.canBeShipped.toString()); // false must pass through
    if (filter.entityType   != null) params.append('entityType',   filter.entityType);
    if (filter.city         != null) params.append('city',         filter.city);
    if (filter.minZipCode   != null) params.append('minZipCode',   filter.minZipCode.toString());
    if (filter.maxZipCode   != null) params.append('maxZipCode',   filter.maxZipCode.toString());
    if (filter.sortBy       != null) params.append('sortBy',       filter.sortBy);
}

export async function GetSaleDetailsBySlug(slug: string): Promise<SaleDetailsProfileDTO> {
  const response = await fetch(getApiUrl(`Sale/${slug}`), {
    method: 'GET',
    headers: { 'accept': 'text/plain' }
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente salgsopslag');

  const payload = await response.json() as any;

  // Hvis API er wrapper
  if (payload?.data && typeof payload.data === 'object') {
    return payload.data as SaleDetailsProfileDTO;
  }

  // fallback hvis det er direkte
  return payload as SaleDetailsProfileDTO;
}

export async function GetSaleItemsByBreederRegNo(
    breederRegNo: string,
    page: number,
    pageSize: number
): Promise<ResultPagedDTO<SaleDetailsPublicCardDTO>> {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    const response = await fetch(getApiUrl(`Sale/relatedto-breeder/${breederRegNo}?${params}`), {
        method: 'GET',
        headers: { 'accept': 'text/plain' }
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente avlerens salgsopslag');
    return response.json();
}

export async function GetAllSaleItemsFiltered(
    filter: SaleDetailsFilterDTO,
    page: number,
    pageSize: number
): Promise<ResultPagedDTO<SaleDetailsPublicCardDTO>> {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    appendBaseFilterParams(params, filter);

    const response = await fetch(getApiUrl(`Sale?${params}`), {
        method: 'GET',
        headers: { 'accept': 'text/plain' }
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente salgsartikler');
    return response.json();
}

/**
 * Henter salgsartikler af 'RabbitSaleDetails'. Metoden benyttes  filtreret på både de generelle sale details og kanin-specifikke felter
 * @param filter NULL-able filterobjekt med både generelle og kanin-specifikke felter. Alle felter er optionale, og bool/number/string håndteres null-sikkertt i appendBaseFilterParams
 * @param page 
 * @param pageSize 
 * @returns #RabbitSaleDetailsCardDTO'er pakket i en ResultPagedDTO
 */
export async function GetRabbitSaleItemsFiltered(
    filter: RabbitSaleFilterDTO,
    page: number,
    pageSize: number
): Promise<ResultPagedDTO<SaleDetailsPublicCardDTO>> {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    appendBaseFilterParams(params, filter);
    if (filter.rightEarId != null) params.append('rightEarId', filter.rightEarId);
    if (filter.bornAfter  != null) params.append('bornAfter',  filter.bornAfter);
    if (filter.race       != null) params.append('race',       filter.race);
    if (filter.gender     != null) params.append('gender',     filter.gender);
    if (filter.color      != null) params.append('color',      filter.color);

    const response = await fetch(getApiUrl(`Sale/rabbits?${params}`), {
        method: 'GET',
        headers: { 'accept': 'text/plain' }
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente kaninsalgsartikler');
    return response.json();
}

export async function GetYarnSaleItemsFiltered(
    filter: YarnSaleFilterDTO,
    page: number,
    pageSize: number
): Promise<ResultPagedDTO<SaleDetailsPublicCardDTO>> {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    appendBaseFilterParams(params, filter);
    if (filter.applicationCategory  != null) params.append('applicationCategory',  filter.applicationCategory);
    if (filter.weightCategory        != null) params.append('weightCategory',        filter.weightCategory);
    if (filter.fiberType             != null) params.append('fiberType',             filter.fiberType);
    if (filter.plyCount              != null) params.append('plyCount',              filter.plyCount.toString());
    if (filter.minNeedleSizeMm       != null) params.append('minNeedleSizeMm',       filter.minNeedleSizeMm.toString());
    if (filter.maxNeedleSizeMm       != null) params.append('maxNeedleSizeMm',       filter.maxNeedleSizeMm.toString());
    if (filter.minSoftnessScore      != null) params.append('minSoftnessScore',      filter.minSoftnessScore);
    if (filter.minDurabilityScore    != null) params.append('minDurabilityScore',    filter.minDurabilityScore);

    const response = await fetch(getApiUrl(`Sale/yarns?${params}`), {
        method: 'GET',
        headers: { 'accept': 'text/plain' }
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente garnsalgsartikler');
    return response.json();
}

export async function GetWoolRawSaleItemsFiltered(
    filter: WoolRawSaleFilterDTO,
    page: number,
    pageSize: number
): Promise<ResultPagedDTO<SaleDetailsPublicCardDTO>> {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    appendBaseFilterParams(params, filter);
    if (filter.fiberType         != null) params.append('fiberType',         filter.fiberType);
    if (filter.naturalColor      != null) params.append('naturalColor',      filter.naturalColor);
    if (filter.minFiberLengthCm  != null) params.append('minFiberLengthCm',  filter.minFiberLengthCm.toString());
    if (filter.maxFiberLengthCm  != null) params.append('maxFiberLengthCm',  filter.maxFiberLengthCm.toString());
    if (filter.minWeightGrams    != null) params.append('minWeightGrams',    filter.minWeightGrams.toString());
    if (filter.maxWeightGrams    != null) params.append('maxWeightGrams',    filter.maxWeightGrams.toString());

    const response = await fetch(getApiUrl(`Sale/woolraw?${params}`), {
        method: 'GET',
        headers: { 'accept': 'text/plain' }
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente råuld-salgsartikler');
    return response.json();
}

export async function GetWoolCardedSaleItemsFiltered(
    filter: WoolCardedSaleFilterDTO,
    page: number,
    pageSize: number
): Promise<ResultPagedDTO<SaleDetailsPublicCardDTO>> {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    appendBaseFilterParams(params, filter);
    if (filter.isDyed                  != null) params.append('isDyed',                  filter.isDyed.toString()); // false must pass through
    if (filter.naturalColor            != null) params.append('naturalColor',            filter.naturalColor);
    if (filter.dyedColor               != null) params.append('dyedColor',               filter.dyedColor);
    if (filter.fiberType               != null) params.append('fiberType',               filter.fiberType);
    if (filter.minAverageFiberLengthCm != null) params.append('minAverageFiberLengthCm', filter.minAverageFiberLengthCm.toString());
    if (filter.maxAverageFiberLengthCm != null) params.append('maxAverageFiberLengthCm', filter.maxAverageFiberLengthCm.toString());
    if (filter.minTotalWeightGrams     != null) params.append('minTotalWeightGrams',     filter.minTotalWeightGrams.toString());
    if (filter.maxTotalWeightGrams     != null) params.append('maxTotalWeightGrams',     filter.maxTotalWeightGrams.toString());

    const response = await fetch(getApiUrl(`Sale/woolcarded?${params}`), {
        method: 'GET',
        headers: { 'accept': 'text/plain' }
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente kartet-uld-salgsartikler');
    return response.json();
}

export async function GetPeltSaleItemsFiltered(
    filter: PeltSaleFilterDTO,
    page: number,
    pageSize: number
): Promise<ResultPagedDTO<SaleDetailsPublicCardDTO>> {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    appendBaseFilterParams(params, filter);
    if (filter.race          != null) params.append('race',          filter.race);
    if (filter.color         != null) params.append('color',         filter.color);
    if (filter.tanningMethod != null) params.append('tanningMethod', filter.tanningMethod);
    if (filter.condition     != null) params.append('condition',     filter.condition);
    if (filter.minLengthCm   != null) params.append('minLengthCm',   filter.minLengthCm.toString());
    if (filter.maxLengthCm   != null) params.append('maxLengthCm',   filter.maxLengthCm.toString());
    if (filter.minWidthCm    != null) params.append('minWidthCm',    filter.minWidthCm.toString());
    if (filter.maxWidthCm    != null) params.append('maxWidthCm',    filter.maxWidthCm.toString());

    const response = await fetch(getApiUrl(`Sale/pelts?${params}`), {
        method: 'GET',
        headers: { 'accept': 'text/plain' }
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente pelssalgsartikler');
    return response.json();
}