// src/components/auth/AuthGuard.tsx
/**
 * AuthGuard - Client-side beskyttelse af routes
 * 
 * Bruger next-auth's useSession() som primær kilde til auth state.
 * Fungerer som backup for server-side middleware (auth.ts authorized callback).
 * 
 * Reagerer på:
 * 1. Ændringer i session state (fx ved logout)
 * 2. RefreshTokenError (session udløbet)
 */
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Vent til session er loaded
    if (status === 'loading') return;

    const isProtectedRoute = pathname.startsWith('/account') || pathname.startsWith('/admin');
    
    if (isProtectedRoute && status === 'unauthenticated') {
      console.log('🔒 Auth guard redirecting from protected route:', pathname);
      router.push(`/?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Håndter refresh token error
    if (isProtectedRoute && session?.error === 'RefreshTokenError') {
      console.log('🔒 Session expired, redirecting:', pathname);
      router.push(`/?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [session, status, pathname, router]);
  
  return <>{children}</>;
}
