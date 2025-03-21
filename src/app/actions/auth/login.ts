// src/app/actions/auth/login.ts
'use server';

import { Login } from "@/api/endpoints/authController";
import { getCookieStore } from '@/lib/utils/cookieStore';
import { getTokenExpiry, getTokenClaim } from '@/lib/utils/tokenUtils';

export type LoginResult = 
  | { success: true; userName: string; userRole: string; tokenExpiry: number }
  | { success: false; error: string };

  export async function login(userName: string, password: string): Promise<LoginResult> {
    try {
      const loginResponse = await Login(userName, password);
  
      if (!loginResponse?.accessToken) {
        return { success: false, error: 'Invalid credentials' };
      }
  
      // Brug getTokenClaim med eksplicit type annotation
      const userProfileId = getTokenClaim<string>(
        loginResponse.accessToken, 
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      );
      
      const userRole = getTokenClaim<string>(
        loginResponse.accessToken, 
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      );
      
      if (!userProfileId || !userRole) {
        return { success: false, error: 'Missing required claims in token' };
      }
      
      // Brug getTokenExpiry utility
      const tokenExpiry = getTokenExpiry(loginResponse.accessToken);
      
      if (!tokenExpiry) {
        return { success: false, error: 'Invalid token expiry' };
      }
    
    // Brug vores typesikre cookieStore helper
    const cookieStore = getCookieStore();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/'
    };

    // Tilføj token-udløbs cookie for at hjælpe client-side
    await cookieStore.set('accessToken', loginResponse.accessToken, cookieOptions);
    await cookieStore.set('tokenExpiry', tokenExpiry.toString(), cookieOptions);
    await cookieStore.set('userName', userName, cookieOptions);
    await cookieStore.set('userProfileId', userProfileId, cookieOptions);
    await cookieStore.set('userRole', userRole, cookieOptions);

    return { 
      success: true, 
      userName: userName,
      userRole: userRole,
      tokenExpiry: tokenExpiry
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'Fejl i brugernavn eller password..' 
    };
  }
}