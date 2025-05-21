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

/**
 * Indeholder de properties som brugeren skal udfylde for at oprette en kanin.
 */
export interface Rabbit_CreateSaleDetailsDTO {
    rabbitId: string;
    price: number;
    canBeShipped: boolean;
    isLitterTrained: boolean;
    isNeutered: boolean;
    homeEnvironment: string;
    saleDescription: string;
}

/**
 * Indeholder default/standard oplysninger (SaleDetails.properties) for en entitet, der er til salg.
 * Indeholder null-able entityDTO'er, hvor kun een af dem vil være udfyldt.
 * (Rabbit_SaleDetailsDTO, Wool_SaleDetailsDTO etc...)
*/
export interface SaleDetailsProfileDTO {
    id: number;
    dateListed: string;
    city: string;
    zipCode: number;
    viewCount: number;
    imageUrl: string | null;
    price: number;
    title: string;
    saleDescription: string;
    rabbitSaleDetails: Rabbit_SaleDetailsDTO | null;
    woolSaleDetails: Wool_SaleDetailsDTO | null;
}

/**
 * Indeholder ALLE oplysninger en køber har brug for at at se for en salgs-kanin.
 * Rabbit_ForsaleProfileDTO er rabbit.properties, hvor de andre DTO'er som er inkluderet er med standard- og entity specifikke oplysninger.
 * Dvs saleDetails.property og rabbitSaleDetails.property.
 * Benyttes på kaninens salgs-profilside og indeholder 'SaleDetailsProfileDTO' og 'Rabbit_SaleDetailsDTO'.
 */
export interface Rabbit_ForsaleProfileDTO {
    nickName: string;
    race: string;
    color: string;
    dateOfBirth: string;
    gender: string;
    isForBreeding: boolean;
    ownerFullName: string;
    ownerPhoneNumber: string;
    ownerEmail: string;
    photos: Photo_DTO[];
    saleDetailsProfile: SaleDetailsProfileDTO;
}

export interface Rabbit_PedigreeDTO {
    Generation: number;
    Relation: string;
    EarCombId: string;
    NickName: string | null;
    DateOfBirth: string;
    Race: string;
    Color: string;
    UserOriginName: string | null;
    UserOwnerName: string | null;
    ProfilePicture: string | null;
    InbreedingCoefficient: number;
    InbreedingDetails: Rabbit_InbreedingDetailDTO[];
    Father: Rabbit_PedigreeDTO | null;
    Mother: Rabbit_PedigreeDTO | null;
}

export interface Rabbit_InbreedingDetailDTO {
    AncestorId: string;
    FatherDepth: number;
    MotherDepth: number;
    AncestorInbreeding: number;
    Contribution: number;
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
    inbreedingCoefficient: number;
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
    inbreedingCoefficient: number;
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
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    profilePicture: string | null;
    saleDetailsProfile: SaleDetailsProfileDTO | null;
    photos: Photo_DTO[];
    inbreedingCoefficient: number;
    children: Rabbit_ChildPreviewDTO[];
}

/**
 * Specifikke salgsoplysninger for en kanin (RabbitSaleDetails.properties).
 * Følger med SaleDetailProfilesDTO'en.
 */
export interface Rabbit_SaleDetailsDTO {
    rabbitId: string;
    isLitterTrained: boolean;
    isNeutered: boolean;
    homeEnvironment: string;
}

export interface Wool_SaleDetailsDTO {
    woolId: string;
    weightGram: number;
    qualityGrade: string;
}

/**
 * Indeholder standariserede salgs oplysninger.
 * Benyttes til salgs-cards.
 */
export interface SaleDetailsCardDTO {
    id: number;
    price: number;
    dateListed: string;
    title: string;
    city: string;
    zipCode: number;
    //nickName: string;
    //dateOfBirth: string;
    imageUrl: string;
    entityType: string;
    entityId: string;
}
export type SaleDetailsCardList = SaleDetailsCardDTO[];

/**
 * Indeholder de properties som man må redigere på en kanin.
 */
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
