// src/components/Providers.tsx
'use client'
import { createContext, useContext, ReactNode, useState } from 'react'
import { HeroUIProvider } from "@heroui/react"

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

  return (
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
  );
}

export const useNav = () => useContext(NavContext);