// src/app/actions/sales/salesRabbitActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
  CreateRabbitSaleDetails,
  GetRabbitSaleDetails,
  UpdateRabbitSaleDetails,
  DeleteRabbitSaleDetails
} from '@/api/endpoints/rabbitSaleController';
import { RabbitPostPutSaleDetailsDTO, RabbitSaleProfilePrivateDTO } from '@/api/types/RabbitSaleDTOs';

// =============== TYPES ===============

export type RabbitSaleResult =
  | { success: true; data: RabbitSaleProfilePrivateDTO }
  | { success: false; error: string };

export type RabbitSaleMessageResult =
  | { success: true; message: string }
  | { success: false; error: string };

// =============== CREATE ===============

export async function createRabbitSaleDetails(
  earCombId: string,
  saleDetailsData: RabbitPostPutSaleDetailsDTO
): Promise<RabbitSaleResult> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };
  try {
    const data = await CreateRabbitSaleDetails(earCombId, saleDetailsData, accessToken);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Der skete en fejl ved oprettelse' };
  }
}

// =============== READ ===============

export async function getRabbitSaleDetails(
  id: number
): Promise<RabbitSaleResult> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };
  try {
    const data = await GetRabbitSaleDetails(id, accessToken);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Kunne ikke hente salgsprofil' };
  }
}

// =============== UPDATE ===============

export async function updateRabbitSaleDetails(
  id: number,
  updatedData: RabbitPostPutSaleDetailsDTO
): Promise<RabbitSaleMessageResult> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };
  try {
    await UpdateRabbitSaleDetails(id, updatedData, accessToken);
    return { success: true, message: 'Salgsopslaget blev opdateret' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
  }
}

// =============== DELETE ===============

export async function deleteRabbitSaleDetails(
  id: number
): Promise<RabbitSaleMessageResult> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { success: false, error: 'Du er ikke logget ind' };
  try {
    await DeleteRabbitSaleDetails(id, accessToken);
    return { success: true, message: 'Salgsopslaget blev slettet' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Der skete en uventet fejl' };
  }
}