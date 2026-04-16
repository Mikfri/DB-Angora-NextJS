// src/app/actions/breederAccount/breederAccountActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
  CreateBreederAccount,
  DeleteBreederAccountPhoto,
  GetBreederAccountPhotoUploadConfig,
  GetDiscoverableBreeders,
  GetPublicBreederProfile,
  GetReceivedTransferRequests,
  GetSentTransferRequests,
  SaveBreederAccountPhoto,
  UpdateBreederAccount,
  UpdateBreederAccountProfilePicture,
} from '@/api/endpoints/breederAccountController';
import {
  BreederAccount_CreateDTO,
  BreederAccount_FilterDTO,
  BreederAccount_PreviewCardDTO,
  BreederAccount_PrivateProfileDTO,
  BreederAccount_PublicProfileDTO,
  BreederAccount_UpdateDTO,
  CloudinaryPhotoRegistryRequestDTO,
  CloudinaryUploadConfigDTO,
  PhotoPrivateDTO,
  ResultPagedDTO,
  TransferRequestPreviewDTO,
  TransferRequestPreviewFilterDTO,
} from '@/api/types/AngoraDTOs';

// =============== POST ===============

export async function createBreederAccount(
  createDTO: BreederAccount_CreateDTO
): Promise<{ success: boolean; data?: BreederAccount_PrivateProfileDTO; error?: string }> {
  try {
    if (!createDTO)
      return { success: false, error: 'Oprettelsesdata er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const data = await CreateBreederAccount(accessToken, createDTO);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved oprettelse af opdrætterkonto' };
  }
}

export async function getBreederAccountPhotoUploadConfig(
  breederAccountId: string
): Promise<{ success: boolean; data?: CloudinaryUploadConfigDTO; error?: string }> {
  try {
    if (!breederAccountId?.trim())
      return { success: false, error: 'BreederAccount ID er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const data = await GetBreederAccountPhotoUploadConfig(accessToken, breederAccountId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved hentning af upload-konfiguration' };
  }
}

export async function saveBreederAccountPhoto(
  breederAccountId: string,
  requestDTO: CloudinaryPhotoRegistryRequestDTO
): Promise<{ success: boolean; data?: PhotoPrivateDTO; error?: string }> {
  try {
    if (!breederAccountId?.trim() || !requestDTO)
      return { success: false, error: 'BreederAccount ID og billeddata er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const data = await SaveBreederAccountPhoto(accessToken, breederAccountId, requestDTO);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved registrering af opdrætterbillede' };
  }
}

// =============== GET ===============

export async function getDiscoverableBreeders(
  filter?: BreederAccount_FilterDTO
): Promise<{ success: boolean; data?: ResultPagedDTO<BreederAccount_PreviewCardDTO>; error?: string }> {
  try {
    const data = await GetDiscoverableBreeders(filter);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved hentning af opdrættere' };
  }
}

export async function getPublicBreederProfile(
  breederRegNo: string
): Promise<{ success: boolean; data?: BreederAccount_PublicProfileDTO; error?: string }> {
  try {
    if (!breederRegNo?.trim())
      return { success: false, error: 'BreederRegNo er påkrævet' };

    const data = await GetPublicBreederProfile(breederRegNo);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved hentning af offentlig opdrætterprofil' };
  }
}

export async function getReceivedTransferRequests(
  filter?: TransferRequestPreviewFilterDTO
): Promise<{ success: boolean; data?: TransferRequestPreviewDTO[]; error?: string }> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const data = await GetReceivedTransferRequests(accessToken, filter);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved hentning af modtagne overførselsanmodninger' };
  }
}

export async function getSentTransferRequests(
  filter?: TransferRequestPreviewFilterDTO
): Promise<{ success: boolean; data?: TransferRequestPreviewDTO[]; error?: string }> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const data = await GetSentTransferRequests(accessToken, filter);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved hentning af sendte overførselsanmodninger' };
  }
}

// =============== PUT ===============

export async function updateBreederAccount(
  breederAccountId: string,
  updateDTO: BreederAccount_UpdateDTO
): Promise<{ success: boolean; data?: BreederAccount_PrivateProfileDTO; error?: string }> {
  try {
    if (!breederAccountId?.trim() || !updateDTO)
      return { success: false, error: 'BreederAccount ID og opdateringsdata er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const data = await UpdateBreederAccount(accessToken, breederAccountId, updateDTO);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved opdatering af opdrætterkonto' };
  }
}

export async function updateBreederAccountProfilePicture(
  breederAccountId: string,
  photoId: number
): Promise<{ success: boolean; data?: PhotoPrivateDTO; error?: string }> {
  try {
    if (!breederAccountId?.trim())
      return { success: false, error: 'BreederAccount ID er påkrævet' };
    if (!photoId || photoId <= 0)
      return { success: false, error: 'Gyldigt billede ID er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const data = await UpdateBreederAccountProfilePicture(accessToken, breederAccountId, photoId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved opdatering af opdrætterprofilbillede' };
  }
}

// =============== DELETE ===============

export async function deleteBreederAccountPhoto(
  breederAccountId: string,
  photoId: number
): Promise<{ success: boolean; data?: boolean; error?: string }> {
  try {
    if (!breederAccountId?.trim())
      return { success: false, error: 'BreederAccount ID er påkrævet' };
    if (!photoId || photoId <= 0)
      return { success: false, error: 'Gyldigt billede ID er påkrævet' };

    const accessToken = await getAccessToken();
    if (!accessToken)
      return { success: false, error: 'Ingen adgang - log venligst ind igen' };

    const data = await DeleteBreederAccountPhoto(accessToken, breederAccountId, photoId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Fejl ved sletning af opdrætterbillede' };
  }
}
