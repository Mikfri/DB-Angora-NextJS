// src/app/actions/photo/registerPhoto.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { CloudinaryPhotoRegistryRequestDTO, Photo_DTO } from '@/api/types/AngoraDTOs';
import { RegisterCloudinaryPhoto } from '@/api/endpoints/photoController';

export type RegisterPhotoResult = 
  | { success: true; data: Photo_DTO; message: string }
  | { success: false; error: string };

/**
 * Server Action: Registrerer et uploaded Cloudinary foto i systemet
 * @param photoData Data om det uploadede billede
 * @returns Det registrerede foto med database ID
 */
export async function registerPhoto(
  photoData: CloudinaryPhotoRegistryRequestDTO
): Promise<RegisterPhotoResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    // Validering af photoData
    if (!photoData.publicId || !photoData.cloudinaryUrl) {
      return {
        success: false,
        error: 'Manglende data for billedet'
      };
    }
    
    if (!photoData.entityId || !photoData.entityType) {
      return {
        success: false, 
        error: 'Manglende reference-data'
      };
    }
    
    const data = await RegisterCloudinaryPhoto(accessToken, photoData);
    
    return {
      success: true,
      data,
      message: 'Billedet er registreret i systemet'
    };
  } catch (error) {
    console.error('Failed to register photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl ved registrering af billedet'
    };
  }
}