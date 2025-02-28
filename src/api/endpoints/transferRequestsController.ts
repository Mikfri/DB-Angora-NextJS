import { TransferRequest_CreateDTO, TransferRequest_ContractDTO, TransferRequest_ResponseDTO, TransferRequest_PreviewDTO } from '@/api/types/AngoraDTOs';
import { getApiUrl } from '../config/apiConfig';


//-------------------- CREATE
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
    const response = await fetch(getApiUrl('TransferRequest/Create'), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        },
        body: JSON.stringify(createTransferDTO)
    });

    if (!response.ok) {
        // Forsøg at hente detaljeret fejlbesked fra API'en
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
            const errorResponse = await response.text();
            if (errorResponse) {
                errorMessage = errorResponse;
            }
        } catch (e) {
            // Hvis vi ikke kan parse fejlbeskeden, bruger vi den generiske
            console.error('Kunne ikke parse fejlbesked:', e);
        }

        throw new Error(`Fejl: ${errorMessage}`);
    }

    return response.json();
}

/**
 * Besvar en overførselsanmodning (acceptér eller afvis)
 * @param transferId ID for overførselsanmodningen
 * @param responseDTO Respons med accept eller afvisning
 * @param accessToken Brugerens adgangstoken
 * @returns Den opdaterede overførselskontrakt ved accept, eller en tom respons ved afvisning
 */
export async function RespondToTransferRequest(
    transferId: number,
    responseDTO: TransferRequest_ResponseDTO,
    accessToken: string
): Promise<TransferRequest_ContractDTO | null> {
    const response = await fetch(getApiUrl(`TransferRequest/Respond/${transferId}`), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        },
        body: JSON.stringify(responseDTO)
    });

    if (!response.ok) {
        // Forsøg at hente detaljeret fejlbesked fra API'en
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
            const errorResponse = await response.text();
            if (errorResponse) {
                errorMessage = errorResponse;
            }
        } catch (e) {
            // Hvis vi ikke kan parse fejlbeskeden, bruger vi den generiske
            console.error('Kunne ikke parse fejlbesked:', e);
        }

        throw new Error(`Fejl: ${errorMessage}`);
    }

    // Tjek om svaret er en tom OK (ved afvisning)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        // Returnerer null for afvisninger, da API'en returnerer OK uden body
        return null;
    }
}

//-------------------- READ
/**
 * Hent en specifik overførselskontrakt
 * @param transferId ID for overførselsanmodningen
 * @param accessToken Brugerens adgangstoken
 * @returns Overførselskontrakten
 */
export async function GetTransferContract(
    transferId: number,
    accessToken: string
): Promise<TransferRequest_ContractDTO> {
    const response = await fetch(getApiUrl(`TransferRequest/Get/${transferId}`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'text/plain'
        }
    });

    if (!response.ok) {
        // Forsøg at hente detaljeret fejlbesked fra API'en
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
            const errorResponse = await response.text();
            if (errorResponse) {
                errorMessage = errorResponse;
            }
        } catch (e) {
            // Hvis vi ikke kan parse fejlbeskeden, bruger vi den generiske
            console.error('Kunne ikke parse fejlbesked:', e);
        }

        throw new Error(`Fejl: ${errorMessage}`);
    }

    return response.json();
}

/**
 * Slet en overførselsanmodning
 * @param transferRequestId ID for overførselsanmodningen
 * @param accessToken Brugerens adgangstoken
 * @returns Den slettede overførselsanmodning som preview
 */
export async function DeleteTransferRequest(
    transferRequestId: number,
    accessToken: string
): Promise<TransferRequest_PreviewDTO> {
    const response = await fetch(getApiUrl(`TransferRequest/Delete/${transferRequestId}`), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'text/plain'
        }
    });

    if (!response.ok) {
        // Forsøg at hente detaljeret fejlbesked fra API'en
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
            const errorResponse = await response.text();
            if (errorResponse) {
                errorMessage = errorResponse;
            }
        } catch (e) {
            // Hvis vi ikke kan parse fejlbeskeden, bruger vi den generiske
            console.error('Kunne ikke parse fejlbesked:', e);
        }

        throw new Error(`Fejl: ${errorMessage}`);
    }

    return response.json();
}