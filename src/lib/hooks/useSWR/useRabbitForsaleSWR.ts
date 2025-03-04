// src/lib/hooks/useSWR/useRabbitForsaleSWR.ts
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { ForSaleFilters } from '@/api/types/filterTypes';
import { Rabbits_SaleDetailsPreviewList } from '@/api/types/AngoraDTOs';
import { fetcher, buildQueryString } from './useRabbitCoreSWR';

/**
 * SWR hook til kaniner til salg med filter og URL synkronisering
 */
export function useRabbitsForSaleUI(
  initialData: Rabbits_SaleDetailsPreviewList,
  initialFilters: ForSaleFilters
) {
  const router = useRouter();
  const [filters, setFilters] = useState<ForSaleFilters>(initialFilters);
  
  // Brug buildQueryString fra core til API-kald
  const queryString = buildQueryString(filters);
  const apiUrl = `/api/rabbits/forsale${queryString}`;
  
  // SWR hook for data fetching
  const { data, error, isLoading, mutate } = useSWR<Rabbits_SaleDetailsPreviewList>(
    apiUrl,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      dedupingInterval: 30000
    }
  );
  
  // Opdatér URL'en når filtrene ændrer sig, men UDENFOR rendering
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    const newPath = `/sale/rabbits${queryString ? `?${queryString}` : ''}`;
    
    // Tjek om URL'en faktisk er anderledes for at undgå unødvendige navigationer
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== newPath) {
      router.replace(newPath);
    }
  }, [filters, router]);
  
  // Filter opdatering - opdaterer kun lokalt state, URL-opdatering sker via useEffect
  const updateFilters = useCallback((newFilters: Partial<ForSaleFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []); // Ingen afhængigheder, da vi kun opdaterer lokalt state
  
  // Reset filtre - nulstiller kun lokalt state, URL-opdatering sker via useEffect
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);
  
  return {
    rabbits: data || [],
    filters,
    updateFilters,
    resetFilters,
    isLoading,
    error,
    refresh: mutate
  };
}

// Eksportér under begge navne for kompatibilitet
export const useRabbitsForSale = useRabbitsForSaleUI;