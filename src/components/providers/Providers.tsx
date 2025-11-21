// src/components/providers/Providers.tsx
'use client'
import { ReactNode, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { HeroUIProvider } from "@heroui/react"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from '@/store/authStore';
import { EnumProvider } from '@/contexts/EnumContext';

/**
 * Providers - Global app providers
 * 
 * Ansvar:
 * - Theme provider (dark/light mode)
 * - HeroUI provider (component library)
 * - Enum context (dropdown data)
 * - Auth initialization (checkAuth ved app start)
 * - Toast notifications
 * 
 * NOTE: NavContext er fjernet - alt sidenav håndteres nu i layoutWrapper.tsx
 */
export default function Providers({ children }: { children: ReactNode }) {
  // Initialize auth (authInitialized nu i authStore)
  useEffect(() => {
    console.log('🔐 Running global auth check in Providers');
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <HeroUIProvider>
        <EnumProvider>
          {children}
        </EnumProvider>

        <ThemeToastContainer />
      </HeroUIProvider>
    </NextThemesProvider>
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