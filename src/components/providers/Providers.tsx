// src/components/providers/Providers.tsx
/**
 * Root Providers - Wrapper til alle app-wide providers
 * 
 * Inkluderer:
 * - NextAuth SessionProvider (session management)
 * - Theme Provider (next-themes)
 * - HeroUI Provider (komponent bibliotek)
 * - EnumProvider (enum context)
 * - AuthSync (synkroniserer next-auth session til Zustand store)
 * - Toast Container
 */
'use client'
import { ReactNode, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { HeroUIProvider } from "@heroui/react"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider, useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import { EnumProvider } from '@/contexts/EnumContext';

/**
 * AuthSync - Synkroniserer next-auth session til Zustand authStore
 * Gør at eksisterende components der bruger useAuthStore() stadig virker
 */
function AuthSync({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const syncFromSession = useAuthStore((s) => s.syncFromSession);

  useEffect(() => {
    if (status === 'loading') return;

    syncFromSession({
      isAuthenticated: status === 'authenticated' && !!session?.user,
      userName: session?.user?.name ?? undefined,
      userIdentity: session?.userIdentity ?? null,
    });
  }, [session, status, syncFromSession]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <HeroUIProvider>
          <EnumProvider>
            <AuthSync>
              {children}
            </AuthSync>
          </EnumProvider>
          <ThemeToastContainer />
        </HeroUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}

// Separat komponent til ToastContainer som læser theme
function ThemeToastContainer() {
  const { theme } = useTheme();
  return (
    <ToastContainer 
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme as 'light' | 'dark'}
    />
  );
}

// Eksporter kun relevante hooks (NavContext fjernet)
export { useTheme } from 'next-themes';