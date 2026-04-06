// src/app/actions/auth/logout.ts
/**
 * Logout Server Action
 * 
 * 1. Kalder .NET API's /Auth/Logout for at slette refresh token server-side
 * 2. Kalder next-auth's signOut() for at slette session cookie
 */
'use server';

import { signOut, auth } from '@/auth';
import { Logout as ApiLogout } from '@/api/endpoints/authController';

export async function logout(): Promise<{ success: boolean }> {
  try {
    // Hent current session for at få access token til API logout
    const session = await auth();
    
    if (session?.accessToken) {
      // Kald .NET API for at slette refresh token server-side
      await ApiLogout(session.accessToken);
    }

    // Slet next-auth session
    await signOut({ redirect: false });

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    // Selv ved fejl, forsøg at slette session
    try {
      await signOut({ redirect: false });
    } catch {
      // Ignorer
    }
    return { success: true }; // Returner success da session er slettet
  }
}