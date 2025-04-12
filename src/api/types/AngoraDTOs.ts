// src/api/types/DB-AngoraDTOs.ts
export interface Photo_DTO {
    id: number;
    filePath: string;
    fileName: string;
    cloudinaryPublicId: string;
    uploadDate: string;
    entityType: string;
    entityId: string;
    isProfilePicture: boolean;
}

export interface CloudinaryPhotoRegistryRequestDTO {
    publicId: string;
    cloudinaryUrl: string;
    fileName: string;
    entityId: string;
    entityType: string;
}

export interface CloudinaryUploadSignatureDTO {
    apiKey: string;
    cloudName: string;
    timestamp: string;
    uploadSignature: string;
    folder: string;
    uploadPreset: string;
    source: string;
    entityId: string;
    entityType: string;
    context: string;
    tags: string;
}

export interface CloudinaryUploadConfigDTO {
    apiKey: string;
    cloudName: string;
    //timestamp: string;
    //uploadSignature: string;
    folder: string;
    uploadPreset: string;
    source: string;
    entityId: string;
    entityType: string;
    context: string;
    tags: string;
}

export interface Rabbit_CreateDTO {
    rightEarId: string;
    leftEarId: string;
    nickName: string;
    race: string;
    color: string;
    dateOfBirth: string;
    dateOfDeath?: string | null;
    gender: string;
    isForBreeding: boolean;
    father_EarCombId?: string | null;
    mother_EarCombId?: string | null;
}

export interface Rabbit_CreateSaleDetailsDTO {
    rabbitId: string;
    price: number;
    canBeShipped: boolean;
    isLitterTrained: boolean;
    isNeutered: boolean;
    homeEnvironment: string;
    saleDescription: string;
}

export interface Rabbit_ForsaleProfileDTO {
    earCombId: string;
    nickName: string;
    race: string;
    color: string;
    dateOfBirth: string;
    gender: string;
    isForBreeding: boolean;
    profilePicture: string;
    photos: Photo_DTO[];
    ownerFullName: string;
    ownerPhoneNumber: string;
    ownerEmail: string;
    saleDetails: Rabbit_SaleDetailsDTO;
}

export interface Rabbit_ForbreedingPreviewDTO {    // Preview for avlerer
    earCombId: string;
    nickName: string | null;
    originFullName: string | null;
    ownerFullName: string | null;
    race: string | null;
    color: string | null;
    approvedRaceColorCombination: boolean | null;
    dateOfBirth: string | null;
    //dateOfDeath: string | null;
    isJuvenile: boolean | null;
    gender: string | null;
    //isForBreeding: boolean | null;
    zipCode: number;
    city: string;
    fatherId_Placeholder: string | null;
    father_EarCombId: string | null;
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    profilePicture: string;
}
export type Rabbits_ForbreedingPreviewList = Rabbit_ForbreedingPreviewDTO[];

export interface Rabbit_PreviewDTO {    // Preview for avlerer
    earCombId: string;
    nickName: string | null;
    originFullName: string | null;
    ownerFullName: string | null;
    race: string | null;
    color: string | null;
    approvedRaceColorCombination: boolean | null;
    dateOfBirth: string | null;  // API: string($date) format, nullable
    dateOfDeath: string | null;
    isJuvenile: boolean | null;
    gender: string | null;
    isForBreeding: boolean | null;
    hasSaleDetails: boolean;
    fatherId_Placeholder: string | null;
    father_EarCombId: string | null;
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    profilePicture: string;
}
export type Rabbits_PreviewList = Rabbit_PreviewDTO[];

/**
 * Profil oplysningerne for en kanin, inclusive dens tilhørende:
 * - Salgsoplysninger
 * - Billeder
 */
export interface Rabbit_ProfileDTO {
    earCombId: string;
    nickName: string | null;
    originFullName: string | null;
    ownerFullName: string | null;
    race: string | null;
    color: string | null;
    approvedRaceColorCombination: boolean | null;
    dateOfBirth: string | null;  // API: string($date) format, nullable
    dateOfDeath: string | null;
    isJuvenile: boolean | null;
    gender: string | null;
    isForBreeding: boolean | null;
    fatherId_Placeholder: string | null;
    father_EarCombId: string | null;
    profilePicture: string | null;
    saleDetails: Rabbit_SaleDetailsDTO | null;
    photos: Photo_DTO[];
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    children: Rabbit_ChildPreviewDTO[];
}

