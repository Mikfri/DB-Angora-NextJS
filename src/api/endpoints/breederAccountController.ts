// src/api/endpoints/breederAccountController.ts
import { parseApiError } from "../client/errorHandlers";
import { getApiUrl } from "../config/apiConfig";
import {
  BreederAccount_CreateDTO,
  BreederAccount_FilterDTO,
  BreederAccount_PreviewCardDTO,
  BreederAccount_PrivateProfileDTO,
  BreederAccount_PublicProfileDTO,
  BreederAccount_UpdateDTO,
  CloudinaryPhotoRegistryRequestDTO,
  CloudinaryUploadConfigDTO,
  PhotoPrivateDTO,
  ResultPagedDTO,
  TransferRequestPreviewDTO,
  TransferRequestPreviewFilterDTO,
} from "../types/AngoraDTOs";

//-------------------- POST --------------------

/**
 * Opretter en ny opdrætterkonto for den indloggede bruger.
 * POST /BreederAccount
 */
export async function CreateBreederAccount(
  accessToken: string,
  createDTO: BreederAccount_CreateDTO
): Promise<BreederAccount_PrivateProfileDTO> {
  const response = await fetch(getApiUrl("BreederAccount"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(createDTO),
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved oprettelse af opdrætterkonto");
  return response.json();
}

/**
 * Henter upload-konfiguration til Cloudinary for en opdrætterprofil.
 * GET /BreederAccount/{breederAccountId}/photos/upload-config
 */
export async function GetBreederAccountPhotoUploadConfig(
  accessToken: string,
  breederAccountId: string
): Promise<CloudinaryUploadConfigDTO> {
  const response = await fetch(
    getApiUrl(`BreederAccount/${encodeURIComponent(breederAccountId)}/photos/upload-config`),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) throw await parseApiError(response, "Fejl ved hentning af upload-konfiguration");
  return response.json();
}

/**
 * Gemmer et uploadet billede fra Cloudinary og knytter det til opdrætterprofilen.
 * POST /BreederAccount/{breederAccountId}/photos
 */
export async function SaveBreederAccountPhoto(
  accessToken: string,
  breederAccountId: string,
  requestDTO: CloudinaryPhotoRegistryRequestDTO
): Promise<PhotoPrivateDTO> {
  const response = await fetch(
    getApiUrl(`BreederAccount/${encodeURIComponent(breederAccountId)}/photos`),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestDTO),
    }
  );

  if (!response.ok) throw await parseApiError(response, "Fejl ved registrering af opdrætterbillede");
  return response.json();
}

//-------------------- GET --------------------

/**
 * Henter en pagineret liste af synlige opdrættere baseret på filterkriterier.
 * GET /BreederAccount/discoverable
 */
export async function GetDiscoverableBreeders(
  filter?: BreederAccount_FilterDTO
): Promise<ResultPagedDTO<BreederAccount_PreviewCardDTO>> {
  const queryParams = new URLSearchParams();
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${getApiUrl("BreederAccount/discoverable")}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved hentning af opdrættere");
  return response.json();
}

/**
 * Henter en offentlig opdrætterprofil baseret på opdrætternummer.
 * GET /BreederAccount/{breederRegNo}/public-profile
 */
