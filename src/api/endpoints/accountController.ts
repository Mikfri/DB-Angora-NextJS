// src/api/endpoints/accountController.ts
import { getApiUrl } from "../config/apiConfig";
import {
    IdentityResult,
    User_ProfileDTO,
    User_UpdateProfileDTO
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
//-------------------- READ
//-------- User
/**
 * Henter en brugers profil baseret på userProfileId
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

//-------------------- UPDATE
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