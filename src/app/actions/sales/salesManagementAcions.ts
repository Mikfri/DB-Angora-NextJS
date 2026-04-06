// src/app/actions/sales/salesManagementAcions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO, PhotoPrivateDTO } from '@/api/types/PhotoDTOs';
import { ResultPagedDTO, SaleDetailsPrivateCardDTO } from '@/api/types/AngoraDTOs';
import {
    GetSaleItemsByTargetedUserId,
    UpdateSaleStatus,
    RequestUploadPermission,
    SavePhoto,
    UpdateProfilePhoto,
    DeletePhoto
} from '@/api/endpoints/saleManagementController';

export type SaleManagementResult<T = void> =
    | { success: true; data: T }
    | { success: false; error: string };


// ====================== STATUS ======================

export async function updateSaleStatus(
    id: number,
    newStatus: string
): Promise<SaleManagementResult> {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return { success: false, error: 'Ikke autoriseret' };

        await UpdateSaleStatus(accessToken, id, newStatus);
        return { success: true, data: undefined };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}

export async function getSaleItemsByTargetedUserId(
    targetedUserId: string,
    page: number = 1,
    pageSize: number = 12
): Promise<SaleManagementResult<ResultPagedDTO<SaleDetailsPrivateCardDTO>>> {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return { success: false, error: 'Ikke autoriseret' };

        const data = await GetSaleItemsByTargetedUserId(accessToken, targetedUserId, page, pageSize);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}


// ====================== UPLOAD PERMISSION ======================

export async function requestUploadPermission(
    id: number
): Promise<SaleManagementResult<CloudinaryUploadConfigDTO>> {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return { success: false, error: 'Ikke autoriseret' };

        const data = await RequestUploadPermission(accessToken, id);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}


// ====================== PHOTOS ======================

export async function savePhoto(
    id: number,
    dto: CloudinaryPhotoRegistryRequestDTO
): Promise<SaleManagementResult<PhotoPrivateDTO>> {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return { success: false, error: 'Ikke autoriseret' };

        const data = await SavePhoto(accessToken, id, dto);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}

export async function updateProfilePhoto(
    id: number,
    photoId: number
): Promise<SaleManagementResult<PhotoPrivateDTO>> {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return { success: false, error: 'Ikke autoriseret' };

        const data = await UpdateProfilePhoto(accessToken, id, photoId);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}

export async function deletePhoto(
    id: number,
    photoId: number
): Promise<SaleManagementResult> {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return { success: false, error: 'Ikke autoriseret' };

        await DeletePhoto(accessToken, id, photoId);
        return { success: true, data: undefined };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
    }
}

