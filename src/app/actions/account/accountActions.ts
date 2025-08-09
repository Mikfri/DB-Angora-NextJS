// src/app/actions/account/accountActions.ts
'use server';

import { getAccessToken, getUserIdentity } from '@/app/actions/auth/session'; // ← Brug session utilities
import { ChangePassword, DeleteUserProfilePhoto, GetUserProfile, GetUserProfilePhotoUploadPermission, RegisterUserProfilePhoto, UpdateUserProfile, UpdateUserProfilePhoto } from '@/api/endpoints/accountController';
import { CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO, PhotoDeleteDTO, PhotoPrivateDTO, User_ProfileDTO, User_UpdateProfileDTO } from '@/api/types/AngoraDTOs';

// =============== POST ===============
export async function changePassword(currentPassword: string, newPassword: string): Promise<{
  success: boolean;
  result?: import('@/api/types/AngoraDTOs').IdentityResult;
  error?: string;
}> {
  try {
    if (!currentPassword || !newPassword) {
      return {
        success: false,
        error: 'Både nuværende og nyt password skal angives'
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: 'Ingen adgang - log venligst ind igen'
      };
    }

    const result = await ChangePassword(accessToken, currentPassword, newPassword);

    if (!result.succeeded) {
      return {
        success: false,
        result,
        error: result.errors?.map(e => e.description).filter(Boolean).join(', ') || 'Ukendt fejl'
      };
    }

    return {
      success: true,
      result
    };
  } catch (error) {
    let message = 'Der opstod en fejl ved skift af adgangskode';
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      error: message
    };
  }
}

/**
 * Server Action: Registrerer et billede fra Cloudinary for en brugerprofil
 * @param userProfileId ID på brugeren billedet tilhører
 * @param requestDTO Billede-detaljer fra Cloudinary
 */
export async function registerUserProfilePhoto(
  userProfileId: string,
  requestDTO: CloudinaryPhotoRegistryRequestDTO
): Promise<{
  success: boolean;
  data?: PhotoPrivateDTO;
  error?: string;
}> {
  try {
    if (!userProfileId || !requestDTO) {
      return {
        success: false,
        error: 'Bruger ID og billeddata er påkrævet'
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: 'Ingen adgang - log venligst ind igen'
      };
    }

    const photo = await RegisterUserProfilePhoto(accessToken, userProfileId, requestDTO);

    return {
      success: true,
      data: photo
    };
  } catch (error) {
    console.error('Error registering user profile photo:', error);
    return {
      success: false,
      error: 'Der opstod en fejl ved registrering af profilbillede'
    };
  }
}

// =============== GET ===============
/**
 * Server Action: Henter Cloudinary upload-konfiguration for brugerprofilbillede
 * @param userProfileId ID på brugeren der skal have uploadet billede
 */
export async function getUserProfilePhotoUploadPermission(userProfileId: string): Promise<{
  success: boolean;
  data?: CloudinaryUploadConfigDTO;
  error?: string;
}> {
  try {
    if (!userProfileId || userProfileId.trim() === '') {
      return {
        success: false,
        error: 'User profile ID er påkrævet'
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: 'Ingen adgang - log venligst ind igen'
      };
    }

    const config = await GetUserProfilePhotoUploadPermission(accessToken, userProfileId);

    return {
      success: true,
      data: config
    };
  } catch (error) {
    console.error('Error fetching Cloudinary upload config:', error);
    return {
      success: false,
      error: 'Der opstod en fejl ved hentning af upload-konfiguration'
    };
  }
}

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

// =============== PUT ===============
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

/**
 * Server Action: Opdaterer brugerens profilbillede
 * @param userProfileId ID på brugeren hvis profilbillede skal ændres
 * @param photoId ID på det billede der skal sættes som profilbillede
 */
export async function updateUserProfilePhoto(
  userProfileId: string,
  photoId: number
): Promise<{
  success: boolean;
  data?: PhotoPrivateDTO;
  error?: string;
}> {
  try {
    if (!userProfileId || !photoId || photoId <= 0) {
      return {
        success: false,
        error: 'Bruger ID og gyldigt billede ID er påkrævet'
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: 'Ingen adgang - log venligst ind igen'
      };
    }

    const updatedPhoto = await UpdateUserProfilePhoto(accessToken, userProfileId, photoId);

    return {
      success: true,
      data: updatedPhoto
    };
  } catch (error) {
    console.error('Error updating user profile photo:', error);
    return {
      success: false,
      error: 'Der opstod en fejl ved opdatering af profilbillede'
    };
  }
}

// =============== DELETE ===============
/**
 * Server Action: Sletter et specifikt billede for en bruger
 * @param deletionDTO DTO med info om bruger og billede (EntityStringId og PhotoId)
 */
export async function deleteUserProfilePhoto(
  deletionDTO: PhotoDeleteDTO
): Promise<{
  success: boolean;
  data?: boolean;
  error?: string;
}> {
  try {
    if (!deletionDTO?.entityStringId || !deletionDTO?.photoId || deletionDTO.photoId <= 0) {
      return {
        success: false,
        error: 'Bruger ID og gyldigt billede ID er påkrævet'
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: 'Ingen adgang - log venligst ind igen'
      };
    }

    const result = await DeleteUserProfilePhoto(accessToken, deletionDTO);

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error deleting user profile photo:', error);
    return {
      success: false,
      error: 'Der opstod en fejl ved sletning af profilbillede'
    };
  }
}
