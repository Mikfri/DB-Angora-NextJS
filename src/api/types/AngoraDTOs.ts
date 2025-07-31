// src/api/types/DB-AngoraDTOs.ts

export interface IdentityResult {
    succeeded: boolean;
    errors: IdentityError[];
}
export interface IdentityError {
  code: string | null;
  description: string | null;
}

/**
 * Generisk DTO til paginerede resultater.
 * @template T Typen af data i resultatet
 */
export interface PagedResultDTO<T> {
    /** Array af data af typen T */
    data: T[];
    /** Totalt antal elementer på tværs af alle sider */
    totalCount: number;
    /** Nuværende side (1-baseret) */
    page: number;
    /** Antal elementer per side */
    pageSize: number;
    /** Totalt antal sider */
    totalPages: number;
    /** Om der findes en næste side */
    hasNextPage: boolean;
    /** Om der findes en tidligere side */
    hasPreviousPage: boolean;
}

export interface PhotoPrivateDTO {
    id: number;
    filePath: string;
    fileName: string;
    cloudinaryPublicId: string;
    uploadDate: string;
    entityType: string;
    entityId: string;
    isProfilePicture: boolean;
}

export interface PhotoPublicDTO {
    id: number;
    filePath: string;
    fileName: string;
    uploadDate: string;
    isProfilePicture: boolean;
}

export interface PhotoDeleteDTO {
    photoId: number;
    entityIntId: number;
    entityStringId: string;
}

export interface CloudinaryPhotoRegistryRequestDTO {
    publicId: string;
    cloudinaryUrl: string;
    fileName: string;
    entityStringId: string;
    entityIntId: number;
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
    entityStringId: string;
    entityIntId: number;
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
    fatherId_Placeholder?: string | null;
    motherId_Placeholder?: string | null;
}

/**
 * Indeholder de properties som brugeren skal udfylde for at oprette en kanin.
 */
export interface Rabbit_CreateSaleDetailsDTO {
    title: string;
    price: number;
    canBeShipped: boolean;
    isLitterTrained: boolean;
    isNeutered: boolean;
    homeEnvironment: string;
    description: string;
}

export interface Rabbit_ParentValidationResultDTO {
    isValid: boolean;
    earCombId: string;
    nickName: string;
    message: string;
    race: string;
    color: string;
}

/**
 * Indeholder default/standard oplysninger (SaleDetails.properties) for en entitet, der er til salg.
 * Indeholder null-able entityDTO'er, hvor kun een af dem vil være udfyldt.
 * (Rabbit_SaleDetailsDTO, Wool_SaleDetailsDTO etc...)
*/
export interface SaleDetailsProfileDTO {
    // --- SaleDetails
    id: number;
    //slug: string;
    title: string;
    price: number;
    dateListed: string;
    canBeShipped: boolean;
    viewCount: number;
    description: string;
    // --- SaleDetails.Entity.UserOwner
    sellerName: string;
    sellerContact: string;
    city: string;
    zipCode: number;
    // --- Routing
    entityType: string;  // "Rabbit" | "Wool" | ...
    entityId: string;  // RabbitId, WoolId, etc.. Kan godt være en int.ToString() værdi
    imageUrl: string | null;
    // --- [EntityType]SaleDetails
    /**
     * Dynamiske egenskaber, konvereteret til 'string'.
     * Boolean værdier er repræsenteret som "true"/"false".
     * Rabbit-specifikke egenskaber:
     *   - "Bakketrænet": "true"/"false"
     *   - "Neutraliseret": "true"/"false"
     *   - "Boligmiljø": String (enum værdi)
     * Wool-specifikke egenskaber:
     *   - ...
     */
    entityTypeSaleProperties: { [key: string]: string };

    /**
     * Dynamiske egenskaber, konvereteret til 'string'.
     * (fx Race, Farve, Køn - for kaniner)
     */
    entityProperties: { [key: string]: string };

