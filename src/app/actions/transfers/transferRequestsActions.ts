// src/app/actions/transfers/transferRequestsActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
  TransferRequest_ContractDTO,
  TransferRequest_CreateDTO,
  TransferRequestPreviewDTO,
  TransferRequestPreviewFilterDTO,
  ResultPagedDTO
} from '@/api/types/AngoraDTOs';
import {
  CreateTransferRequest,
  DeleteTransferRequest,
  GetTransferContract,
  GetTransferRequestsIssued,
  GetTransferRequestsReceived,
  GetPendingTransferRequestCount,
  RespondToTransferRequest
} from '@/api/endpoints/transferRequestsController';

// ====================== TYPES ======================
export type TransferRequestCreateResult =
  | { success: true; data: TransferRequest_ContractDTO; message: string }
  | { success: false; error: string };

export type TransferRequestRespondResult =
  | { success: true; contract: TransferRequest_ContractDTO; message: string }
  | { success: false; error: string };

export type TransferRequestActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type TransferRequestContractResult =
  | { success: true; contract: TransferRequest_ContractDTO }
  | { success: false; error: string };

export type TransferRequestDeleteResult =
  | { success: true }
  | { success: false; error: string };

export type TransferRequestsPagedResult =
  | { success: true; data: ResultPagedDTO<TransferRequestPreviewDTO> }
  | { success: false; error: string };

export type PendingTransferCountResult =
  | { success: true; count: number }
  | { success: false; error: string };

// ====================== POST ======================
/*
  * Server Action: Opretter en ny ejerskabsoverdragelse anmodning
  * @param transferRequest DTO med oplysninger om overførselsanmodningen
  * @returns Resultat af oprettelsen
  */
export async function createRabbitTransferRequest(
  transferRequest: TransferRequest_CreateDTO
): Promise<TransferRequestCreateResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }

    if (!transferRequest.recipient_BreederRegNo || transferRequest.recipient_BreederRegNo.trim() === '') {
      return {
        success: false,
        error: 'Modtagerens avlernummer er påkrævet'
      };
    }

    if (!transferRequest.rabbit_EarCombId) {
      return {
        success: false,
        error: 'Kaninens øremærke er påkrævet'
      };
    }

    // Kald det opdaterede endpoint
    const contract = await CreateTransferRequest(transferRequest, accessToken);

    return {
      success: true,
      data: contract,
      message: 'Ejerskabsoverdragelse anmodning sendt'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

/*
  * Server Action: Besvar en overførselsanmodning
  * @param transferId ID for overførselsanmodningen
  * @param accept Om anmodningen skal accepteres eller afvises
  * @returns Resultat med den opdaterede kontrakt
  */
export async function respondToTransferRequest(
  transferId: number,
  accept: boolean
): Promise<TransferRequestRespondResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }

    const contract = await RespondToTransferRequest(transferId, { accept }, accessToken);

    return {
      success: true,
      contract,
      message: contract.status === 'Accepted'
        ? 'Overførselsanmodning accepteret'
        : 'Overførselsanmodning afvist'
    };
  } catch (error) {
    const isForbidden = error instanceof Error && error.message.includes('403');
    return {
      success: false,
      error: isForbidden
        ? 'Du har ikke tilladelse til at besvare denne anmodning. Kontrollér om anmodningen allerede er besvaret eller om du har de korrekte rettigheder.'
        : error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

// ====================== GET ======================

export async function getTransferContract(
  transferId: number
): Promise<TransferRequestContractResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }

    const contract = await GetTransferContract(transferId, accessToken);

    return {
      success: true,
      contract
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

export async function getTransferRequestsReceived(
  targetedUserId: string,
  filter?: TransferRequestPreviewFilterDTO,
  page: number = 1,
  pageSize: number = 20
): Promise<TransferRequestsPagedResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return { success: false, error: 'Du er ikke logget ind' };
    }

    const data = await GetTransferRequestsReceived(targetedUserId, accessToken, filter, page, pageSize);

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

export async function getTransferRequestsIssued(
  targetedUserId: string,
  filter?: TransferRequestPreviewFilterDTO,
  page: number = 1,
  pageSize: number = 20
): Promise<TransferRequestsPagedResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return { success: false, error: 'Du er ikke logget ind' };
    }

    const data = await GetTransferRequestsIssued(targetedUserId, accessToken, filter, page, pageSize);

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

export async function getPendingTransferRequestCount(
  targetedUserId: string
): Promise<PendingTransferCountResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return { success: false, error: 'Du er ikke logget ind' };
    }

    const count = await GetPendingTransferRequestCount(targetedUserId, accessToken);

    return { success: true, count };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

// ====================== DELETE ======================

export async function deleteTransferRequest(
  transferId: number
): Promise<TransferRequestDeleteResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }

    await DeleteTransferRequest(transferId, accessToken);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}
