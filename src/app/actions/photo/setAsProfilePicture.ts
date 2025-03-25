// src/app/actions/photo/setAsProfilePicture.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { SetAsProfilePhoto } from '@/api/endpoints/photoController';

export type SetProfilePhotoResult = 
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Server Action: Sætter et foto som profilbillede
 * @param photoId ID på det foto der skal sættes som profilbillede
 * @returns Resultat af operationen
 */
export async function setAsProfilePhoto(
  photoId: number
): Promise<SetProfilePhotoResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    const result = await SetAsProfilePhoto(accessToken, photoId);
    
    return {
      success: true,
      message: result
    };
  } catch (error) {
    console.error('Failed to set profile photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl ved ændring af profilbillede'
    };
  }
}