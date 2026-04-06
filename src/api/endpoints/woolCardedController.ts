// src/api/endpoints/woolCardedController.ts

import { parseApiError } from '../client/errorHandlers';
import { getApiUrl } from '../config/apiConfig';
import { WoolCardedPostPutSaleDetailsDTO, WoolCardedSaleProfilePrivateDTO } from '../types/WoolCardedDTOs';

const woolCardedUrl = (id?: number) => 
  getApiUrl(`WoolCarded${id != null ? `/${id}` : ''}`);

export async function CreateWoolCardedSaleDetails(
  createDto: WoolCardedPostPutSaleDetailsDTO,
  accessToken: string
): Promise<WoolCardedSaleProfilePrivateDTO> {
  const response = await fetch(woolCardedUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(createDto)
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke oprette kartet-uld-salgsannonce');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function GetWoolCardedSaleDetails(
  id: number,
  accessToken: string
): Promise<WoolCardedSaleProfilePrivateDTO> {
  const response = await fetch(woolCardedUrl(id), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente kartet-uld-salgsprofil');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function UpdateWoolCardedSaleDetails(
  id: number,
  updateDto: WoolCardedPostPutSaleDetailsDTO,
  accessToken: string
): Promise<WoolCardedSaleProfilePrivateDTO> {
  const response = await fetch(woolCardedUrl(id), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(updateDto)
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke opdatere kartet-uld-salgsannonce');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function DeleteWoolCardedSaleDetails(
  id: number,
  accessToken: string
): Promise<boolean> {
  const response = await fetch(woolCardedUrl(id), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke slette kartet-uld-salgsannonce');
  const payload = await response.json().catch(() => null);
  return payload?.data ?? true;
}