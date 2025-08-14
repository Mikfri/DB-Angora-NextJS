// src/app/actions/auth/logout.ts
'use server';

import { getCookieStore } from '@/utils/cookieStore';

export async function logout(): Promise<{ success: boolean }> {
  try {
    const cookieStore = getCookieStore();
    
    await cookieStore.delete('accessToken');
    await cookieStore.delete('tokenExpiry');
    await cookieStore.delete('userName');
    await cookieStore.delete('userRole');
    await cookieStore.delete('userProfileId');
    await cookieStore.delete('userIdentity');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
}