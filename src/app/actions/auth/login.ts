// src/app/actions/auth/login.ts
'use server';

import { Login } from "@/api/endpoints/authController";
import { getCookieStore } from '@/utils/cookieStore';
import { getTokenExpiry, extractUserIdentity } from '@/utils/tokenUtils';
import { UserIdentity, formatRoles } from '@/types/authTypes';

export type LoginResult =
  | { success: true; userName: string; userRole: string; userIdentity: UserIdentity; tokenExpiry: number }
  | { success: false; error: string };

export async function login(userName: string, password: string): Promise<LoginResult> {
  try {
    const loginResponse = await Login(userName, password);

    if (!loginResponse?.accessToken) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Udtræk brugeridentitet fra token
    const extractedIdentity = extractUserIdentity(loginResponse.accessToken);

    if (!extractedIdentity) {
      return { success: false, error: 'Missing required claims in token' };
    }

    // Sikr at vi bruger loginResponse.userName, som bør indeholde emailen
    extractedIdentity.username = loginResponse.userName || extractedIdentity.username;

    // Formatter roller til visning
    const displayRole = formatRoles(extractedIdentity.roles);

    // Hent token udløbstidspunkt
    const tokenExpiry = getTokenExpiry(loginResponse.accessToken);

    if (!tokenExpiry) {
      return { success: false, error: 'Invalid token expiry' };
    }

    // Gem cookie data
    const cookieStore = getCookieStore();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/'
    };

    await cookieStore.set('accessToken', loginResponse.accessToken, cookieOptions);
    await cookieStore.set('tokenExpiry', tokenExpiry.toString(), cookieOptions);
    await cookieStore.set('userName', extractedIdentity.username, cookieOptions);
    await cookieStore.set('userProfileId', extractedIdentity.id, cookieOptions);
    await cookieStore.set('userRole', displayRole, cookieOptions);
    await cookieStore.set('userIdentity', JSON.stringify(extractedIdentity), cookieOptions);

    return {
      success: true,
      userName: extractedIdentity.username,
      userRole: displayRole,
      userIdentity: extractedIdentity,
      tokenExpiry
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Fejl i brugernavn eller password..'
    };
  }
}