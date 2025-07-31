import { TransferRequest_CreateDTO, TransferRequest_ContractDTO, TransferRequest_ResponseDTO, TransferRequestPreviewDTO } from '@/api/types/AngoraDTOs';
import { getApiUrl } from '../config/apiConfig';


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
    const response = await fetch(getApiUrl('TransferRequest/Create'), {
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

    // Håndter forskellige fejlstatusser og forsøg at parse fejlbesked fra API
    let errorMessage = `Fejl: ${response.status} ${response.statusText}`;
    try {
        const errorText = await response.text();
        if (errorText) {
            try {
                const parsed = JSON.parse(errorText);
                errorMessage = parsed.message || errorText;
            } catch {
                errorMessage = errorText;
            }
        }
    } catch { /* ignore */ }

    throw new Error(errorMessage);
}

/**
 * Besvar en overførselsanmodning (acceptér eller afvis)
 * @param transferId ID for overførselsanmodningen
 * @param responseDTO Respons med accept eller afvisning
 * @param accessToken Brugerens adgangstoken
 * @returns Den opdaterede overførselskontrakt ved accept, eller null hvis afvist
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
            'Accept': 'application/json'
        },
        body: JSON.stringify(responseDTO)
    });

    if (!response.ok) {
        // Prøv at parse fejlbesked fra API
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
            const errorText = await response.text();
            if (errorText) {
                try {
                    const parsed = JSON.parse(errorText);
                    errorMessage = parsed.message || errorText;
                } catch {
                    errorMessage = errorText;
                }
            }
        } catch { /* ignore */ }
        throw new Error(errorMessage);
    }

    // Hvis afvist, returner null (API returnerer { message: "..."} eller lign.)
    const data = await response.json();
    if (data && data.message) return null;

    // Ellers returner kontrakten
    return data as TransferRequest_ContractDTO;
}

//-------------------- READ
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
    const response = await fetch(getApiUrl(`TransferRequest/Get/${transferId}`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
            const errorText = await response.text();
            if (errorText) {
                try {
                    const parsed = JSON.parse(errorText);
                    errorMessage = parsed.message || errorText;
                } catch {
                    errorMessage = errorText;
                }
            }
        } catch { /* ignore */ }
        throw new Error(errorMessage);
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
): Promise<TransferRequestPreviewDTO> {
    const response = await fetch(getApiUrl(`TransferRequest/Delete/${transferRequestId}`), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
            const errorText = await response.text();
            if (errorText) {
                try {
                    const parsed = JSON.parse(errorText);
                    errorMessage = parsed.message || errorText;
                } catch {
                    errorMessage = errorText;
                }
            }
        } catch { /* ignore */ }
        throw new Error(errorMessage);
    }

    return response.json();
}