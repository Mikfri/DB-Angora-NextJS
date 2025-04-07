// src/app/actions/rabbit/forbreeding.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { GetRabbitsForBreeding } from '@/api/endpoints/rabbitController';
import { Rabbit_ForbreedingPreviewDTO } from '@/api/types/AngoraDTOs';

export type BreedingRabbitsResult = 
  | { success: true; data: Rabbit_ForbreedingPreviewDTO[] }
  | { success: false; error: string; status: number };

/**
 * Server Action: Henter kaniner til avl
 * @returns Liste af kaniner der er markeret som til avl
 */
export async function getBreedingRabbits(): Promise<BreedingRabbitsResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: "Du er ikke logget ind",
        status: 401
      };
    }
    
    const rabbits = await GetRabbitsForBreeding(accessToken);
    
    return {
      success: true,
      data: rabbits
    };
  } catch (error) {
    console.error("Error fetching breeding rabbits:", error);
    return {
      success: false,
      error: "Der opstod en fejl ved hentning af avlskaniner",
      status: 500
    };
  }
}