// src/hooks/rabbits/useRabbitsData.ts
import { useState, useEffect } from 'react';
import { GetRabbitsForSale } from '@/Services/AngoraDbService';
import { ForSaleFilters } from '@/Types/filterTypes';
import { Rabbits_ForsalePreviewList } from '@/Types/backendTypes';

export function useRabbitsForSale(filters: ForSaleFilters) {
    const [rabbits, setRabbits] = useState<Rabbits_ForsalePreviewList>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        
        const fetchRabbits = async () => {
            try {
                const data = await GetRabbitsForSale(filters);
                if (isMounted) {
                    setRabbits(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Failed to fetch rabbits:', err);
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchRabbits();
        return () => { isMounted = false };
    }, [filters]);

    return { 
        rabbits, 
        isLoading, 
        error,
        refetch: () => setIsLoading(true)
    };
}
/*
Primært ansvar: Data fetching og state management
Håndterer:
• Fetch data fra API
• Loading states
• Error handling
• Cleanup ved unmount
• Refetch funktionalitet

graph TD
    A[useRabbitFilters] -->|Generic URL/Filter Logic| B[useRabbitsData]
    C[ForSalePage] -->|Uses| A
    D[ForBreedingPage] -->|Could Use| A
    A -->|Specific Implementation| E[useForsaleRabbits]
    A -->|Specific Implementation| F[useBreedingRabbits]
*/