export async function GetPublicBreederProfile(
  breederRegNo: string
): Promise<BreederAccount_PublicProfileDTO> {
  const response = await fetch(
    getApiUrl(`BreederAccount/${encodeURIComponent(breederRegNo)}/public-profile`),
    {
      method: "GET",
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) throw await parseApiError(response, "Fejl ved hentning af offentlig opdrætterprofil");
  return response.json();
}

/**
 * Henter modtagne overførselsanmodninger for den aktuelle bruger.
 * GET /BreederAccount/TransferRequestsReceived
 */
export async function GetReceivedTransferRequests(
  accessToken: string,
  filter?: TransferRequestPreviewFilterDTO
): Promise<TransferRequestPreviewDTO[]> {
  const queryParams = new URLSearchParams();
  if (filter) {
    if (filter.status != null) queryParams.append("status", filter.status);
    if (filter.rabbit_EarCombId != null) queryParams.append("rabbit_EarCombId", filter.rabbit_EarCombId);
    if (filter.rabbit_NickName != null) queryParams.append("rabbit_NickName", filter.rabbit_NickName);
    if (filter.issuer_BreederRegNo != null) queryParams.append("issuer_BreederRegNo", filter.issuer_BreederRegNo);
    if (filter.issuer_FirstName != null) queryParams.append("issuer_FirstName", filter.issuer_FirstName);
    if (filter.from_dateAccepted != null) queryParams.append("from_dateAccepted", filter.from_dateAccepted);
  }

  const url = `${getApiUrl("BreederAccount/TransferRequestsReceived")}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved hentning af modtagne overførselsanmodninger");
  return response.json();
}

/**
 * Henter udstedte overførselsanmodninger for den aktuelle bruger.
 * GET /BreederAccount/TransferRequestsIssued
 */
export async function GetSentTransferRequests(
  accessToken: string,
  filter?: TransferRequestPreviewFilterDTO
): Promise<TransferRequestPreviewDTO[]> {
  const queryParams = new URLSearchParams();
  if (filter) {
    if (filter.status != null) queryParams.append("status", filter.status);
    if (filter.rabbit_EarCombId != null) queryParams.append("rabbit_EarCombId", filter.rabbit_EarCombId);
    if (filter.rabbit_NickName != null) queryParams.append("rabbit_NickName", filter.rabbit_NickName);
    if (filter.recipient_BreederRegNo != null) queryParams.append("recipient_BreederRegNo", filter.recipient_BreederRegNo);
    if (filter.recipient_FirstName != null) queryParams.append("recipient_FirstName", filter.recipient_FirstName);
    if (filter.from_dateAccepted != null) queryParams.append("from_dateAccepted", filter.from_dateAccepted);
  }

  const url = `${getApiUrl("BreederAccount/TransferRequestsIssued")}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved hentning af sendte overførselsanmodninger");
  return response.json();
}

//-------------------- PUT --------------------

/**
 * Opdaterer en opdrætterkonto.
 * PUT /BreederAccount/{breederAccountId}
 */
export async function UpdateBreederAccount(
  accessToken: string,
  breederAccountId: string,
  updateDTO: BreederAccount_UpdateDTO
): Promise<BreederAccount_PrivateProfileDTO> {
  const response = await fetch(
    getApiUrl(`BreederAccount/${encodeURIComponent(breederAccountId)}`), // RETTET: var Update/${id}
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(updateDTO),
    }
  );

  if (!response.ok) throw await parseApiError(response, "Fejl ved opdatering af opdrætterkonto");
  return response.json();
}

/**
 * Opdaterer profilbilledet for en opdrætterprofil.
 * PUT /BreederAccount/{breederAccountId}/photo?photoId={photoId}
 */
export async function UpdateBreederAccountProfilePicture(
  accessToken: string,
  breederAccountId: string,
  photoId: number
): Promise<PhotoPrivateDTO> {
  const response = await fetch(
    getApiUrl(`BreederAccount/${encodeURIComponent(breederAccountId)}/photo?photoId=${photoId}`),
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) throw await parseApiError(response, "Fejl ved opdatering af opdrætterprofilbillede");
  return response.json();
}

//-------------------- DELETE --------------------

/**
 * Sletter et billede fra en opdrætterprofil.
 * DELETE /BreederAccount/{breederAccountId}/photos/{photoId}
 */
export async function DeleteBreederAccountPhoto(
  accessToken: string,
  breederAccountId: string,
  photoId: number
): Promise<boolean> {
  const response = await fetch(
    getApiUrl(`BreederAccount/${encodeURIComponent(breederAccountId)}/photos/${photoId}`),
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) throw await parseApiError(response, "Fejl ved sletning af opdrætterbillede");
  return response.json();
}