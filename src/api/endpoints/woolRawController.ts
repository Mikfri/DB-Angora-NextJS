// src/api/endpoints/woolRawController.ts

import { parseApiError } from '../client/errorHandlers';
import { getApiUrl } from '../config/apiConfig';
import { WoolRawPostPutSaleDetailsDTO, WoolRawSaleProfilePrivateDTO } from '../types/WoolRawDTOs';

const woolRawUrl = (id?: number) => 
  getApiUrl(`WoolRaw${id != null ? `/${id}` : ''}`);

export async function CreateWoolRawSaleDetails(
  createDto: WoolRawPostPutSaleDetailsDTO,
  accessToken: string
): Promise<WoolRawSaleProfilePrivateDTO> {
  const response = await fetch(woolRawUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(createDto)
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke oprette råuld-salgsannonce');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function GetWoolRawSaleDetails(
  id: number,
  accessToken: string
): Promise<WoolRawSaleProfilePrivateDTO> {
  const response = await fetch(woolRawUrl(id), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente råuld-salgsprofil');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function UpdateWoolRawSaleDetails(
  id: number,
  updateDto: WoolRawPostPutSaleDetailsDTO,
  accessToken: string
): Promise<WoolRawSaleProfilePrivateDTO> {
  const response = await fetch(woolRawUrl(id), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(updateDto)
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke opdatere råuld-salgsannonce');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function DeleteWoolRawSaleDetails(
  id: number,
  accessToken: string
): Promise<boolean> {
  const response = await fetch(woolRawUrl(id), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke slette råuld-salgsannonce');
  const payload = await response.json().catch(() => null);
  return payload?.data ?? true;
}
