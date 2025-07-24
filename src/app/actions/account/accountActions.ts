// src/app/actions/account/accountActions.ts
'use server';

import { getAccessToken, getUserIdentity } from '@/app/actions/auth/session'; // ← Brug session utilities
import { GetUserProfile, UpdateUserProfile } from '@/api/endpoints/accountController';
import { User_ProfileDTO, User_UpdateProfileDTO } from '@/api/types/AngoraDTOs';

/**
 * Server Action: Henter bruger profil baseret på userProfileId
 * @param userProfileId ID på den bruger hvis profil skal hentes
 */
export async function getUserProfile(userProfileId: string): Promise<{
  success: boolean;
  data?: User_ProfileDTO;
  error?: string;
}> {
  try {
    // Valider input
    if (!userProfileId || userProfileId.trim() === '') {
      return {
        success: false,
        error: 'User profile ID er påkrævet'
      };
    }

    // Brug getAccessToken som checker token expiry automatisk
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Ingen adgang - log venligst ind igen'
      };
    }

    // Kald API endpoint
    const userProfile = await GetUserProfile(accessToken, userProfileId);

    return {
      success: true,
      data: userProfile
    };

  } catch (error) {
    console.error('Error fetching user profile:', error);

    return {
      success: false,
      error: 'Der opstod en fejl ved hentning af bruger profil'
    };
  }
}

/**
 * Server Action: Henter den aktuelle brugers egen profil
 * Bruger brugerens eget ID fra token claims
 */
export async function getCurrentUserProfile(): Promise<{
  success: boolean;
  data?: User_ProfileDTO;
  error?: string;
}> {
  try {
    // Hent access token med expiry check
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Ingen adgang - log venligst ind igen'
      };
    }

    // Hent user identity som indeholder userId
    const userIdentity = await getUserIdentity();

    if (!userIdentity?.id) {
      return {
        success: false,
        error: 'Bruger ID ikke fundet - log venligst ind igen'
      };
    }

    // Brug brugerens eget ID til at hente deres profil
    return await getUserProfile(userIdentity.id);

  } catch (error) {
    console.error('Error fetching current user profile:', error);

    return {
      success: false,
      error: 'Der opstod en fejl ved hentning af din profil'
    };
  }
}

/**
 * Server Action: Opdaterer brugerprofil
 * @param userProfileId ID på brugeren der skal opdateres
 * @param updateProfileDTO De nye profildata
 */
export async function updateUserProfile(
  userProfileId: string,
  updateProfileDTO: User_UpdateProfileDTO
): Promise<{
  success: boolean;
  data?: User_ProfileDTO;
  error?: string;
}> {
  try {
    if (!userProfileId || !updateProfileDTO) {
      return {
        success: false,
        error: 'Bruger ID og opdateringsdata er påkrævet'
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: 'Ingen adgang - log venligst ind igen'
      };
    }

    const updatedProfile = await UpdateUserProfile(accessToken, userProfileId, updateProfileDTO);

    return {
      success: true,
      data: updatedProfile
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: 'Der opstod en fejl ved opdatering af brugerprofil'
    };
  }
}