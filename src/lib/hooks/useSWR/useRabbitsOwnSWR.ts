// src/lib/hooks/useSWR/useRabbitsOwnSWR.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { OwnFilters } from '@/api/types/filterTypes'; 
import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';
import { useRabbitStore } from '@/store/rabbitStore';
import { protectedFetcher } from './useRabbitCoreSWR';

/**
 * SWR hook til brugerens egne kaniner med client-side filtrering og URL synkronisering
 */
export function useMyRabbitsUI(
  initialData: Rabbit_PreviewDTO[],
  initialFilters: OwnFilters = {}
) {
  const router = useRouter();
  const [filters, setFilters] = useState<OwnFilters>(initialFilters);
  const { setMyRabbits } = useRabbitStore();
  
  // SWR hook for at hente alle kaniner (uden filtrering)
  const { data: allRabbits, error, isLoading, mutate } = useSWR<Rabbit_PreviewDTO[]>(
    '/api/account/myRabbits',
    async (url) => {
      const result = await protectedFetcher(url);
      setMyRabbits(result); // Gem i global state
      return result;
    },
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      dedupingInterval: 30000
    }
  );
  
  // Client-side filtrering baseret på filters state
const filteredRabbits = useMemo(() => {
    if (!allRabbits?.length) return [];
    
    return allRabbits.filter(rabbit => {
      let match = true;
      
      // Gender filter
      if (filters.Gender && rabbit.gender !== filters.Gender) match = false;
      
      // Race filter  
      if (filters.Race && rabbit.race !== filters.Race) match = false;
      
      // Color filter
      if (filters.Color && rabbit.color !== filters.Color) match = false;
      
      // ForSale filter - Check hasSaleDetails fremfor forSale
      if (filters.ForSale && !rabbit.hasSaleDetails) match = false;
      
      // ForBreeding filter
      if (filters.ForBreeding && rabbit.forBreeding !== 'Yes') match = false;
      
      // showDeceased filter - skjul døde kaniner medmindre vist specifikt
      if (!filters.showDeceased && rabbit.dateOfDeath) match = false;
      
      // Race Color Approval filter - KORREKT VERSION
      if (filters.raceColorApproval === 'Approved' && rabbit.approvedRaceColorCombination !== true) match = false;
      if (filters.raceColorApproval === 'Rejected' && rabbit.approvedRaceColorCombination !== false) match = false;
      // Ingen 'Pending' case - vi har kun to statusser: godkendt eller ikke godkendt
      
      // Born After filter
      if (filters.bornAfterDate && rabbit.dateOfBirth) {
        const bornAfter = new Date(filters.bornAfterDate);
        const birthDate = new Date(rabbit.dateOfBirth);
        if (birthDate < bornAfter) match = false;
      }
      
      // Search filter (case-insensitive)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchMatch = 
          (rabbit.nickName?.toLowerCase().includes(searchLower) || false) || 
          rabbit.earCombId.toLowerCase().includes(searchLower) ||
          (rabbit.color?.toLowerCase().includes(searchLower) || false) ||
          (rabbit.race?.toLowerCase().includes(searchLower) || false);
        
        if (!searchMatch) match = false;
      }
      
      return match;
    });
  }, [allRabbits, filters]);
  
  // Opdatér URL'en når filtrene ændrer sig, men UDENFOR rendering
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    const newPath = `/account/myRabbits${queryString ? `?${queryString}` : ''}`;
    
    // Tjek om URL'en faktisk er anderledes for at undgå unødvendige navigationer
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== newPath) {
      router.replace(newPath);
    }
  }, [filters, router]);
  
  // Filter opdatering - opdaterer kun lokalt state, URL-opdatering sker via useEffect
  const updateFilters = useCallback((newFilters: Partial<OwnFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []); // Ingen afhængigheder, da vi kun opdaterer lokalt state
  
  // Reset filtre - nulstiller kun lokalt state, URL-opdatering sker via useEffect
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);
  
  return {
    rabbits: filteredRabbits,
    filters,
    updateFilters,
    resetFilters,
    isLoading,
    error,
    refresh: mutate
  };
}

// Eksportér under begge navne for kompatibilitet
export const useMyRabbits = useMyRabbitsUI;