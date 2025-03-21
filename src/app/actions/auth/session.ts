// src/app/actions/auth/session.ts

'use server';

import { getCookieStore } from '@/lib/utils/cookieStore';
import { isTokenExpired } from '@/lib/utils/tokenUtils';
import { cache } from 'react';

type SessionStatus = {
  isAuthenticated: boolean;
  userName?: string;
  userRole?: string;
  userProfileId?: string;
  tokenExpiry?: number;
};

// Tilføj cache() wrapper for at undgå gentagende kald indenfor samme request
export const getSessionStatus = cache(async (): Promise<SessionStatus> => {
  const cookieStore = getCookieStore();
  
  const accessToken = await cookieStore.get('accessToken');
  const tokenExpiry = await cookieStore.get('tokenExpiry');
  const userName = await cookieStore.get('userName');
  const userRole = await cookieStore.get('userRole');
  const userProfileId = await cookieStore.get('userProfileId');
  
  if (!accessToken || isTokenExpired(accessToken.value, tokenExpiry?.value)) {
    return { isAuthenticated: false };
  }
  
  return {
    isAuthenticated: true,
    userName: userName?.value,
    userRole: userRole?.value,
    userProfileId: userProfileId?.value,
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