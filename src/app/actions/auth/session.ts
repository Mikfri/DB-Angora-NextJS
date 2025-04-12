// src/app/actions/auth/session.ts
'use server';

import { getCookieStore } from '@/lib/utils/cookieStore';
import { isTokenExpired, extractUserIdentity } from '@/lib/utils/tokenUtils';
import { UserIdentity, formatRoles } from '@/types/auth';
import { cache } from 'react';

export type SessionStatus = {
  isAuthenticated: boolean;
  userName?: string | null;
  userRole?: string | null;
  userIdentity?: UserIdentity | null;
  tokenExpiry?: number | null;
};

export const getSessionStatus = cache(async (): Promise<SessionStatus> => {
  try {
    const cookieStore = getCookieStore();
    
    const accessToken = await cookieStore.get('accessToken');
    const tokenExpiry = await cookieStore.get('tokenExpiry');
    const userIdentityCookie = await cookieStore.get('userIdentity');
    
    if (!accessToken || isTokenExpired(accessToken.value, tokenExpiry?.value)) {
      return { isAuthenticated: false };
    }
    
    // Hent brugeridentitet fra cookie eller udtræk fra token hvis nødvendigt
    let userIdentity: UserIdentity | null = null;
    
    try {
      if (userIdentityCookie?.value) {
        userIdentity = JSON.parse(userIdentityCookie.value);
      } else if (accessToken.value) {
        // Fallback: Udtræk fra token
        userIdentity = extractUserIdentity(accessToken.value);
        
        // Hvis vi har udtrukket userIdentity, gem det i cookie for fremtidige kald
        if (userIdentity) {
          await cookieStore.set('userIdentity', JSON.stringify(userIdentity), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/'
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse userIdentity cookie:', e);
    }
    
    // Hvis vi ikke kan få brugeridentitet, men har et gyldigt token,
    // returnér stadig som authenticated med begrænsede detaljer
    if (!userIdentity) {
      return { 
        isAuthenticated: true,
        tokenExpiry: tokenExpiry ? parseInt(tokenExpiry.value, 10) : null
      };
    }
    
    // Formater roller til visning
    const displayRole = formatRoles(userIdentity.roles);
    
    return {
      isAuthenticated: true,
      userName: userIdentity.username,
      userRole: displayRole,
      userIdentity,
      tokenExpiry: tokenExpiry ? parseInt(tokenExpiry.value, 10) : null
    };
  } catch (error) {
    console.error('Session check error:', error);
    return {
      isAuthenticated: false
    };
  }
});

/**
 * Henter access token fra cookie store (lib/utils/cookieStore.ts)
 * @returns Access token || null hvis ikke logget ind eller token udløbet
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = getCookieStore();
  const accessToken = await cookieStore.get('accessToken');
  const tokenExpiry = await cookieStore.get('tokenExpiry');
  
  if (!accessToken || isTokenExpired(accessToken.value, tokenExpiry?.value)) {
    return null;
  }
  
  return accessToken.value;
}

/**
 * Henter brugerens userIdentity fra cookies - TIL BRUG I SERVER COMPONENTS
 * For client components, brug useAuthStore() for bedre caching.
 * @returns UserIdentity eller null hvis ikke logget ind
 */
export async function getUserIdentity(): Promise<UserIdentity | null> {
  try {
    const cookieStore = getCookieStore();
    const userIdentityCookie = await cookieStore.get('userIdentity');
    const accessToken = await cookieStore.get('accessToken');
    const tokenExpiry = await cookieStore.get('tokenExpiry');
    
    // Kontroller først om vi har en gyldig session
    if (!accessToken || isTokenExpired(accessToken.value, tokenExpiry?.value)) {
      return null;
    }
    
    // Forsøg at hente userIdentity fra cookies
    if (userIdentityCookie?.value) {
      return JSON.parse(userIdentityCookie.value);
    }
    
    // Fallback: Udtræk fra token
    if (accessToken?.value) {
      return extractUserIdentity(accessToken.value);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user identity:', error);
    return null;
  }
}