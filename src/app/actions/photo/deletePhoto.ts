// src/app/actions/photo/deletePhoto.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { DeletePhoto } from '@/api/endpoints/photoController';

export type DeletePhotoResult = 
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Server Action: Sletter et foto
 * @param photoId ID på det foto der skal slettes
 * @returns Resultat af operationen
 */
export async function deletePhoto(
  photoId: number
): Promise<DeletePhotoResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    const result = await DeletePhoto(accessToken, photoId);
    
    return {
      success: true,
      message: result
    };
  } catch (error) {
    console.error('Failed to delete photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl ved sletning af billedet'
    };
  }
}