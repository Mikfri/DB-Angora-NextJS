// src/app/actions/auth/session.ts
/**
 * Session Server Actions - Bro mellem next-auth og server components
 * 
 * Bruger next-auth's auth() helper til at hente session data.
 * Erstatter den tidligere cookie-baserede implementering.
 */
'use server';

import { auth } from '@/auth';
import { UserIdentity } from '@/types/authTypes';

export type SessionStatus = {
  isAuthenticated: boolean;
  userName?: string | null;
  userRole?: string | null;
  userIdentity?: UserIdentity | null;
  error?: string;
};

/**
 * Henter session status via next-auth
 * Til brug i server components og server actions
 */
export async function getSessionStatus(): Promise<SessionStatus> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { isAuthenticated: false };
    }

    // Tjek om token refresh fejlede
    if (session.error === 'RefreshTokenError') {
      return { 
        isAuthenticated: false,
        error: 'Session udløbet, log venligst ind igen'
      };
    }

    return {
      isAuthenticated: true,
      userName: session.user.name,
      userIdentity: session.userIdentity,
    };
  } catch (error) {
    console.error('Session check error:', error);
    return { isAuthenticated: false };
  }
}

/**
 * Henter access token fra next-auth session
 * @returns Access token eller null hvis ikke logget ind
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return null;
    }

    // Hvis refresh token fejlede, returner null
    if (session.error === 'RefreshTokenError') {
      return null;
    }

    return session.accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Henter brugerens userIdentity fra next-auth session
 * TIL BRUG I SERVER COMPONENTS
 * For client components, brug useSession() hook
 */
export async function getUserIdentity(): Promise<UserIdentity | null> {
  try {
    const session = await auth();

    if (!session?.userIdentity || session.error === 'RefreshTokenError') {
      return null;
    }

    return session.userIdentity;
  } catch (error) {
    console.error('Error getting user identity:', error);
    return null;
  }
}