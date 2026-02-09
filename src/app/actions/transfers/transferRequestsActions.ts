// src/app/actions/transfers/transferRequestsActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
  TransferRequest_ContractDTO,
  TransferRequest_CreateDTO,
  TransferRequestPreviewDTO
} from '@/api/types/AngoraDTOs';
import {
  CreateTransferRequest,
  DeleteTransferRequest,
  GetTransferContract,
  RespondToTransferRequest
} from '@/api/endpoints/transferRequestsController';

// ====================== TYPES ======================
export type TransferRequestCreateResult =
  | { success: true; data: TransferRequest_ContractDTO; message: string }
  | { success: false; error: string };

export type TransferRequestsResult =
  | { success: true; received: TransferRequestPreviewDTO[]; sent: TransferRequestPreviewDTO[] }
  | { success: false; error: string };

export type TransferRequestActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type TransferRequestContractResult =
  | { success: true; contract: TransferRequest_ContractDTO }
  | { success: false; error: string };

export type TransferRequestDeleteResult =
  | { success: true; preview: TransferRequestPreviewDTO }
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
  * @returns Resultat af handlingen
  */
export async function respondToTransferRequest(
  transferId: number,
  accept: boolean
): Promise<TransferRequestActionResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }

    // Byg DTO til API'et
    const responseDTO = { accept };

    // Kald det opdaterede endpoint
    const contract = await RespondToTransferRequest(transferId, responseDTO, accessToken);

    // Hvis contract er null, er anmodningen afvist
    if (!contract) {
      return {
        success: true,
        message: 'Overførselsanmodning afvist'
      };
    }

    // Ellers accepteret
    return {
      success: true,
      message: 'Overførselsanmodning accepteret'
    };
  } catch (error) {
    const isForbidden = error instanceof Error && error.message.includes('403 Forbidden');
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

    const preview = await DeleteTransferRequest(transferId, accessToken);

    return {
      success: true,
      preview
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}