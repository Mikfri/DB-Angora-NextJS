// src/app/actions/sales/salesYarnActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
  CreateYarnSaleDetails,
  GetYarnSaleDetails,
  UpdateYarnSaleDetails,
  DeleteYarnSaleDetails
} from '@/api/endpoints/yarnController';
import { YarnPostPutSaleDetailsDTO, YarnSaleProfilePrivateDTO } from '@/api/types/YarnDTOs';

type SuccessWithData<T> = { success: true; data: T };
type SuccessWithMessage = { success: true; message: string };
type Failure = { success: false; error: string };

export async function createYarnSaleDetails(
  createDto: YarnPostPutSaleDetailsDTO
): Promise<SuccessWithData<YarnSaleProfilePrivateDTO> | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    const result = await CreateYarnSaleDetails(createDto, accessToken);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function getYarnSaleDetails(
  id: number
): Promise<SuccessWithData<YarnSaleProfilePrivateDTO> | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    const result = await GetYarnSaleDetails(id, accessToken);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function updateYarnSaleDetails(
  id: number,
  updateDto: YarnPostPutSaleDetailsDTO
): Promise<SuccessWithMessage | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    await UpdateYarnSaleDetails(id, updateDto, accessToken);
    return { success: true, message: 'Garnsalgsannonce opdateret' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}

export async function deleteYarnSaleDetails(
  id: number
): Promise<SuccessWithMessage | Failure> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };

  try {
    await DeleteYarnSaleDetails(id, accessToken);
    return { success: true, message: 'Garnsalgsannonce slettet' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Uventet fejl' };
  }
}
