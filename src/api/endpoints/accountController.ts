// src/api/endpoints/accountController.ts
import { getApiUrl } from "../config/apiConfig";
import {
    User_ProfileDTO,
    User_UpdateProfileDTO
} from "../types/AngoraDTOs";

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