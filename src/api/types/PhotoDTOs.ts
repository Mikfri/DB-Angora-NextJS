// src/api/types/PhotoDTOs.ts

/**
 * Sender billedoplysninger fra frontenden (DB-AngoraNextJS) til backenden (DB-AngoraREST API'en),
 * EFTER at et billede er uploadet til Cloudinary.
 * Backenden bruger denne DTO til at registrere billedets oplysninger i databasen.
 */
export interface CloudinaryPhotoRegistryRequestDTO {
    cloudinaryPublicId: string;
    cloudinaryUrl: string;
    fileName: string;
    entityStringId: string;
    entityIntId: number;
    entityType: string;
}

/**
 * En DTO som indeholder de nødvendige oplysninger for at uploade et billede til Cloudinary.
 * Sendt fra DB-AngoraREST API'en til brug af et pt: UN-SIGNED-upload setup på Cloudinary.
 * https://console.cloudinary.com/settings/[...]/upload/presets
 */
export interface CloudinaryUploadConfigDTO {
    apiKey: string;
    cloudName: string;
    //timestamp: string;
    //uploadSignature: string;
    uploadPreset: string;   // er det foruddefinerede upload preset i Cloudinary, der bruges til at konfigurere upload-indstillingerne
    folder: string;
    source: string;
    entityId: string;
    entityType: string;
    context: string;        // Bruges til at angive metadata om entiteten, fx "entity_type=rabbit|entity_id=1234-5678"
    tags: string;
}

/**
 * Benyttes pt ikke.
 */
export interface CloudinaryUploadSignatureDTO {
    apiKey: string;
    cloudName: string;
    timestamp: string;
    uploadSignature: string;
    folder: string;
    uploadPreset: string;
    source: string;
    entityStringId: string;
    entityIntId: number;
    entityType: string;
    context: string;
    tags: string;
}


/**
 * Indeholder private oplysninger om et foto, som kun er relevante for ejere og admins
 */
export interface PhotoPrivateDTO {
    id: number;
    userUploaderId: string;
    filePath: string;           // URL til billedet
    fileName: string;
    cloudinaryPublicId: string;
    uploadDate: string;
}
export type PhotoPrivateDTOList = PhotoPrivateDTO[];

/**
 * Indeholder offentlige oplysninger om et foto, som kan vises for alle brugere.
 */
export interface PhotoPublicDTO {
    id: number;
    filePath: string;           // URL til billedet
    fileName: string;
    uploadDate: string;
}
export type PhotoPublicDTOList = PhotoPublicDTO[];