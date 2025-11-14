// src/components/Providers.tsx
'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { HeroUIProvider } from "@heroui/react"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from '@/store/authStore';
import { EnumProvider } from '@/contexts/EnumContext';

type NavContextType = {
  setPrimaryNav: (nav: ReactNode) => void;
  setSecondaryNav: (nav: ReactNode) => void;
  primaryNav: ReactNode | null;
  secondaryNav: ReactNode | null;
  authInitialized: boolean;
};

const NavContext = createContext<NavContextType>({
  setPrimaryNav: () => {},
  setSecondaryNav: () => {},
  primaryNav: null,
  secondaryNav: null,
  authInitialized: false
});

export default function Providers({ children }: { children: ReactNode }) {
  const [primaryNav, setPrimaryNav] = useState<ReactNode | null>(null);
  const [secondaryNav, setSecondaryNav] = useState<ReactNode | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize auth
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔐 Running global auth check in Providers');
      await useAuthStore.getState().checkAuth();
      setAuthInitialized(true);
    };
    initAuth();
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <HeroUIProvider>
        <EnumProvider>
          <NavContext.Provider value={{
            primaryNav,
            setPrimaryNav,
            secondaryNav,
            setSecondaryNav,
            authInitialized
          }}>
            {children}
          </NavContext.Provider>
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

export const useNav = () => useContext(NavContext);
export { useTheme } from 'next-themes'; // Brug next-themes' useTheme