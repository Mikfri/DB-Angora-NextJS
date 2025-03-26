// src/app/actions/auth/session.ts
'use server';

import { getCookieStore } from '@/lib/utils/cookieStore';
import { isTokenExpired, extractUserIdentity } from '@/lib/utils/tokenUtils';
import { UserIdentity, formatRoles } from '@/types/auth';
import { cache } from 'react';

export type SessionStatus = {
  isAuthenticated: boolean;
  userName?: string;
  userRole?: string;
  userIdentity?: UserIdentity;
  tokenExpiry?: number;
};

export const getSessionStatus = cache(async (): Promise<SessionStatus> => {
  const cookieStore = getCookieStore();
  
  const accessToken = await cookieStore.get('accessToken');
  const tokenExpiry = await cookieStore.get('tokenExpiry');
  const userIdentityCookie = await cookieStore.get('userIdentity');
  
  if (!accessToken || isTokenExpired(accessToken.value, tokenExpiry?.value)) {
    return { isAuthenticated: false };
  }
  
  // Hent brugeridentitet fra cookie eller udtræk fra token hvis nødvendigt
  let userIdentity: UserIdentity | undefined;
  
  try {
    if (userIdentityCookie?.value) {
      userIdentity = JSON.parse(userIdentityCookie.value);
    } else if (accessToken.value) {
      // Fallback: Udtræk fra token
      userIdentity = extractUserIdentity(accessToken.value) || undefined;
    }
  } catch (e) {
    console.error('Failed to parse userIdentity cookie:', e);
  }
  
  // Hvis vi ikke kan få brugeridentitet, men har et gyldigt token,
  // returnér stadig som authenticated med begrænsede detaljer
  if (!userIdentity) {
    return { 
      isAuthenticated: true,
      tokenExpiry: tokenExpiry ? parseInt(tokenExpiry.value, 10) : undefined
    };
  }
  
  // Formater roller til visning
  const displayRole = formatRoles(userIdentity.roles);
  
  return {
    isAuthenticated: true,
    userName: userIdentity.username,
    userRole: displayRole,
    userIdentity,
    tokenExpiry: tokenExpiry ? parseInt(tokenExpiry.value, 10) : undefined
  };
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