// src/app/actions/account/accountActions.ts
'use server';

import { getAccessToken, getUserIdentity } from '@/app/actions/auth/session'; // ← Brug session utilities
import {
  ChangePassword,
  DeleteUserProfilePhoto,
  GetUserProfile,
  GetUserProfilePhotoUploadPermission,
  RegisterUserProfilePhoto,
  UpdateUserProfile,
  UpdateUserProfilePhoto
} from '@/api/endpoints/accountController';
import {
  CloudinaryPhotoRegistryRequestDTO,
  CloudinaryUploadConfigDTO,
  IdentityResult,
  PhotoPrivateDTO,
  User_ProfileDTO,
  User_UpdateProfileDTO,
} from '@/api/types/AngoraDTOs';

// =============== POST ===============

export async function changePassword(currentPassword: string, newPassword: string): Promise<{
  success: boolean;
  result?: IdentityResult;
  error?: string;
}> {
  try {
    if (!currentPassword || !newPassword)
      return { success: false, error: 'Både nuværende og nyt password skal angives' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const result = await ChangePassword(accessToken, currentPassword, newPassword);

    if (!result.succeeded) {
      return {
        success: false,
        result,
        error: result.errors?.map(e => e.description).filter(Boolean).join(', ') || 'Ukendt fejl'
      };
    }

    return { success: true, result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved skift af adgangskode' };
  }
}

export async function registerUserProfilePhoto(
  targetUserId: string,
  requestDTO: CloudinaryPhotoRegistryRequestDTO
): Promise<{ success: boolean; data?: PhotoPrivateDTO; error?: string }> {
  try {
    if (!targetUserId || !requestDTO)
      return { success: false, error: 'Bruger ID og billeddata er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const photo = await RegisterUserProfilePhoto(accessToken, targetUserId, requestDTO);
    return { success: true, data: photo };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved registrering af profilbillede' };
  }
}

// =============== GET ===============

export async function getUserProfilePhotoUploadPermission(targetUserId: string): Promise<{
  success: boolean;
  data?: CloudinaryUploadConfigDTO;
  error?: string;
}> {
  try {
    if (!targetUserId?.trim())
      return { success: false, error: 'User profile ID er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const config = await GetUserProfilePhotoUploadPermission(accessToken, targetUserId);
    return { success: true, data: config };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved hentning af upload-konfiguration' };
  }
}

export async function getUserProfile(targetedUserId: string): Promise<{
  success: boolean;
  data?: User_ProfileDTO;
  error?: string;
}> {
  try {
    if (!targetedUserId?.trim())
      return { success: false, error: 'User profile ID er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const userProfile = await GetUserProfile(accessToken, targetedUserId);
    return { success: true, data: userProfile };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved hentning af brugerprofil' };
  }
}

export async function getCurrentUserProfile(): Promise<{
  success: boolean;
  data?: User_ProfileDTO;
  error?: string;
}> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const userIdentity = await getUserIdentity();
    if (!userIdentity?.id)
      return { success: false, error: 'Bruger ID ikke fundet - log venligst ind igen' };

    return await getUserProfile(userIdentity.id);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved hentning af din profil' };
  }
}

// =============== PUT ===============

export async function updateUserProfile(
  targetedUserId: string,
  updateProfileDTO: User_UpdateProfileDTO
): Promise<{ success: boolean; data?: User_ProfileDTO; error?: string }> {
  try {
    if (!targetedUserId || !updateProfileDTO)
      return { success: false, error: 'Bruger ID og opdateringsdata er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const updatedProfile = await UpdateUserProfile(accessToken, targetedUserId, updateProfileDTO);
    return { success: true, data: updatedProfile };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved opdatering af brugerprofil' };
  }
}

/**
 * @param photoId Send null for at fjerne profilbillede
 */
export async function updateUserProfilePhoto(
  targetUserId: string,
  photoId: number | null
): Promise<{ success: boolean; data?: PhotoPrivateDTO; error?: string }> {
  try {
    if (!targetUserId)
      return { success: false, error: 'Bruger ID er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const updatedPhoto = await UpdateUserProfilePhoto(accessToken, targetUserId, photoId);
    return { success: true, data: updatedPhoto };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved opdatering af profilbillede' };
  }
}

// =============== DELETE ===============

export async function deleteUserProfilePhoto(
  targetUserId: string,
  photoId: number
): Promise<{ success: boolean; data?: boolean; error?: string }> {
  try {
    if (!targetUserId)
      return { success: false, error: 'Bruger ID er påkrævet' };
    if (!photoId || photoId <= 0)
      return { success: false, error: 'Gyldigt billede ID er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const result = await DeleteUserProfilePhoto(accessToken, targetUserId, photoId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved sletning af profilbillede' };
  }
}
