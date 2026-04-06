// src/app/actions/sales/salesWoolCardedActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
  CreateWoolCardedSaleDetails,
  GetWoolCardedSaleDetails,
  UpdateWoolCardedSaleDetails,
  DeleteWoolCardedSaleDetails
} from '@/api/endpoints/woolCardedController';
import { WoolCardedPostPutSaleDetailsDTO, WoolCardedSaleProfilePrivateDTO } from '@/api/types/WoolCardedDTOs';

type SuccessWithData<T> = { success: true; data: T };
type Failure = { success: false; error: string };

export async function createWoolCardedSaleDetails(
  createDto: WoolCardedPostPutSaleDetailsDTO
): Promise<SuccessWithData<WoolCardedSaleProfilePrivateDTO> | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    const result = await CreateWoolCardedSaleDetails(createDto, accessToken);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function getWoolCardedSaleDetails(
  id: number
): Promise<SuccessWithData<WoolCardedSaleProfilePrivateDTO> | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    const result = await GetWoolCardedSaleDetails(id, accessToken);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function updateWoolCardedSaleDetails(
  id: number,
  updateDto: WoolCardedPostPutSaleDetailsDTO
): Promise<{ success: true; message: string } | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    await UpdateWoolCardedSaleDetails(id, updateDto, accessToken);
    return { success: true, message: 'Kartet uld salgsannonce opdateret' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function deleteWoolCardedSaleDetails(id: number): Promise<{ success: true; message: string } | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    await DeleteWoolCardedSaleDetails(id, accessToken);
    return { success: true, message: 'Kartet uld salgsannonce slettet' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}
