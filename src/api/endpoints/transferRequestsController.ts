import {
    TransferRequest_CreateDTO,
    TransferRequest_ContractDTO,
    TransferRequest_ResponseDTO,
    TransferRequestPreviewDTO,
    TransferRequestPreviewFilterDTO,
    ResultPagedDTO
} from '@/api/types/AngoraDTOs';
import { getApiUrl } from '../config/apiConfig';
import { parseApiError } from '../client/errorHandlers';


//-------------------- POST

/**
 * Opret en ny overførselsanmodning for en kanin
 * @param createTransferDTO Detaljer om overførslen
 * @param accessToken Brugerens adgangstoken
 * @returns Den oprettede overførselskontrakt
 */
export async function CreateTransferRequest(
    createTransferDTO: TransferRequest_CreateDTO,
    accessToken: string
): Promise<TransferRequest_ContractDTO> {
    const response = await fetch(getApiUrl('TransferRequest'), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(createTransferDTO)
    });

    if (response.status === 201) {
        return response.json();
    }

    throw await parseApiError(response);
}

/**
 * Besvar en overførselsanmodning (acceptér eller afvis)
 * @param transferId ID for overførselsanmodningen
 * @param responseDTO Respons med accept eller afvisning
 * @param accessToken Brugerens adgangstoken
 * @returns Den opdaterede overførselskontrakt (status-feltet angiver "Accepted"/"Rejected")
 */
export async function RespondToTransferRequest(
    transferId: number,
    responseDTO: TransferRequest_ResponseDTO,
    accessToken: string
): Promise<TransferRequest_ContractDTO> {
    const response = await fetch(getApiUrl(`TransferRequest/${transferId}/respond`), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(responseDTO)
    });

    if (!response.ok) {
        throw await parseApiError(response);
    }

    return response.json();
}

//-------------------- GET

/**
 * Hent kontrakt-detaljer for en specifik overførselsanmodning
 * @param transferId ID for overførselsanmodningen
 * @param accessToken Brugerens adgangstoken
 * @returns Overførselskontrakten
 */
export async function GetTransferContract(
    transferId: number,
    accessToken: string
): Promise<TransferRequest_ContractDTO> {
    const response = await fetch(getApiUrl(`TransferRequest/${transferId}`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw await parseApiError(response);
    }

    return response.json();
}

/**
 * Henter alle modtagne transfer requests for en specifik bruger (pagineret)
 * @param targetedUserId ID på den bruger hvis modtagne requests ønskes
 * @param accessToken Brugerens adgangstoken
 * @param filter Valgfrie filterparametre
 * @param page Sidenummer (1-baseret)
 * @param pageSize Antal resultater pr. side
 * @returns Pagineret liste af transfer request previews
 */
export async function GetTransferRequestsReceived(
    targetedUserId: string,
    accessToken: string,
    filter?: TransferRequestPreviewFilterDTO,
    page: number = 1,
    pageSize: number = 20
): Promise<ResultPagedDTO<TransferRequestPreviewDTO>> {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (filter) {
        if (filter.status) params.set('status', filter.status);
        if (filter.rabbit_EarCombId) params.set('rabbit_EarCombId', filter.rabbit_EarCombId);
        if (filter.rabbit_NickName) params.set('rabbit_NickName', filter.rabbit_NickName);
        if (filter.issuer_BreederRegNo) params.set('issuer_BreederRegNo', filter.issuer_BreederRegNo);
        if (filter.issuer_FirstName) params.set('issuer_FirstName', filter.issuer_FirstName);
        if (filter.recipient_BreederRegNo) params.set('recipient_BreederRegNo', filter.recipient_BreederRegNo);
        if (filter.recipient_FirstName) params.set('recipient_FirstName', filter.recipient_FirstName);
        if (filter.from_dateAccepted) params.set('from_dateAccepted', filter.from_dateAccepted);
    }

    const response = await fetch(getApiUrl(`TransferRequest/${targetedUserId}/received?${params.toString()}`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw await parseApiError(response);
    }

    return response.json();
}

/**
 * Henter alle udsendte transfer requests for en specifik bruger (pagineret)
 * @param targetedUserId ID på den bruger hvis udsendte requests ønskes
 * @param accessToken Brugerens adgangstoken
 * @param filter Valgfrie filterparametre
 * @param page Sidenummer (1-baseret)
 * @param pageSize Antal resultater pr. side
 * @returns Pagineret liste af transfer request previews
 */
export async function GetTransferRequestsIssued(
    targetedUserId: string,
    accessToken: string,
    filter?: TransferRequestPreviewFilterDTO,
    page: number = 1,
    pageSize: number = 20
): Promise<ResultPagedDTO<TransferRequestPreviewDTO>> {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (filter) {
        if (filter.status) params.set('status', filter.status);
        if (filter.rabbit_EarCombId) params.set('rabbit_EarCombId', filter.rabbit_EarCombId);
        if (filter.rabbit_NickName) params.set('rabbit_NickName', filter.rabbit_NickName);
        if (filter.issuer_BreederRegNo) params.set('issuer_BreederRegNo', filter.issuer_BreederRegNo);
        if (filter.issuer_FirstName) params.set('issuer_FirstName', filter.issuer_FirstName);
        if (filter.recipient_BreederRegNo) params.set('recipient_BreederRegNo', filter.recipient_BreederRegNo);
        if (filter.recipient_FirstName) params.set('recipient_FirstName', filter.recipient_FirstName);
        if (filter.from_dateAccepted) params.set('from_dateAccepted', filter.from_dateAccepted);
    }

    const response = await fetch(getApiUrl(`TransferRequest/${targetedUserId}/issued?${params.toString()}`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw await parseApiError(response);
    }

    return response.json();
}

/**
 * Henter antal afventende transfer requests for en specifik bruger
 * @param targetedUserId ID på den bruger hvis pending count ønskes
 * @param accessToken Brugerens adgangstoken
 * @returns Antal afventende transfer requests
 */
export async function GetPendingTransferRequestCount(
    targetedUserId: string,
    accessToken: string
): Promise<number> {
    const response = await fetch(getApiUrl(`TransferRequest/${targetedUserId}/pending-count`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw await parseApiError(response);
    }

    const result = await response.json();
    // API returnerer ResultDTO<int> med en 'data' property
    return typeof result === 'number' ? result : result.data;
}

//-------------------- DELETE

/**
 * Slet en overførselsanmodning (kun muligt mens status er 'Pending')
 * @param transferId ID for overførselsanmodningen
 * @param accessToken Brugerens adgangstoken
 * @returns true hvis sletningen lykkedes
 */
export async function DeleteTransferRequest(
    transferId: number,
    accessToken: string
): Promise<boolean> {
    const response = await fetch(getApiUrl(`TransferRequest/${transferId}`), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw await parseApiError(response);
    }

    return response.json();
}
