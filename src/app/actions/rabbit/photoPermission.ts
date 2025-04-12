// src/app/actions/rabbit/photoPermission.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { GetRabbitPhotoUploadPermission } from '@/api/endpoints/rabbitController';
import { RegisterCloudinaryPhoto } from '@/api/endpoints/photoController';
import { 
  CloudinaryUploadConfigDTO, 
  CloudinaryPhotoRegistryRequestDTO, 
  Photo_DTO 
} from '@/api/types/AngoraDTOs';

/**
 * Server Action: Henter tilladelse til upload af billede
 * @param earCombId Kaninens ID
 * @returns Upload configuration til Cloudinary eller fejlbesked
 */
export async function getRabbitPhotoUploadPermission(earCombId: string): Promise<{
  success: boolean;
  data?: CloudinaryUploadConfigDTO;
  error?: string;
}> {
  try {
    // Hent token via server action
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: "Du skal være logget ind for at uploade billeder"
      };
    }
    
    // Brug det nye endpoint til at hente upload konfiguration
    const uploadConfig = await GetRabbitPhotoUploadPermission(accessToken, earCombId);
    
    return {
      success: true,
      data: uploadConfig
    };
  } catch (error) {
    console.error("Error in getRabbitPhotoUploadPermission server action:", error);
    return {
      success: false,
      error: "Der opstod en fejl ved anmodning om upload konfiguration"
    };
  }
}

/**
 * Server Action: Registrerer uploaded billede i databasen via DB-AngoraREST
 * @param photoData Data fra Cloudinary efter upload
 * @returns Registreret Photo_DTO || string fejlbesked
 */
export async function registerCloudinaryPhoto(
  photoData: CloudinaryPhotoRegistryRequestDTO
): Promise<{
  success: boolean;
  data?: Photo_DTO;
  error?: string;
}> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: "Du skal være logget ind for at registrere billeder"
      };
    }
    
    const photo = await RegisterCloudinaryPhoto(accessToken, photoData);
    
    return {
      success: true,
      data: photo
    };
  } catch (error) {
    console.error("Error in registerCloudinaryPhoto server action:", error);
    return {
      success: false,
      error: "Der opstod en fejl ved registrering af billedet"
    };
  }
}