// src/lib/utils/tokenUtils.ts
/**
 * Token utility funktioner for konsistent håndtering af JWT tokens
 */

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
 * Udtrækker specifik claim fra JWT token
 */
export function getTokenClaim<T = unknown>(token: string, claim: string): T | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload[claim] as T;
  } catch (error) {
    console.error(`Error extracting claim ${claim} from token:`, error);
    return null;
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