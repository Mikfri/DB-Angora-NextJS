// src/components/auth/AuthGuard.tsx
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

/**
 * AuthGuard - Client-side beskyttelse af routes
 * 
 * Ansvarsområder:
 * 1. Reagerer på ændringer i authentication state (fx ved logout)
 * 2. Omdirigerer fra beskyttede routes når en bruger ikke længere er autentificeret
 * 3. Fungerer som backup for server-side middleware
 * 4. Håndterer lokale auth-tilstandsændringer som middleware ikke kan se
 * 
 * Forskel fra middleware:
 * - Client-side (kører i browseren) vs. middleware (kører på serveren)
 * - Kan reagere på runtime ændringer vs. middleware (kun ved route skift)
 * - Bedre brugeroplevelse, da den kan omdirigere øjeblikkeligt ved logout
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, authInitialized } = useAuthStore(); // ← Hent direkte fra authStore
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Vent til authentication er færdig initialiseret og ikke loader
    if (authInitialized && !isLoading) {
      const isProtectedRoute = pathname.startsWith('/account') || pathname.startsWith('/admin');
      
      if (!isLoggedIn && isProtectedRoute) {
        console.log('🔒 Auth guard redirecting from protected route:', pathname);
        router.push(`/?returnUrl=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isLoggedIn, isLoading, authInitialized, pathname, router]);
  
  return <>{children}</>;
}