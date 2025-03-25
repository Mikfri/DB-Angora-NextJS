// src/app/actions/photo/getPhotos.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { Photo_DTO } from '@/api/types/AngoraDTOs';
import { GetPhotosForEntity } from '@/api/endpoints/photoController';

export type GetPhotosResult = 
  | { success: true; photos: Photo_DTO[] }
  | { success: false; error: string };

/**
 * Server Action: Henter alle fotos for en specifik entitet
 * @param entityType Typen af entitet (f.eks. "Rabbit")
 * @param entityId ID'et på entiteten
 * @returns Liste af fotos knyttet til den angivne entitet
 */
export async function getPhotos(
  entityType: string,
  entityId: string
): Promise<GetPhotosResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    const photos = await GetPhotosForEntity(accessToken, entityType, entityId);
    
    return {
      success: true,
      photos
    };
  } catch (error) {
    console.error('Failed to get photos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl ved hentning af billeder'
    };
  }
}