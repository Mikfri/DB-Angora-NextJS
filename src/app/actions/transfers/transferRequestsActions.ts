// src/app/actions/transfers/transferRequestsActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import { 
  TransferRequest_ContractDTO,
  TransferRequest_CreateDTO,
  TransferRequest_ReceivedDTO, 
  TransferRequest_SentDTO 
} from '@/api/types/AngoraDTOs';
import { 
  GetReceivedTransferRequests, 
  GetSentTransferRequests 
} from '@/api/endpoints/accountController';
import { 
  CreateTransferRequest,
  RespondToTransferRequest, 
  DeleteTransferRequest 
} from '@/api/endpoints/transferRequestsController';

// ====================== TYPES ======================
export type TransferRequestCreateResult = 
  | { success: true; data: TransferRequest_ContractDTO; message: string }
  | { success: false; error: string };

export type TransferRequestsResult = 
  | { success: true; received: TransferRequest_ReceivedDTO[]; sent: TransferRequest_SentDTO[] }
  | { success: false; error: string };

export type TransferRequestActionResult = 
  | { success: true; message: string }
  | { success: false; error: string };

// ====================== CREATE ======================

/**
 * Server Action: Anmoder om ejerskabsoverdragelse for en kanin
 * @param transferRequest Data for ejerskabsoverdragelse
 * @returns Resultat med kontrakt eller fejlbesked
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
    
    // Validér data
    if (!transferRequest.recipent_BreederRegNo || transferRequest.recipent_BreederRegNo.trim() === '') {
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
    
    // Debug-logging for konsistens med resten af filen
    console.log(`Forsøger at oprette overførselsanmodning for kanin ${transferRequest.rabbit_EarCombId} til avler ${transferRequest.recipent_BreederRegNo}`);
    
    // Kald API
    const result = await CreateTransferRequest(transferRequest, accessToken);
    
    return {
      success: true,
      data: result,
      message: 'Ejerskabsoverdragelse anmodning sendt'
    };
  } catch (error) {
    console.error('Fejl ved anmodning om ejerskabsoverdragelse:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

// ====================== FETCH ======================

/**
 * Server Action: Henter både modtagne og afsendte overførselsanmodninger
 * @returns Objekt med lister af overførselsanmodninger eller fejlbesked
 */
export async function getTransferRequests(): Promise<TransferRequestsResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    // Hent både modtagne og afsendte anmodninger samtidigt
    const [received, sent] = await Promise.all([
      GetReceivedTransferRequests(accessToken),
      GetSentTransferRequests(accessToken)
    ]);
    
    return {
      success: true,
      received,
      sent
    };
  } catch (error) {
    console.error('Fejl ved hentning af overførselsanmodninger:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}

// ====================== RESPOND ======================

/**
 * Server Action: Svarer på en overførselsanmodning (accept/afvis)
 * @param transferId ID på anmodningen
 * @param accept Hvorvidt anmodningen accepteres
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
      
      // Log request data for at hjælpe med fejlfinding
      console.log(`Forsøger at besvare transfer request ${transferId} med accept=${accept}`);
      console.log(`Token starter med: ${accessToken.substring(0, 15)}...`);
      
      // Forsøg at kalde API'et
      const responseData = await RespondToTransferRequest(transferId, { accept }, accessToken);
      console.log('API svar:', responseData);
      
      return {
        success: true,
        message: accept ? 'Overførselsanmodning accepteret' : 'Overførselsanmodning afvist'
      };
    } catch (error) {
      // Mere detaljeret fejl-logning
      console.error('Fejl ved svar på overførselsanmodning:', error);
      
      // Hvis fejlmeddelelsen kommer fra API'et, log den i en mere læsbar form
      if (error instanceof Error && error.message.startsWith('Fejl:')) {
        console.error('API fejldetaljer:', error.message.substring(5));
      }
      
      // Tjek om det er en 403 Forbidden fejl specifikt
      const isForbidden = error instanceof Error && 
                            error.message.includes('403 Forbidden');
      
      return {
        success: false,
        error: isForbidden 
          ? 'Du har ikke tilladelse til at besvare denne anmodning. Kontrollér om anmodningen allerede er besvaret eller om du har de korrekte rettigheder.'
          : error instanceof Error ? error.message : 'Der skete en uventet fejl'
      };
    }
  }

// ====================== DELETE ======================

/**
 * Server Action: Sletter/annullerer en overførselsanmodning
 * @param transferId ID på anmodningen
 * @returns Resultat af handlingen
 */
export async function deleteTransferRequest(
  transferId: number
): Promise<TransferRequestActionResult> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }
    
    await DeleteTransferRequest(transferId, accessToken);
    
    return {
      success: true,
      message: 'Overførselsanmodning annulleret'
    };
  } catch (error) {
    console.error('Fejl ved sletning af overførselsanmodning:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}