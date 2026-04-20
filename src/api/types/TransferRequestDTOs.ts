// src/api/types/TransferRequestDTOs.ts
import { RabbitSnapshotDTO } from './RabbitDTOs';

/**
 * Repræsenterer en part i en kanin transfer, dvs enten udsteder eller modtager.
 */
export interface TransferPartyDTO {
    breederRegNo: string;
    fullName: string;
    email: string;
    roadNameAndNo: string;
    zipCode: number;
    city: string;
}

/**
 * Komplet kontrakt for en transfer request.
 * Indeholder fuld information når Status = Accepted, begrænset når Pending.
 */
export interface TransferRequest_ContractDTO {
    id: number;
    status: string;
    dateAccepted: string;
    //--- Issuer
    issuer: TransferPartyDTO;
    //--- Recipient
    recipient: TransferPartyDTO;
    //--- Rabbit (pre-transfer)
    rabbit_EarCombId: string;
    rabbit_NickName: string | null;
    rabbit_ProfilePhotoUrl: string | null;
    //--- Sale terms
    price: number | null;
    saleConditions: string | null;
    rabbitSnapshot?: RabbitSnapshotDTO | null; // Får først værdi ved Accept
}


/**
 * DTO for at oprette en transfer request. Indeholder kun de nødvendige oplysninger for at oprette et TransferRequest.
 */
export interface TransferRequest_CreateDTO {
    rabbit_EarCombId: string;
    recipient_BreederRegNo: string;
    price: number | null;
    saleConditions: string | null;      // filePath til et dokument med salgsbetingelser, eller direkte tekst
}

/**
 * Simpel DTO for at acceptere eller afvise en transfer request.
 */
export interface TransferRequest_ResponseDTO {
    accept: boolean;
}

/**
 * Benyttes af af folk med kaniner til at få et overblik over issued og received transfer requests, og for at kunne filtrere i disse.
 * Indeholder kun de mest basale oplysninger, og ingen kontaktinfo eller detaljer om salgsbetingelser, da det er tænkt som en "preview" i en liste.
 * For mere detaljeret information om en specifik transfer request, benyttes TransferRequest_ContractDTO.
 */
export interface TransferRequestPreviewDTO {
    //--- Generelle properties
    id: number;
    status: string;
    dateAccepted?: string | null;
    //--- Modtager properties
    recipient_BreederRegNo?: string | null;
    recipient_FirstName?: string | null;
    //--- Udsteder properties
    issuer_BreederRegNo?: string | null;
    issuer_FirstName?: string | null;    
    //--- Kanin properties
    rabbit_EarCombId?: string | null;
    rabbit_NickName?: string | null;
    rabbit_ProfilePhotoUrl?: string | null;
    //--- Salgs properties
    price: number | null;
    saleConditions: string | null;
}
export type TransferRequestPreviewList = TransferRequestPreviewDTO[];


export interface TransferRequestPreviewFilterDTO {
    status?: string | null;             // "Pending", "Accepted", "Rejected"
    //--- Kanin properties
    rabbit_EarCombId?: string | null;
    rabbit_NickName?: string | null;
    //--- Issuer properties
    issuer_BreederRegNo?: string;
    issuer_FirstName?: string | null;
    //--- Recipient properties
    recipient_BreederRegNo?: string | null;
    recipient_FirstName?: string | null;
    from_dateAccepted?: string | null;
}