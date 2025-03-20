// src/app/actions/rabbit/create.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { Rabbit_CreateDTO } from '@/api/types/AngoraDTOs';
import { CreateRabbit } from '@/api/endpoints/rabbitController';

export type CreateRabbitResult = 
  | { success: true; earCombId: string }
  | { success: false; error: string };

/**
 * Server Action: Opretter en ny kanin
 * @param rabbitData Data for den nye kanin
 * @returns Resultat af oprettelsen med earCombId ved succes
 */
export async function createRabbit(rabbitData: Rabbit_CreateDTO): Promise<CreateRabbitResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    // Validér data på server-siden
    if (!rabbitData.rightEarId || !rabbitData.leftEarId || !rabbitData.nickName) {
      return {
        success: false, 
        error: 'Manglende påkrævede felter'
      };
    }
    
    // Kald API endpoint
    const newRabbit = await CreateRabbit(rabbitData, accessToken);
    
    // Returner et success objekt med det nye ID
    return {
      success: true,
      earCombId: newRabbit.earCombId
    };
  } catch (error) {
    console.error('Failed to create rabbit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}