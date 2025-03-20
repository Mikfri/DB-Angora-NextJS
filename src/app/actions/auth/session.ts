// src/app/actions/auth/session.ts
'use server';

import { getCookieStore } from '@/lib/utils/cookieStore';

type SessionStatus = {
  isAuthenticated: boolean;
  userName?: string;
  userRole?: string;
  userProfileId?: string;
};

export async function getSessionStatus(): Promise<SessionStatus> {
  const cookieStore = getCookieStore();
  
  // Tilføj await før hver cookieStore metode
  const accessToken = await cookieStore.get('accessToken');
  const userName = await cookieStore.get('userName');
  const userRole = await cookieStore.get('userRole');
  const userProfileId = await cookieStore.get('userProfileId');
  
  if (!accessToken) {
    return { isAuthenticated: false };
  }
  
  return {
    isAuthenticated: true,
    userName: userName?.value,
    userRole: userRole?.value,
    userProfileId: userProfileId?.value
  };
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = getCookieStore();
  const accessToken = await cookieStore.get('accessToken');
  
  return accessToken?.value || null;
}