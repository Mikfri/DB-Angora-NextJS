// src/api/types/AuthDTOs.ts

/**
 * Login response DTO - OAuth 2.0 kompatibel
 * API'en sætter refreshToken som HttpOnly cookie (ikke i JSON body)
 */
export interface LoginResponseDTO {
    userName: string;
    accessToken: string;
    expiresIn: number;        // Sekunder til access token udløber (RFC 6749)
    //refreshToken: string;   // Transporteret via Set-Cookie header fra API (vises ikke i JSON body)
}

/**
 * Token refresh response DTO
 */
export interface TokenResponseDTO {
    accessToken: string;
    expiresIn: number;
    //refreshToken: string;   // Transporteret via Set-Cookie header fra API (vises ikke i JSON body)
}

/**
 * Repræsenterer en enkelt claim i en JWT token, som kan bruges til at bestemme brugerens rettigheder og identitet.
 */
export interface ClaimDTO {
    type: string;
    value: string;
}
export type ClaimsList = ClaimDTO[];


export interface IdentityResult {
    succeeded: boolean;
    errors: IdentityError[];
}

export interface IdentityError {
    code: string | null;
    description: string | null;
}