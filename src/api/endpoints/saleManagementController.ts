// src/api/endpoints/salesManagementController.ts

import { getApiUrl } from '../config/apiConfig';
import { parseApiError } from '../client/errorHandlers';
import { CloudinaryUploadConfigDTO, CloudinaryPhotoRegistryRequestDTO, PhotoPrivateDTO } from '../types/PhotoDTOs';
import { ResultPagedDTO, SaleDetailsPrivateCardDTO } from '../types/AngoraDTOs';

export async function GetSaleItemsByTargetedUserId(
    accessToken: string,
    targetedUserId: string,
    page: number,
    pageSize: number
): Promise<ResultPagedDTO<SaleDetailsPrivateCardDTO>> {
    if (!accessToken || accessToken.trim() === '') {
        throw new Error('Access token is required for this endpoint.');
    }

    if (!targetedUserId || targetedUserId.trim() === '') {
        throw new Error('targetedUserId er påkrævet.');
    }

    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
    });
    const url = getApiUrl(`SaleManagement/user/${encodeURIComponent(targetedUserId)}?${params.toString()}`);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw await parseApiError(response, 'Kunne ikke hente brugerens salgsannoncer');
    }

    return response.json();
}

export async function UpdateSaleStatus(
    accessToken: string,
    id: number,
    newStatus: string
): Promise<void> {
    const response = await fetch(getApiUrl(`SaleManagement/${id}/status`), {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'accept': 'text/plain'
        },
        body: JSON.stringify(newStatus)
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke opdatere salgsstatus');
}

export async function RequestUploadPermission(
    accessToken: string,
    id: number
): Promise<CloudinaryUploadConfigDTO> {
    const response = await fetch(getApiUrl(`SaleManagement/${id}/photos/upload-config`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'text/plain'
        }
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente upload-konfiguration');
    const result = await response.json();
    return result.data ?? result;
}

export async function SavePhoto(
    accessToken: string,
    id: number,
    dto: CloudinaryPhotoRegistryRequestDTO
): Promise<PhotoPrivateDTO> {
    const response = await fetch(getApiUrl(`SaleManagement/${id}/photos`), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'accept': 'text/plain'
        },
        body: JSON.stringify(dto)
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke gemme billede');
    const result = await response.json();
    return result.data ?? result;
}

export async function UpdateProfilePhoto(
    accessToken: string,
    id: number,
    photoId: number
): Promise<PhotoPrivateDTO> {
    const response = await fetch(getApiUrl(`SaleManagement/${id}/photos/${photoId}`), {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'text/plain'
        }
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke opdatere profilbillede');
    const result = await response.json();
    return result.data ?? result;
}

export async function DeletePhoto(
    accessToken: string,
    id: number,
    photoId: number
): Promise<void> {
    const response = await fetch(getApiUrl(`SaleManagement/${id}/photos/${photoId}`), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'text/plain'
        }
    });
    if (!response.ok) throw await parseApiError(response, 'Kunne ikke slette billede');
}

