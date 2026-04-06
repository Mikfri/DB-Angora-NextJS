// src/app/actions/sales/salesWoolRawActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
  CreateWoolRawSaleDetails,
  GetWoolRawSaleDetails,
  UpdateWoolRawSaleDetails,
  DeleteWoolRawSaleDetails
} from '@/api/endpoints/woolRawController';
import { WoolRawPostPutSaleDetailsDTO, WoolRawSaleProfilePrivateDTO } from '@/api/types/WoolRawDTOs';

type SuccessWithData<T> = { success: true; data: T };
type SuccessWithMessage = { success: true; message: string };
type Failure = { success: false; error: string };

export async function createWoolRawSaleDetails(
  createDto: WoolRawPostPutSaleDetailsDTO
): Promise<SuccessWithData<WoolRawSaleProfilePrivateDTO> | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    const result = await CreateWoolRawSaleDetails(createDto, accessToken);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function getWoolRawSaleDetails(
  id: number
): Promise<SuccessWithData<WoolRawSaleProfilePrivateDTO> | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    const result = await GetWoolRawSaleDetails(id, accessToken);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function updateWoolRawSaleDetails(
  id: number,
  updateDto: WoolRawPostPutSaleDetailsDTO
): Promise<SuccessWithMessage | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    await UpdateWoolRawSaleDetails(id, updateDto, accessToken);
    return { success: true, message: 'Råuld salgsannonce opdateret' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function deleteWoolRawSaleDetails(
  id: number
): Promise<SuccessWithMessage | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    await DeleteWoolRawSaleDetails(id, accessToken);
    return { success: true, message: 'Råuld salgsannonce slettet' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}
