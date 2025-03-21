// src/api/endpoints/photoController.ts
import { getApiUrl } from "../config/apiConfig";
import { CloudinaryPhotoRegistryRequestDTO, Photo_DTO } from "@/api/types/AngoraDTOs";

//-------------------- CREATE
/**
 * Registrerer et foto i databasen, der er uploadet til Cloudinary.
 * Dette gemmer referencen til billedet, så backend kan finde det senere.
 * 
 * @param accessToken - Brugerens JWT authentication token
 * @param request - Data om det uploadede billede (public ID, entity reference, etc.)
 * @returns Det registrerede foto-objekt med database-ID
 */
export async function RegisterCloudinaryPhoto(
    accessToken: string, 
    request: CloudinaryPhotoRegistryRequestDTO
): Promise<Photo_DTO> {
    const response = await fetch(getApiUrl('Photo/register-cloudinary'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to register photo: ${response.status} - ${errorText}`);
    }

    return response.json();
}

//-------------------- READ
/**
 * Henter alle fotos for en specifik entitet (f.eks. en kanin)
 * 
 * @param accessToken - Brugerens JWT authentication token
 * @param entityType - Typen af entitet (f.eks. "Rabbit")
 * @param entityId - ID'et på entiteten
 * @returns Liste af fotos knyttet til den angivne entitet
 */
export async function GetPhotosForEntity(
    accessToken: string,
    entityType: string,
    entityId: string
): Promise<Photo_DTO[]> {
    const response = await fetch(getApiUrl(`Photo/all-entity-images/${entityType}/${entityId}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch photos: ${response.status} - ${errorText}`);
    }

    return response.json();
}

//-------------------- UPDATE
/**
 * Sætter et specifikt foto som profilbillede for den tilhørende entitet
 * 
 * @param accessToken - Brugerens JWT authentication token
 * @param photoId - ID på det foto der skal sættes som profilbillede
 * @returns En success meddelelse fra serveren
 */
export async function SetAsProfilePhoto(
    accessToken: string,
    photoId: number
): Promise<string> {
    const response = await fetch(getApiUrl(`Photo/set-as-profile/${photoId}`), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to set profile photo: ${response.status} - ${errorText}`);
    }

    return response.text();  // Returnerer "Billedet er sat som profilbillede"
}

//-------------------- DELETE
/**
 * Sletter et foto fra databasen (og hvis muligt også fra Cloudinary)
 * 
 * @param accessToken - Brugerens JWT authentication token
 * @param photoId - ID på det foto der skal slettes
 * @returns En success meddelelse fra serveren
 */
export async function DeletePhoto(
    accessToken: string,
    photoId: number
): Promise<string> {
    const response = await fetch(getApiUrl(`Photo/delete/${photoId}`), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete photo: ${response.status} - ${errorText}`);
    }

    return response.text(); // Returnerer "Billedet blev slettet"
}