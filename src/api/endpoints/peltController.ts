import { parseApiError } from '../client/errorHandlers';
import { getApiUrl } from '../config/apiConfig';
import { PeltPostPutSaleDetailsDTO, PeltSaleProfilePrivateDTO } from '../types/PeltDTOs';

const peltUrl = (id?: number) => 
  getApiUrl(`Pelt${id != null ? `/${id}` : ''}`);

export async function CreatePeltSaleDetails(
  createDto: PeltPostPutSaleDetailsDTO,
  accessToken: string
): Promise<PeltSaleProfilePrivateDTO> {
  const response = await fetch(peltUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(createDto)
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke oprette pelsalgsannonce');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function GetPeltSaleDetails(
  id: number,
  accessToken: string
): Promise<PeltSaleProfilePrivateDTO> {
  const response = await fetch(peltUrl(id), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke hente pelsalgsprofil');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function UpdatePeltSaleDetails(
  id: number,
  updateDto: PeltPostPutSaleDetailsDTO,
  accessToken: string
): Promise<PeltSaleProfilePrivateDTO> {
  const response = await fetch(peltUrl(id), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(updateDto)
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke opdatere pelsalgsannonce');
  const payload = await response.json();
  return payload?.data ?? payload;
}

export async function DeletePeltSaleDetails(
  id: number,
  accessToken: string
): Promise<boolean> {
  const response = await fetch(peltUrl(id), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) throw await parseApiError(response, 'Kunne ikke slette pelsalgsannonce');
  const payload = await response.json().catch(() => null);
  return payload?.data ?? true;
}
