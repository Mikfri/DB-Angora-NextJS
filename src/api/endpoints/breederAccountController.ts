// src/api/endpoints/breederAccountController.ts
import { getApiUrl } from "../config/apiConfig";
import {
  Rabbit_PreviewDTO, PagedResultDTO,  
  BreederAccount_PrivateProfileDTO,
  BreederAccount_UpdateDTO,
  TransferRequestPreviewDTO,
  TransferRequestPreviewFilterDTO
} from "../types/AngoraDTOs";

//-------------------- RABBITS --------------------
/**
 * Henter alle brugerens kaniner med paginering
 * @param accessToken JWT token med brugerens auth information
 * @param page Sidetal (starter fra 1)
 * @param pageSize Antal elementer per side
 * @returns Pagineret liste af kaniner
 */
export async function GetOwnRabbits(
  accessToken: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PagedResultDTO<Rabbit_PreviewDTO>> {
  try {
    // Simpel query med kun page og pageSize
    const url = getApiUrl(`BreederAccount/Rabbits_Owned?page=${page}&pageSize=${pageSize}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'text/plain',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Standardiseret fejlhåndtering
      let errorMessage = `${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.text();
        if (errorBody) errorMessage = errorBody;
      } catch {
        console.error();
      }
      throw new Error(`Fejl ved hentning af egne kaniner: ${errorMessage}`);
    }

    const data = await response.json();
    return data as PagedResultDTO<Rabbit_PreviewDTO>;
  } catch (error) {
    console.error('Error fetching own rabbits:', error);
    // Returner en tom pagineret liste i tilfælde af fejl
    return {
      data: [],
      totalCount: 0,
      page: page,
      pageSize: pageSize,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }
}

//-------------------- TRANSFER REQUESTS --------------------
/**
 * Hent overførselsanmodninger modtaget af den aktuelle bruger (med filtrering)
 * @param accessToken Brugerens adgangstoken
 * @param filter Filtreringsparametre for anmodningerne
 * @returns Liste af modtagne overførselsanmodninger
 */
export async function GetReceivedTransferRequests(
  accessToken: string,
  filter?: TransferRequestPreviewFilterDTO
): Promise<TransferRequestPreviewDTO[]> {
  // Opbyg query string fra filter objektet
  const queryParams = new URLSearchParams();
  if (filter) {
    if (filter.status !== undefined && filter.status !== null) queryParams.append('status', filter.status);
    if (filter.rabbit_EarCombId !== undefined && filter.rabbit_EarCombId !== null) queryParams.append('rabbit_EarCombId', filter.rabbit_EarCombId);
    if (filter.rabbit_NickName !== undefined && filter.rabbit_NickName !== null) queryParams.append('rabbit_NickName', filter.rabbit_NickName);
    if (filter.issuer_BreederRegNo !== undefined && filter.issuer_BreederRegNo !== null) queryParams.append('issuer_BreederRegNo', filter.issuer_BreederRegNo);
    if (filter.issuer_FirstName !== undefined && filter.issuer_FirstName !== null) queryParams.append('issuer_FirstName', filter.issuer_FirstName);
    //if (filter.recipent_BreederRegNo !== undefined && filter.recipent_BreederRegNo !== null) queryParams.append('recipent_BreederRegNo', filter.recipent_BreederRegNo);
    //if (filter.recipent_FirstName !== undefined && filter.recipent_FirstName !== null) queryParams.append('recipent_FirstName', filter.recipent_FirstName);
    if (filter.from_dateAccepted !== undefined && filter.from_dateAccepted !== null) queryParams.append('from_dateAccepted', filter.from_dateAccepted);
  }

  const url = `${getApiUrl('BreederAccount/TransferRequestsReceived')}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    let errorMessage = `${response.status} ${response.statusText}`;
    try {
      const errorResponse = await response.text();
      if (errorResponse) errorMessage = errorResponse;
    } catch {
      // ignore
    }
    throw new Error(`Fejl ved hentning af modtagne overførselsanmodninger: ${errorMessage}`);
  }

  return response.json();
}

/**
 * Hent overførselsanmodninger udstedt (sendt) af den aktuelle bruger (med filtrering)
 * @param accessToken Brugerens adgangstoken
 * @param filter Filtreringsparametre for anmodningerne
 * @returns Liste af sendte overførselsanmodninger
 */
export async function GetSentTransferRequests(
  accessToken: string,
  filter?: TransferRequestPreviewFilterDTO
): Promise<TransferRequestPreviewDTO[]> {
  // Opbyg query string fra filter objektet
  const queryParams = new URLSearchParams();
  if (filter) {
    if (filter.status !== undefined && filter.status !== null) queryParams.append('status', filter.status);
    if (filter.rabbit_EarCombId !== undefined && filter.rabbit_EarCombId !== null) queryParams.append('rabbit_EarCombId', filter.rabbit_EarCombId);
    if (filter.rabbit_NickName !== undefined && filter.rabbit_NickName !== null) queryParams.append('rabbit_NickName', filter.rabbit_NickName);
    //if (filter.issuer_BreederRegNo !== undefined && filter.issuer_BreederRegNo !== null) queryParams.append('issuer_BreederRegNo', filter.issuer_BreederRegNo);
    //if (filter.issuer_FirstName !== undefined && filter.issuer_FirstName !== null) queryParams.append('issuer_FirstName', filter.issuer_FirstName);
    if (filter.recipent_BreederRegNo !== undefined && filter.recipent_BreederRegNo !== null) queryParams.append('recipent_BreederRegNo', filter.recipent_BreederRegNo);
    if (filter.recipent_FirstName !== undefined && filter.recipent_FirstName !== null) queryParams.append('recipent_FirstName', filter.recipent_FirstName);
    if (filter.from_dateAccepted !== undefined && filter.from_dateAccepted !== null) queryParams.append('from_dateAccepted', filter.from_dateAccepted);
  }

  const url = `${getApiUrl('BreederAccount/TransferRequestsIssued')}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    let errorMessage = `${response.status} ${response.statusText}`;
    try {
      const errorResponse = await response.text();
      if (errorResponse) errorMessage = errorResponse;
    } catch {
      // ignore
    }
    throw new Error(`Fejl ved hentning af udstedte overførselsanmodninger: ${errorMessage}`);
  }

  return response.json();
}


//-------------------- PUT --------------------
/**
 * Opdaterer en opdrætterkonto (BreederAccount) via PUT /BreederAccount/Update/{breederAccountId}
 * @param accessToken JWT token med brugerens auth information
 * @param breederAccountId ID på opdrætterkontoen der skal opdateres
 * @param updateDTO De nye profildata (BreederAccount_UpdateDTO)
 * @returns Den opdaterede opdrætterprofil
 */
export async function UpdateBreederAccount(
  accessToken: string,
  breederAccountId: string,
  updateDTO: BreederAccount_UpdateDTO
): Promise<BreederAccount_PrivateProfileDTO> {
  const response = await fetch(getApiUrl(`BreederAccount/Update/${breederAccountId}`), {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateDTO)
  });

  if (!response.ok) {
    let errorMessage = `${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.text();
      if (errorBody) errorMessage = errorBody;
    } catch {
      // ignore
    }
    throw new Error(`Fejl ved opdatering af opdrætterkonto: ${errorMessage}`);
  }

  const updatedProfile = await response.json();
  return updatedProfile as BreederAccount_PrivateProfileDTO;
}