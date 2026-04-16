// src/api/endpoints/accountController.ts
import { parseApiError } from "../client/errorHandlers";  
import { getApiUrl } from "../config/apiConfig";
import {
  CloudinaryPhotoRegistryRequestDTO,
  CloudinaryUploadConfigDTO,
  IdentityResult,
  User_ProfileDTO,
  User_UpdateProfileDTO,
  PhotoPrivateDTO,
} from "../types/AngoraDTOs";

//-------------------- POST

/**
 * Registrerer et billede fra Cloudinary for en bruger
 * POST /Account/photo/{targetUserId}
 */
export async function RegisterUserProfilePhoto(
  accessToken: string,
  targetUserId: string,
  requestDTO: CloudinaryPhotoRegistryRequestDTO
): Promise<PhotoPrivateDTO> {
  const response = await fetch(getApiUrl(`Account/photo/${encodeURIComponent(targetUserId)}`), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(requestDTO)
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved registrering af profilbillede");
  return response.json();
}

/**
 * Ændrer den aktuelle brugers adgangskode
 * POST /Account/change-password
 */
export async function ChangePassword(
  accessToken: string,
  currentPassword: string,
  newPassword: string
): Promise<IdentityResult> {
  const response = await fetch(getApiUrl("Account/change-password"), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved skift af adgangskode");
  return response.json();
}

//-------------------- GET

/**
 * Henter upload-konfiguration til Cloudinary for et brugerprofilbillede
 * GET /Account/{targetUserId}/photos/upload-config
 */
export async function GetUserProfilePhotoUploadPermission(
  accessToken: string,
  targetUserId: string
): Promise<CloudinaryUploadConfigDTO> {
  const response = await fetch(getApiUrl(`Account/${encodeURIComponent(targetUserId)}/photos/upload-config`), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/json"
    }
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved hentning af upload-konfiguration");
  return response.json();
}

/**
 * Henter en brugers komplet profil inkl. evt. BreederAccount
 * GET /Account/{targetedUserId}/profile
 */
export async function GetUserProfile(
  accessToken: string,
  targetedUserId: string
): Promise<User_ProfileDTO> {
  const response = await fetch(getApiUrl(`Account/${encodeURIComponent(targetedUserId)}/profile`), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/json"
    }
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved hentning af brugerprofil");
  return response.json();
}

//-------------------- PUT

/**
 * Opdaterer en brugers profilinformation
 * PUT /Account/{targetedUserId}/profile
 */
export async function UpdateUserProfile(
  accessToken: string,
  targetedUserId: string,
  updateProfileDTO: User_UpdateProfileDTO
): Promise<User_ProfileDTO> {
  const response = await fetch(getApiUrl(`Account/${encodeURIComponent(targetedUserId)}/profile`), {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(updateProfileDTO)
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved opdatering af brugerprofil");
  return response.json();
}

/**
 * Opdaterer brugerens profilbillede
 * PUT /Account/{targetUserId}/photo?photoId={photoId}
 * @param photoId Send null for at fjerne profilbillede
 */
export async function UpdateUserProfilePhoto(
  accessToken: string,
  targetUserId: string,
  photoId: number | null
): Promise<PhotoPrivateDTO> {
  const url = photoId != null
    ? getApiUrl(`Account/${encodeURIComponent(targetUserId)}/photo?photoId=${photoId}`)
    : getApiUrl(`Account/${encodeURIComponent(targetUserId)}/photo`);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/json"
    }
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved opdatering af profilbillede");
  return response.json();
}

//-------------------- DELETE

/**
 * Sletter et specifikt billede for en bruger
 * DELETE /Account/{targetUserId}/photo/{photoId}
 */
export async function DeleteUserProfilePhoto(
  accessToken: string,
  targetUserId: string,
  photoId: number
): Promise<boolean> {
  const response = await fetch(getApiUrl(`Account/${encodeURIComponent(targetUserId)}/photo/${photoId}`), {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/json"
    }
  });

  if (!response.ok) throw await parseApiError(response, "Fejl ved sletning af profilbillede");
  return response.json();
}