export interface Rabbit_SaleDetailsDTO {
    id: number;
    dateListed: string;
    price: number;
    canBeShipped: boolean;
    isLitterTrained: boolean;
    isNeutered: boolean;
    homeEnvironment: string;
    saleDescription: string;
}

export interface Rabbit_SaleDetailsPreviewDTO {
    earCombId: string;
    //nickName: string;
    //dateOfBirth: string;
    profilePicture: string;
    race: string;
    gender: string;
    ageInMonths: number;
    price: number;
    //color: string;
    city: string;
    zipCode: number;
}
export type Rabbits_SaleDetailsPreviewList = Rabbit_SaleDetailsPreviewDTO[];

export interface Rabbit_UpdateDTO {
    nickName: string | null;
    race: string | null;
    color: string | null;
    dateOfBirth: string | null;
    dateOfDeath: string | null;
    gender: string | null;
    isForBreeding: boolean | null;
    fatherId_Placeholder: string | null;
    motherId_Placeholder: string | null;
}

export interface Rabbit_UpdateSaleDetailsDTO {
    price: number;
    canBeShipped: boolean;
    isLitterTrained: boolean;
    isNeutered: boolean;
    homeEnvironment: string;
    saleDescription: string;
}

export interface Rabbit_ChildPreviewDTO {
    earCombId: string;
    dateOfBirth: string | null;
    nickName: string | null;
    color: string | null;
    gender: string | null;
    otherParentId: string | null;
    profilePicture: string | null;
}

export interface LoginResponse {
    userName: string;
    accessToken: string;
    expiryDate: Date;
    refreshToken: string;
    errors: string[];
}

export interface User_ProfileDTO {
    breederRegNo: string | null,
    firstName: string,
    lastName: string,
    publicProfile: string | null,
    roadNameAndNo: string,
    profilePicture: string | null,
    city: string,
    zipCode: number,
    email: string,
    phone: string
}

//---------- TRANSFER REQUESTS SECTION
export interface TransferRequest_ContractDTO {
    id: number;
    status: string;
    dateAccepted: string
    //--- Issuer
    issuer_BreederRegNo: string;
    issuer_FullName: string;
    issuer_Email: string;
    issuer_RoadNameAndNo: string;
    issuer_ZipCode: number;
    issuer_City: string;
    //--- Recipent
    recipent_BreederRegNo: string;
    recipent_FullName: string;
    recipent_Email: string;
    recipent_RoadNameAndNo: string;
    recipent_ZipCode: number;
    recipent_City: string;
    //--- Rabbit
    rabbit_EarCombId: string;
    rabbit_NickName: string | null;
    price: number | null;
    saleConditions: string | null;
}

export interface TransferRequest_CreateDTO {
    rabbit_EarCombId: string;
    recipent_BreederRegNo: string;
    price: number | null;
    saleConditions: string | null;
}

export interface TransferRequest_PreviewDTO {
    id: number;
    status: string;
    dateAccepted: string;
    rabbit_EarCombId: string;
    issuer_BreedRegNo: string;
    recipent_BreederRegNo: string;
    price: number | null;
    saleConditions: string | null;
}
export type Transfer_RequestPreviewList = TransferRequest_PreviewDTO[];

export interface TransferRequest_ReceivedDTO {
    id: number;
    status: string;
    dateAccepted: string;
    rabbit_EarCombId: string;
    rabbit_NickName: string | null;
    issuer_BreederRegNo: string;
    issuer_FirstName: string;
    price: number | null;
    saleConditions: string | null;
}

export interface TransferRequest_ReceivedFilterDTO {
    status: string | null;
    rabbit_EarCombId: string | null;
    rabbit_NickName: string | null;
    issuer_BreederRegNo: string | null;
    issuer_FirstName: string | null;
    from_dateAccepted: string | null;
}

export interface TransferRequest_ResponseDTO {
    accept: boolean;
}

export interface TransferRequest_SentDTO {
    id: number;
    status: string;
    dateAccepted: string | null;
    rabbit_EarCombId: string;
    rabbit_NickName: string | null;
    recipent_BreederRegNo: string | null;
    recipent_FirstName: string | null;
    price: number | null;
    saleConditions: string | null;
}

export interface TransferRequest_SentFilterDTO {
    status: string | null;
    rabbit_EarCombId: string | null;
    rabbit_NickName: string | null;
    recipent_BreederRegNo: string | null;
    recipent_FirstName: string | null;
    from_dateAccepted: string | null;
}
