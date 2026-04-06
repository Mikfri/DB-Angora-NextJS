// src/api/types/UserDTOs.ts

import { PhotoPrivateDTO } from './PhotoDTOs';
import { BreederAccount_PrivateProfileDTO, BreederAccountSummaryDTO } from './BreederAccountDTOs';
import { ClaimDTO } from './AuthDTOs';

/**
 * DTO for at ændre en brugers password. 
 * Indeholder både det nuværende og det nye password, da det er nødvendigt for at kunne validere ændringen.
 */
export interface User_ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}

/**
 * DTO til basis account (Email og Phone fra IdentityUser) 
 */
export interface User_CreateBasicUserDTO {
    email: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
    roadNameAndNo: string;
    city: string;
    zipCode: number;
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
    // --- Profilbillede
    profilePhotoId: string | null;
    profilePhotoUrl?: string | null;
    // --- DTO'er
    breederAccount?: BreederAccount_PrivateProfileDTO;
    //photos?: PhotoPrivateDTO[]; // !User har ikke længere flere fotos - kun ét profilfoto!
}

/**
 * Sendes til API endpointet 'reset-password'. Efter man via en mail er direktetet frontenden,
 * hvorfra man indtaster propertiesne i denne DTO for at kunne nulstille sit password.
 */
export interface User_ResetPasswordDTO {
    userId: string;
    resetToken: string;
    newPassword: string;
}

export interface User_UpdateProfileDTO {
    firstName: string;
    lastName: string;
}

/**
 * Indeholder de properties som en bruger kan redigere på sin profil.
 * Bemærk: Email er ikke inkluderet, da den ikke kan redigeres - for nu.
 */
export interface User_UpdateProfileDTO {
    phone: string;
    firstName: string;
    lastName: string;
    roadNameAndNo: string;
    city: string;
    zipCode: number;
}


/**
 * Benyttes til "GetMe" endpointet som typisk anvendes ved:
 *  
 * 1) App startup / page refresh
 * 2) Navbar/header personalisering: Profilbillede, navn og "Avler"-badge vises fra GetMe()-responsen
 * 3) Permission-drevet UI: Claims og roller afgør hvad frontenden viser/skjuler. ( if (claims.includes("Rabbit:Create")) showCreateRabbitButton() )
 * 4) Redirect-logik efter login: Har brugeren en BreederAccount? → send til avler-dashboard, ellers til basis-dashboard
 * 
 * Da vi benytter stateless JWT setup er meget af denne information også indeholdt i selve JWT tokenen, og kan derfor også udtrækkes derfra.
 */
export interface UserCurrentDTO {
    userId: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;

    firstName: string;
    lastName: string;
    profilePhotoUrl: string | null;

    claims: ClaimDTO[];
    roles: string[];
    breederAccount?: BreederAccountSummaryDTO | null; 
}

/**
 * DTO til at vise information om en bruger, typisk til admin/moderator visning.
 */
export interface UserInfoWithMinRelatedAccountsDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roadNameAndNo: string;
    zipCode: number;
    city: string;
    breederRegNo: string | null; // Hvis brugeren har en tilknyttet BreederAccount, ellers null
}
