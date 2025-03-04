'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { HeroUIProvider } from "@heroui/react"
import { SWRProvider } from '@/lib/config/swrConfig';
import { useAuthStore } from '@/store/authStore';

// Updated Nav Context Definition
type NavContextType = {
  setPrimaryNav: (nav: ReactNode) => void;
  setSecondaryNav: (nav: ReactNode) => void;
  primaryNav: ReactNode | null;
  secondaryNav: ReactNode | null;
};

const NavContext = createContext<NavContextType>({
  setPrimaryNav: () => {},
  setSecondaryNav: () => {},
  primaryNav: null,
  secondaryNav: null
});

export default function Providers({ children }: { children: ReactNode }) {
  const [primaryNav, setPrimaryNav] = useState<ReactNode | null>(null);
  const [secondaryNav, setSecondaryNav] = useState<ReactNode | null>(null);

  // Global auth check ved app-initialisering
  useEffect(() => {
    console.log('🔐 Running global auth check');
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    <SWRProvider>
      <HeroUIProvider>
        <NavContext.Provider value={{ 
          primaryNav, 
          setPrimaryNav, 
          secondaryNav, 
          setSecondaryNav 
        }}>
          {children}
        </NavContext.Provider>
      </HeroUIProvider>
    </SWRProvider>
  );
}

export const useNav = () => useContext(NavContext);