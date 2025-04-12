// src/lib/utils/tokenUtils.ts
/**
 * Token utility funktioner for konsistent håndtering af JWT tokens
 */

import { UserIdentity, UserRole } from "@/types/auth";

/**
 * Tjekker om et token er udløbet baseret på enten expiry cookie eller JWT payload
 */
export function isTokenExpired(token: string | null, expiryTime?: string | null): boolean {
  if (!token) return true;
  
  // Først tjek tokenExpiry hvis den findes
  if (expiryTime) {
    const expiry = parseInt(expiryTime, 10);
    if (!isNaN(expiry) && Date.now() > expiry) {
      return true;
    }
  }
  
  // Backup check: Decode JWT og tjek exp claim
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const jwtExpiry = payload.exp * 1000; // Convert to milliseconds
    
    return Date.now() > jwtExpiry;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return true; // Ved fejl - antag at token er ugyldigt
  }
}

/**
 * Udtrækker udløbstidspunkt fra JWT token
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error extracting token expiry:', error);
    return null;
  }
}

/**
 * Udtrækker specifik claim fra JWT token med support for arrays
 */
export function getTokenClaim<T = unknown>(token: string, claim: string): T | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Returner claim værdien
    return payload[claim] as T;
  } catch (error) {
    console.error(`Error extracting claim ${claim} from token:`, error);
    return null;
  }
}

/**
 * Udtrækker brugeridentitet fra JWT token og returnerer UserIdentity objekt
 * Returnerer null hvis token er ugyldigt eller mangler nødvendige claims
 */
export function extractUserIdentity(token: string): UserIdentity | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const userIdClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    const nameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
    
    // Hent bruger-ID
    const userId = payload[userIdClaim];
    
    // Hent brugernavn/email - prøv flere mulige claims
    const username = payload[nameClaim] || 
                    payload.unique_name || 
                    payload.email || 
                    payload.sub || 
                    '';
    
    // Hent roller og konverter til array hvis nødvendigt
    let roles: UserRole[] = [];
    
    if (payload[roleClaim]) {
      roles = typeof payload[roleClaim] === 'string'
        ? [payload[roleClaim] as UserRole]
        : payload[roleClaim] as UserRole[];
    }
    
    if (!userId || roles.length === 0) {
      return null;
    }
    
    // Tilføj claims til userIdentity
    const rabbitImageCount = getTokenClaim<string>(token, 'Rabbit:ImageCount');
    
    return {
      id: userId,
      username,
      roles,
      claims: {
        rabbitImageCount: rabbitImageCount ? parseInt(rabbitImageCount, 10) : 0
        // Andre relevante claims kan tilføjes her
      }
    };
  } catch (error) {
    console.error('Error extracting user identity from token:', error);
    return null;
  }
}

/**
 * Udtrækker rolle-claims fra JWT token og returnerer dem som et array
 * Håndterer både string og array formater
 */
export function getUserRoles(token: string): string[] {
  try {
    const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Håndter både enkelt rolle (string) og multiple roller (array)
    if (!payload[roleClaim]) return [];
    
    // Hvis det er en string, konverter til array
    if (typeof payload[roleClaim] === 'string') {
      return [payload[roleClaim]];
    }
    
    // Ellers antager vi det er et array
    return payload[roleClaim] as string[];
  } catch (error) {
    console.error('Error extracting user roles from token:', error);
    return [];
  }
}

/**
 * Parser et JWT token og returnerer payload som et objekt
 */
export function parseToken(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

/**
 * Beregner hvor lang tid der er tilbage før token udløber (i millisekunder)
 */
export function getTokenTimeRemaining(token: string | null): number | null {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    const timeLeft = expiry - Date.now();
    
    return timeLeft > 0 ? timeLeft : 0;
  } catch {
    return null;
  }
}