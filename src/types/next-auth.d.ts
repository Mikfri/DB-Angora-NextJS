// src/types/next-auth.d.ts
/**
 * Type augmentation for next-auth v5
 * Udvider Session, User og JWT med custom felter fra vores .NET API
 */
import { UserIdentity } from './authTypes';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken: string;
    // refreshToken fjernet — opbevares kun i encrypted JWT, eksponeres IKKE til klienten
    userIdentity: UserIdentity;
    error?: 'RefreshTokenError';
  }

  interface User {
    accessToken: string;
    refreshToken: string;  // ← beholdes — bruges kun i authorize() → jwt() callback
    expiresIn: number;
    userIdentity: UserIdentity;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    userIdentity: UserIdentity;
    error?: 'RefreshTokenError';
  }
}