    // --- DTO'er
    photos: PhotoPublicDTO[];
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

/**
 * Preview oplysningerne for ejede kaniner, som benyttes i lister.
 * Indeholder kun properties som er relevante for at kunne filtrerer på.
 */
export interface Rabbit_PreviewDTO {
    earCombId: string;
    nickName: string | null;
    originFullName: string | null;
    ownerFullName: string | null;
    race: string;
    color: string;
    approvedRaceColorCombination: boolean;
    dateOfBirth: string  // DateOnly i C#, string i TS
    dateOfDeath: string | null;  // DateOnly i C#, string i TS
    isJuvenile: boolean;
    gender: string;
    isForBreeding: boolean | null;
    hasSaleDetails: boolean;  // Bemærk: ikke nullable i C#
    fatherId_Placeholder: string | null;
    father_EarCombId: string | null;
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    inbreedingCoefficient: number; // 0.0 - 1.0
    profilePicture: string | null;  // Nullable i C#
}
export type Rabbits_PreviewList = Rabbit_PreviewDTO[];

/**
 * Profil oplysningerne for en kanin, inclusive dens tilhørende:
 * - Salgsoplysninger
 * - Billeder
 * - Evt unger, oversigt
 */
export interface Rabbit_ProfileDTO {
    earCombId: string;
    nickName: string | null;
    //ownerId: string;  // Vi har denne prop fra backenden.. Men den behøves ikke i frontend.
    ownerFullName: string | null;
    originFullName: string | null;
    race: string;
    color: string;
    approvedRaceColorCombination: boolean;
    dateOfBirth: string;  // API: string($date) format, nullable
    dateOfDeath: string | null;
    isJuvenile: boolean;
    gender: string;
    isForBreeding: boolean | null;
    fatherId_Placeholder: string | null;
    father_EarCombId: string | null;
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    inbreedingCoefficient: number;
    profilePicture: string | null;
    // --- DTO'er
    saleDetailsEmbedded: RabbitSaleDetailsEmbeddedDTO | null;
    photos: PhotoPrivateDTO[];
    children: Rabbit_ChildPreviewDTO[];
}

export interface RabbitSaleDetailsEmbeddedDTO {
    // --- SaleDetails
    id: number;
    slug: string;
    title: string;
    price: number;
    dateListed: string;
    canBeShipped: boolean;
    viewCount: number;
    description: string;
    // --- RabbitSaleDetails
    isLitterTrained: boolean;
    isNeutered: boolean;
    homeEnvironment: string;
}


export interface SaleDetails_FilterDTO {
    minPrice?: number;
    maxPrice?: number;
    canBeShipped?: boolean;
    page: number;
    pageSize: number;
}

/**
 * Indeholder standariserede salgs oplysninger.
 * Benyttes til salgs-cards.
 */
export interface SaleDetailsCardDTO {
    // --- SaleDetails
    id: number;
    slug: string;
    title: string;
    price: number;
    dateListed: string;
    canBeShipped: boolean;
    viewCount: number;
    // --- SaleDetails.Entity (Rabbit, Wool, etc.)
    imageUrl: string | null;
    // --- SaleDetails.Entity.UserOwner.
    city: string;
    zipCode: number;
    // --- Type-indikator og ID til routing
    entityType: string; // Type af entitet (Rabbit, Wool, etc.)
    entityId: string; // string eller parsed int til entitetens ID
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
    // --- SaleDetails
    title: string;
    price: number;
    canBeShipped: boolean;
    description: string;
    // --- RabbitSaleDetails
    isLitterTrained: boolean;
    isNeutered: boolean;
    homeEnvironment: string;
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

export interface LoginResponseDTO {
    userName: string;
    accessToken: string;
    expiryDate: Date;
    refreshToken: string;
    userIP: string;
    errors: string[];
}

/**
 * Indeholder oplysningerne på en registreret bruger.
 * Inkluderer også brugerens BreederAccount, hvis det er en opdrætter.
 */
export interface User_ProfileDTO {
    userId: string;
    firstName: string;
    lastName: string;
    roadNameAndNo: string;
    city: string;
    zipCode: number;
    email: string;
    phone: string;
    profilePicture?: string | null;
    // --- DTO'er
    breederAccount?: BreederAccount_PrivateProfileDTO
    photos?: PhotoPrivateDTO[];
}

/**
 * Indeholder de properties som en bruger kan redigere på sin profil.
 * Bemærk: Email er ikke inkluderet, da den ikke kan redigeres - for nu.
 */
export interface User_UpdateProfileDTO {
    firstName: string;
    lastName: string;
    roadNameAndNo: string;
    zipCode: number;
    city: string;
    phone: string;
    //email: string;
}

/**
 * Indeholder de private oplysninger for en opdrætter.
 * Disse oplysninger er kun tilgængelige for ejeren af kontoen og evt. administrator.
 */
export interface BreederAccount_PrivateProfileDTO {
    breederRegNo: string;
    memberNo?: string | null;
    breederBrandName: string;
    breederBrandDescription: string;
    breederBrandLogoUrl?: string | null;
    isFindable: boolean;
    rabbitsOwnedCount: number;
    rabbitsLinkedCount: number;
    woolsOwnedCount: number;
    // --- DTO'er
    photos?: PhotoPrivateDTO[];
}

/**
 * Inderholder de properties som en opdrætter er istand til at redigere.
 */
export interface BreederAccount_UpdateDTO {
    breederBrandName: string;
    breederBrandDescription: string;
    isFindable: boolean;
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
    //--- Sale
    price: number | null;
    saleConditions: string | null;
}

export interface TransferRequest_CreateDTO {
    rabbit_EarCombId: string;
    recipent_BreederRegNo: string;
    price: number | null;
    saleConditions: string | null;
}

export interface TransferRequestPreviewDTO {
    //--- Generelle properties
    id: number;
    status: string;
    dateAccepted: string;
    //--- Kanin properties
    rabbit_EarCombId: string;
    rabbit_NickName: string | null;
    //--- Udsteder properties
    issuer_BreederRegNo: string;
    issuer_FirstName: string;
    //--- Modtager properties
    recipent_BreederRegNo: string;
    recipent_FirstName: string | null;
    //--- Salgs properties
    price: number | null;
    saleConditions: string | null;
}
export type TransferRequestPreviewList = TransferRequestPreviewDTO[];


export interface TransferRequestPreviewFilterDTO {
    status?: string | null;  // "Pending", "Accepted", "Rejected"
    from_dateAccepted?: string | null;
    //--- Kanin properties
    rabbit_EarCombId?: string | null;
    rabbit_NickName?: string | null;
    //--- Udsteder properties
    issuer_BreederRegNo?: string;
    issuer_FirstName?: string | null;
    //--- Modtager properties
    recipent_BreederRegNo?: string | null;
    recipent_FirstName?: string | null;
}

export interface TransferRequest_ResponseDTO {
    accept: boolean;
}

