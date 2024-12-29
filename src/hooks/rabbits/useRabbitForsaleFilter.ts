// src/hooks/rabbits/useRabbitForsaleFilters.ts
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ForSaleFilters } from '@/Types/filterTypes';
import { useRabbitsForSale } from './useRabbitsData';

export function useFilteredRabbits() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Initialize filters from URL
    const initialFilters: ForSaleFilters = {
        RightEarId: searchParams.get('rightEarId') || undefined,
        BornAfter: searchParams.get('bornAfter') || undefined,
        MinZipCode: searchParams.get('minZipCode') ? parseInt(searchParams.get('minZipCode')!) : undefined,
        MaxZipCode: searchParams.get('maxZipCode') ? parseInt(searchParams.get('maxZipCode')!) : undefined,
        Race: searchParams.get('race') || undefined,
        Color: searchParams.get('color') || undefined,
        Gender: searchParams.get('gender') || undefined,
    };

    const [filters, setFilters] = useState<ForSaleFilters>(initialFilters);
    const { rabbits, isLoading, error } = useRabbitsForSale(filters);

    const updateFilters = (newFilters: ForSaleFilters) => {
        setFilters(newFilters);
        const params = new URLSearchParams(
            Object.entries(newFilters)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, value.toString()])
        );
        router.replace(`/rabbits/for-sale${params.toString() ? `?${params}` : ''}`);
    };

    return { 
        rabbits, 
        filters,
        isLoading, 
        error,
        updateFilters 
    };
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