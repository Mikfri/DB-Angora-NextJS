// src/components/auth/AuthGuard.tsx
'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useNav } from '@/components/providers/Providers';

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
  const { isLoggedIn, isLoading } = useAuthStore();
  const { authInitialized } = useNav();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Vi venter til authentication er færdig initialiseret og ikke loader
    if (authInitialized && !isLoading) {
      const isProtectedRoute = pathname.startsWith('/account') || pathname.startsWith('/admin');
      
      // Hvis brugeren ikke er logget ind men befinder sig på en beskyttet route,
      // omdirigerer vi dem til login-siden og gemmer den nuværende sti som returnUrl
      if (!isLoggedIn && isProtectedRoute) {
        console.log('🔒 Auth guard redirecting from protected route:', pathname);
        router.push(`/?returnUrl=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isLoggedIn, isLoading, authInitialized, pathname, router]);
  
  // Render children uanset hvad - vores useEffect håndterer redirects
  return <>{children}</>;
}