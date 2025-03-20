// src/app/actions/auth/logout.ts
'use server';

import { getCookieStore } from '@/lib/utils/cookieStore';

export async function logout(): Promise<{ success: boolean }> {
  try {
    const cookieStore = getCookieStore();
    
    await cookieStore.delete('accessToken');
    await cookieStore.delete('userName');
    await cookieStore.delete('userRole');
    await cookieStore.delete('userProfileId');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
}