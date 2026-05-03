// src/app/actions/sales/salesPeltActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
  CreatePeltSaleDetails,
  GetPeltSaleDetails,
  UpdatePeltSaleDetails,
  DeletePeltSaleDetails
} from '@/api/endpoints/peltController';
import { PeltPostPutSaleDetailsDTO, PeltSaleProfilePrivateDTO } from '@/api/types/PeltDTOs';

type SuccessWithData<T> = { success: true; data: T };
type SuccessWithMessage = { success: true; message: string };
type Failure = { success: false; error: string };

export async function createPeltSaleDetails(
  createDto: PeltPostPutSaleDetailsDTO
): Promise<SuccessWithData<PeltSaleProfilePrivateDTO> | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    const result = await CreatePeltSaleDetails(createDto, accessToken);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function getPeltSaleDetails(
  id: number
): Promise<SuccessWithData<PeltSaleProfilePrivateDTO> | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    const result = await GetPeltSaleDetails(id, accessToken);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function updatePeltSaleDetails(
  id: number,
  updateDto: PeltPostPutSaleDetailsDTO
): Promise<SuccessWithMessage | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    await UpdatePeltSaleDetails(id, updateDto, accessToken);
    return { success: true, message: 'Pelsalgsannonce opdateret' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function deletePeltSaleDetails(
  id: number
): Promise<SuccessWithMessage | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    await DeletePeltSaleDetails(id, accessToken);
    return { success: true, message: 'Pelsalgsannonce slettet' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

