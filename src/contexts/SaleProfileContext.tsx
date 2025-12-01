// src/contexts/SaleProfileContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SaleDetailsProfileDTO } from '@/api/types/AngoraDTOs';
import { getSaleDetailsBySlug } from '@/app/actions/sale/saleActions';

interface SaleProfileContextType {
  profile: SaleDetailsProfileDTO | null;
  isLoading: boolean;
  error: string | null;
}

const SaleProfileContext = createContext<SaleProfileContextType | undefined>(undefined);
export function SaleProfileProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const slug = params?.slug as string;

  const [profile, setProfile] = useState<SaleDetailsProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await getSaleDetailsBySlug(slug);
        if (result.success && result.data) {
          setProfile(result.data);
        } else {
          setError('Kunne ikke hente salgsprofil');
        }
      } catch (err) {
        setError('Der opstod en fejl');
        console.error('Error fetching sale profile:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [slug]);

  return (
    <SaleProfileContext.Provider value={{ profile, isLoading, error }}>
      {children}
    </SaleProfileContext.Provider>
  );
}

export function useSaleProfile() {
  const context = useContext(SaleProfileContext);
  if (!context) {
    throw new Error('useSaleProfile must be used within SaleProfileProvider');
  }
  return context;
}