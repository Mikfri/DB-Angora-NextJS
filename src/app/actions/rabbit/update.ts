// src/app/actions/rabbit/update.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { Rabbit_ProfileDTO } from '@/api/types/AngoraDTOs';
import { EditRabbit } from '@/api/endpoints/rabbitController';

export type UpdateRabbitResult =
    | { success: true; message: string }
    | { success: false; error: string };

/**
 * Server Action: Opdaterer en eksisterende kanin
 * @param earCombId Kaninens øremærke-id
 * @param updatedData De opdaterede data for kaninen
 * @returns Resultat af opdateringen
 */
export async function updateRabbit(
    earCombId: string,
    updatedData: Rabbit_ProfileDTO
): Promise<UpdateRabbitResult> {
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

        if (!updatedData.nickName || updatedData.nickName.trim() === '') {
            return {
              success: false,
              error: 'Navn er påkrævet'
            };
          }
      
          // Valider datoer
          if (updatedData.dateOfBirth) {
            const birthDate = new Date(updatedData.dateOfBirth);
            if (isNaN(birthDate.getTime())) {
              return {
                success: false,
                error: 'Ugyldig fødselsdato'
              };
            }
      
            // Fremtidige fødselsdatoer er ikke tilladt
            if (birthDate > new Date()) {
              return {
                success: false,
                error: 'Fødselsdato kan ikke være i fremtiden'
              };
            }
          }
      
          if (updatedData.dateOfDeath) {
            const deathDate = new Date(updatedData.dateOfDeath);
            if (isNaN(deathDate.getTime())) {
              return {
                success: false,
                error: 'Ugyldig dødsdato'
              };
            }
      
            // Hvis både fødsel og død er angivet, skal død være efter fødsel
            if (updatedData.dateOfBirth) {
              const birthDate = new Date(updatedData.dateOfBirth);
              if (deathDate < birthDate) {
                return {
                  success: false,
                  error: 'Dødsdato kan ikke være før fødselsdato'
                };
              }
            }
          }


        // Kald API endpoint
        await EditRabbit(earCombId, updatedData, accessToken);

        // Returner et success objekt
        return {
            success: true,
            message: 'Kaninen blev opdateret'
        };
    } catch (error) {
        console.error('Failed to update rabbit:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl ved opdatering af kaninen'
        };
    }
}