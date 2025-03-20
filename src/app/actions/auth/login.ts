// src/app/actions/auth/login.ts
'use server';

import { Login } from "@/api/endpoints/authController";
import { getCookieStore } from '@/lib/utils/cookieStore';

export type LoginResult = 
  | { success: true; userName: string; userRole: string }
  | { success: false; error: string };

export async function login(userName: string, password: string): Promise<LoginResult> {
  try {
    const loginResponse = await Login(userName, password);

    if (!loginResponse?.accessToken) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Håndter JWT token parsing
    const Base64EncodedAccessTokenFragment = loginResponse.accessToken.split('.')[1];
    const DecodedBase64AccessTokenFragment = atob(Base64EncodedAccessTokenFragment);
    const AccessTokenFragmentAsJSON = JSON.parse(DecodedBase64AccessTokenFragment);
    
    const userProfileId = AccessTokenFragmentAsJSON["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    const userRole = AccessTokenFragmentAsJSON["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // Brug vores typesikre cookieStore helper
    const cookieStore = getCookieStore();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/'
    };

    // Tilføj await før hver cookieStore metode
    await cookieStore.set('accessToken', loginResponse.accessToken, cookieOptions);
    await cookieStore.set('userName', userName, cookieOptions);
    await cookieStore.set('userProfileId', userProfileId, cookieOptions);
    await cookieStore.set('userRole', userRole, cookieOptions);

    return { 
      success: true, 
      userName: userName,
      userRole: userRole
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'Fejl i brugernavn eller password..' 
    };
  }
}