// src/hooks/rabbits/useRabbitForsaleFilters.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ForSaleFilters } from '@/Types/filterTypes';
import { GetRabbitsForSale } from '@/Services/AngoraDbService';
import { Rabbits_ForsalePreviewList } from '@/Types/AngoraDTOs';

export function useFilteredRabbits(initialData: Rabbits_ForsalePreviewList, initialFilters: ForSaleFilters) {
    const router = useRouter();
    const [rabbits, setRabbits] = useState<Rabbits_ForsalePreviewList>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [filters, setFilters] = useState<ForSaleFilters>(initialFilters);


    // Fetch data when filters change
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await GetRabbitsForSale(filters);
                setRabbits(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            }
            setIsLoading(false);
        };
        fetchData();
    }, [filters]);

    // Update filters and URL
    const updateFilters = (newFilters: ForSaleFilters) => {
        setFilters(newFilters);
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
        });
        router.replace(`/sale/rabbits${params.toString() ? `?${params}` : ''}`);
    };

    return { rabbits, filters, isLoading, error, updateFilters };
}
/*
useFilteredRabbits
Primært ansvar: URL sync og filter management
• Håndterer:
• URL parameters sync
• Filter state
• Routing
• Kombinerer data fra useRabbitsForSale med filter logik
*/