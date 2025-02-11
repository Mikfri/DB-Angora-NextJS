// src/types/DB-AngoraDTOs.ts
interface RabbitPhoto {
    id: number;
    filePath: string;
    fileName: string;
    uploadDate: string;
    rabbitId: string;
    userId: string;
    isProfilePicture: boolean;
}

export interface Rabbit_ForsalePreviewDTO {
    earCombId: string;
    nickName: string;
    dateOfBirth: string;
    race: string;
    color: string;
    gender: string;
    zipCode: number;
    city: string;
    profilePicture: string;
    userOwner: string;
}
export type Rabbits_ForsalePreviewList = Rabbit_ForsalePreviewDTO[];

export interface Rabbit_ForsaleProfileDTO {
    earCombId: string;
    nickName: string;
    race: string;
    color: string;
    dateOfBirth: string;
    gender: string;
    forSale: string;
    forBreeding: string;
    profilePicture: string;
    photos: RabbitPhoto[];
    ownerFullName: string;
    ownerPhoneNumber: string;
    ownerEmail: string;
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
    forSale: string | null;
    forBreeding: string | null;
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
    forSale: string | null;
    forBreeding: string | null;
    fatherId_Placeholder: string | null;
    father_EarCombId: string | null;
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    profilePicture: string;
}
export type Rabbits_PreviewList = Rabbit_PreviewDTO[];


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
    forSale: string | null;
    forBreeding: string | null;
    fatherId_Placeholder: string | null;
    father_EarCombId: string | null;
    profilePicture: string | null;
    motherId_Placeholder: string | null;
    mother_EarCombId: string | null;
    children: Rabbit_ChildPreviewDTO[];
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
    forSale: string;
    forBreeding: string;
    father_EarCombId?: string | null;
    mother_EarCombId?: string | null;
}

export interface Rabbit_UpdateDTO {
    nickName: string | null;
    race: string | null;
    color: string | null;
    dateOfBirth: string | null;
    dateOfDeath: string | null;
    gender: string | null;
    forSale: string | null;
    forBreeding: string | null;
    fatherId_Placeholder: string | null;
    motherId_Placeholder: string | null;
}

export interface Rabbit_ChildPreviewDTO {
    earCombId: string;
    dateOfBirth: string | null;
    nickName: string | null;
    color: string | null;
    gender: string | null;
    otherParentId: string | null;
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
    city: string,
    zipCode: number,
    email: string,
    phone: string
}