// src/api/endpoints/accountController.ts
import { getApiUrl } from "../config/apiConfig";
import {
  CloudinaryPhotoRegistryRequestDTO,
  CloudinaryUploadConfigDTO,
  IdentityResult,
  PhotoDeleteDTO,
  PhotoPrivateDTO,
  User_ProfileDTO,
  User_UpdateProfileDTO,
} from "../types/AngoraDTOs";

//-------------------- POST
/**
 * Skifter adgangskode for den aktuelle bruger via POST /Account/ChangePassword
 * @param accessToken JWT token med brugerens auth information
 * @param currentPassword Det nuværende password
 * @param newPassword Det nye password
 * @returns IdentityResult fra API'en
 */
export async function ChangePassword(
  accessToken: string,
  currentPassword: string,
  newPassword: string
): Promise<IdentityResult> {
  const response = await fetch(getApiUrl("Account/ChangePassword"), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "text/plain"
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  // Håndter fejl fra API (IdentityResult eller ExceptionMiddleware)
  if (!response.ok) {
    const text = await response.text();
    let errorMsg = `Network response was not ok: ${response.status} ${response.statusText}`;

    // Prøv at parse JSON for at finde fejlbesked(er)
    try {
      const errObj = JSON.parse(text);
      if (Array.isArray(errObj?.errors)) {
        errorMsg = errObj.errors.join(", ");
      } else if (typeof errObj?.message === "string") {
        errorMsg = errObj.message;
      } else if (typeof errObj === "string") {
        errorMsg = errObj;
      }
    } catch {
      // Hvis ikke JSON, brug tekst direkte hvis muligt
      if (text) errorMsg = text;
    }

    throw new Error(errorMsg);
  }

  // API returnerer text/plain, men indholdet er JSON
  const text = await response.text();
  try {
    return JSON.parse(text) as IdentityResult;
  } catch {
    throw new Error("Uventet svar fra serveren ved skift af adgangskode.");
  }
}

/**
 * Registrerer et billede fra Cloudinary for en bruger, inkl. rettigheds- og kvotetjek.
 * @param accessToken JWT token med brugerens auth information
 * @param userProfileId ID på brugeren billedet tilhører
 * @param requestDTO Billede-detaljer fra Cloudinary
 * @returns Det nye oprettede PhotoPrivateDTO fra API'en
 */
export async function RegisterUserProfilePhoto(
  accessToken: string,
  userProfileId: string,
  requestDTO: CloudinaryPhotoRegistryRequestDTO
): Promise<PhotoPrivateDTO> {
  const response = await fetch(getApiUrl(`Account/UserProfile/register-photo/${userProfileId}`), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestDTO)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${text}`);
  }

  return await response.json();
}

//-------------------- READ

/**
 * Henter upload-konfiguration til Cloudinary for et brugerprofilbillede, inkl. rettigheds- og kvotetjek.
 * @param accessToken JWT token med brugerens auth information
 * @param userProfileId ID på brugeren der skal have uploadet billede
 * @returns CloudinaryUploadConfigDTO fra API'en
 */
export async function GetUserProfilePhotoUploadPermission(
  accessToken: string,
  userProfileId: string
): Promise<CloudinaryUploadConfigDTO> {
  const response = await fetch(getApiUrl(`Account/UserProfile/photo-upload-permission/${userProfileId}`), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${text}`);
  }

  return await response.json();
}

//-------- User
/**
 * Henter en brugers profil baseret på userProfileId inklusive tilhørende billed og breederAccount - hvis nogen
 * @param accessToken JWT token med brugerens auth information
 * @param userProfileId ID på den bruger hvis profil skal hentes
 * @returns User_ProfileDTO fra API'en
 */
export async function GetUserProfile(
  accessToken: string,
  userProfileId: string
): Promise<User_ProfileDTO> {
  const response = await fetch(getApiUrl(`Account/UserProfile/${userProfileId}`), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
  }

  const userProfile = await response.json();
  return userProfile;
}

//-------------------- PUT
/**
 * Opdaterer en brugers profilinformation via PUT /Account/Update/{userProfileId}
 * @param accessToken JWT token med brugerens auth information
 * @param userProfileId ID på brugeren der skal opdateres
 * @param updateProfileDTO De nye profildata
 * @returns Den opdaterede brugerprofil
 */
export async function UpdateUserProfile(
  accessToken: string,
  userProfileId: string,
  updateProfileDTO: User_UpdateProfileDTO
): Promise<User_ProfileDTO> {
  const response = await fetch(getApiUrl(`Account/Update/${userProfileId}`), {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateProfileDTO)
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
  }

  const updatedProfile = await response.json();
  return updatedProfile;
}

/**
 * Opdaterer brugerens profilbillede.
 * @param accessToken JWT token med brugerens auth information
 * @param userProfileId ID på brugeren hvis profilbillede skal ændres
 * @param photoId ID på det billede der skal sættes som profilbillede
 * @returns Det opdaterede PhotoPrivateDTO fra API'en
 */
export async function UpdateUserProfilePhoto(
  accessToken: string,
  userProfileId: string,
  photoId: number
): Promise<PhotoPrivateDTO> {
  const response = await fetch(getApiUrl(`Account/UserProfile/${userProfileId}/profile-photo/${photoId}`), {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${text}`);
  }

  return await response.json();
}

//-------------------- DELETE
/**
 * Sletter et specifikt billede for en bruger via DELETE /Account/UserProfile/photo
 * @param accessToken JWT token med brugerens auth information
 * @param deletionDTO DTO med info om bruger og billede (EntityStringId og PhotoId)
 * @returns true hvis sletningen lykkedes
 */
export async function DeleteUserProfilePhoto(
  accessToken: string,
  deletionDTO: PhotoDeleteDTO
): Promise<boolean> {
  const response = await fetch(getApiUrl("Account/UserProfile/photo"), {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(deletionDTO)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${text}`);
  }

  // API returnerer true/false som JSON
  return await response.json();
}