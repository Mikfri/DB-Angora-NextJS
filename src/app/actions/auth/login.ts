// src/app/actions/auth/login.ts
/**
 * Login Server Action
 * 
 * Bruger next-auth's signIn() til at autentificere via Credentials provider.
 * Erstatter den tidligere manuelle cookie-baserede login.
 */
'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export type LoginResult =
  | { success: true }
  | { success: false; error: string };

export async function login(userName: string, password: string): Promise<LoginResult> {
  try {
    await signIn('credentials', {
      userName,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Ugyldigt brugernavn eller adgangskode' };
        default:
          return { success: false, error: 'Der opstod en fejl under login' };
      }
    }

    // next-auth kaster NEXT_REDIRECT som en error ved succesfuldt login
    // Denne skal re-throes
    throw error;
  }
}