// src/app/actions/rabbit/delete.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { DeleteRabbit } from '@/api/endpoints/rabbitController';

export type DeleteRabbitResult = 
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Server Action: Sletter en kanin
 * @param earCombId Kaninens øremærke-id
 * @returns Resultat af sletningen med success flag og besked
 */
export async function deleteRabbit(earCombId: string): Promise<DeleteRabbitResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    if (!earCombId) {
      return {
        success: false, 
        error: 'Manglende øremærke-id'
      };
    }
    
    // Kald API endpoint
    await DeleteRabbit(earCombId, accessToken);
    
    // Returner et success objekt
    return {
      success: true,
      message: 'Kaninen blev slettet'
    };
  } catch (error) {
    console.error('Failed to delete rabbit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl ved sletning af kaninen'
    };
  }
}