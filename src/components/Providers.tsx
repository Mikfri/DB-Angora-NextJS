// src/components/Providers.tsx
'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { HeroUIProvider } from "@heroui/react"
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

  // Centralisér auth check ved app-initialisering
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔐 Running global auth check in Providers');
      await useAuthStore.getState().checkAuth();
      setAuthInitialized(true);
    };
    
    initAuth();
  }, []);

  return (
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
    </HeroUIProvider>
  );
}

export const useNav = () => useContext(NavContext);