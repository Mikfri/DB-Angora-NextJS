// src/api/endpoints/yarnController.ts
import { parseApiError } from '../client/errorHandlers';
import { getApiUrl } from '../config/apiConfig';
import { YarnPostPutSaleDetailsDTO, YarnSaleProfilePrivateDTO } from '../types/YarnDTOs';

const yarnUrl = (id?: number) => 
  getApiUrl(`Yarn${id != null ? `/${id}` : ''}`);

export async function CreateYarnSaleDetails(
  createDto: YarnPostPutSaleDetailsDTO,
  accessToken: string
): Promise<YarnSaleProfilePrivateDTO> {
  const response = await fetch(yarnUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(createDto)
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke oprette garnsalgsannonce');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function GetYarnSaleDetails(
  id: number,
  accessToken: string
): Promise<YarnSaleProfilePrivateDTO> {
  const response = await fetch(yarnUrl(id), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente garnsalgsprofil');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function UpdateYarnSaleDetails(
  id: number,
  updateDto: YarnPostPutSaleDetailsDTO,
  accessToken: string
): Promise<YarnSaleProfilePrivateDTO> {
  const response = await fetch(yarnUrl(id), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(updateDto)
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke opdatere garnsalgsannonce');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function DeleteYarnSaleDetails(
  id: number,
  accessToken: string
): Promise<boolean> {
  const response = await fetch(yarnUrl(id), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke slette garnsalgsannonce');
  const payload = await response.json().catch(() => null);
  return payload?.data ?? true;
}
