// src/api/endpoints/breederAccountController.ts
import { getApiUrl } from "../config/apiConfig";
import {
  Rabbit_PreviewDTO, PagedResultDTO,
  TransferRequest_ReceivedDTO, TransferRequest_ReceivedFilterDTO,
  TransferRequest_SentFilterDTO, TransferRequest_SentDTO,
  BreederAccount_PrivateProfileDTO,
  BreederAccount_UpdateDTO
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
      } catch (e) {
        console.error('Kunne ikke læse fejlbesked:', e);
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
 * Hent overførselsanmodninger modtaget af den aktuelle bruger
 * @param accessToken Brugerens adgangstoken
 * @param filter Filtreringsparametre for anmodningerne
 * @returns Liste af modtagne overførselsanmodninger
 */
export async function GetReceivedTransferRequests(
  accessToken: string,
  filter?: TransferRequest_ReceivedFilterDTO
): Promise<TransferRequest_ReceivedDTO[]> {
  // Opbyg query string fra filter objektet
  const queryParams = new URLSearchParams();
  if (filter) {
    // Håndter hvert muligt filter-felt
    if (filter.status) queryParams.append('Status', filter.status);
    if (filter.rabbit_EarCombId) queryParams.append('Rabbit_EarCombId', filter.rabbit_EarCombId);
    if (filter.rabbit_NickName) queryParams.append('Rabbit_NickName', filter.rabbit_NickName);
    if (filter.issuer_BreederRegNo) queryParams.append('Issuer_BreederRegNo', filter.issuer_BreederRegNo);
    if (filter.issuer_FirstName) queryParams.append('Issuer_FirstName', filter.issuer_FirstName);
    if (filter.from_dateAccepted) queryParams.append('From_DateAccepted', filter.from_dateAccepted);
  }

  const url = `${getApiUrl('BreederAccount/TransferRequests_Received')}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'text/plain',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    let errorMessage = `${response.status} ${response.statusText}`;
    try {
      const errorResponse = await response.text();
      if (errorResponse) errorMessage = errorResponse;
    } catch (e) {
      console.error('Kunne ikke parse fejlbesked:', e);
    }

    throw new Error(`Fejl ved hentning af modtagne overførselsanmodninger: ${errorMessage}`);
  }

  return response.json();
}

/**
 * Hent overførselsanmodninger udstedt af den aktuelle bruger
 * @param accessToken Brugerens adgangstoken
 * @param filter Filtreringsparametre for anmodningerne
 * @returns Liste af sendte overførselsanmodninger
 */
export async function GetSentTransferRequests(
  accessToken: string,
  filter?: TransferRequest_SentFilterDTO
): Promise<TransferRequest_SentDTO[]> {
  // Opbyg query string fra filter objektet
  const queryParams = new URLSearchParams();
  if (filter) {
    // Håndter hvert muligt filter-felt
    if (filter.status) queryParams.append('Status', filter.status);
    if (filter.rabbit_EarCombId) queryParams.append('Rabbit_EarCombId', filter.rabbit_EarCombId);
    if (filter.rabbit_NickName) queryParams.append('Rabbit_NickName', filter.rabbit_NickName);
    if (filter.recipent_BreederRegNo) queryParams.append('Recipent_BreederRegNo', filter.recipent_BreederRegNo);
    if (filter.recipent_FirstName) queryParams.append('Recipent_FirstName', filter.recipent_FirstName);
    if (filter.from_dateAccepted) queryParams.append('From_DateAccepted', filter.from_dateAccepted);
  }

  const url = `${getApiUrl('BreederAccount/TransferRequests_Issued')}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'text/plain',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    let errorMessage = `${response.status} ${response.statusText}`;
    try {
      const errorResponse = await response.text();
      if (errorResponse) errorMessage = errorResponse;
    } catch (e) {
      console.error('Kunne ikke parse fejlbesked:', e);
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
    } catch (e) {
      // ignore
    }
    throw new Error(`Fejl ved opdatering af opdrætterkonto: ${errorMessage}`);
  }

  const updatedProfile = await response.json();
  return updatedProfile as BreederAccount_PrivateProfileDTO;
}