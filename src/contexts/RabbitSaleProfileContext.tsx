// src/contexts/RabbitSaleProfileContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SaleDetailsProfileDTO } from '@/api/types/AngoraDTOs';
import { getSaleDetailsBySlug } from '@/app/actions/sale/saleActions';

interface RabbitSaleProfileContextType {
  profile: SaleDetailsProfileDTO | null;
  isLoading: boolean;
  error: string | null;
}

const RabbitSaleProfileContext = createContext<RabbitSaleProfileContextType | undefined>(undefined);

export function RabbitSaleProfileProvider({ children }: { children: ReactNode }) {
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
    <RabbitSaleProfileContext.Provider value={{ profile, isLoading, error }}>
      {children}
    </RabbitSaleProfileContext.Provider>
  );
}

export function useRabbitSaleProfile() {
  const context = useContext(RabbitSaleProfileContext);
  if (!context) {
    throw new Error('useRabbitSaleProfile must be used within RabbitSaleProfileProvider');
  }
  return context;
}