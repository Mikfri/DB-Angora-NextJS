// src/hooks/rabbits/useRabbitForsaleFilters.ts
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ForSaleFilters } from '@/Types/filterTypes';
import { GetRabbitsForSale } from '@/Services/AngoraDbService';
import { Rabbits_ForsalePreviewList } from '@/Types/backendTypes';

export function useFilteredRabbits() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [rabbits, setRabbits] = useState<Rabbits_ForsalePreviewList>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Parse URL params to filters
    const [filters, setFilters] = useState<ForSaleFilters>({
        RightEarId: searchParams.get('RightEarId') || undefined,
        BornAfter: searchParams.get('BornAfter') || undefined,
        MinZipCode: searchParams.get('MinZipCode') ? parseInt(searchParams.get('MinZipCode')!) : undefined,
        MaxZipCode: searchParams.get('MaxZipCode') ? parseInt(searchParams.get('MaxZipCode')!) : undefined,
        Race: searchParams.get('Race') || undefined,
        Color: searchParams.get('Color') || undefined,
        Gender: searchParams.get('Gender') || undefined,
    });

    // Fetch data when filters change
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await GetRabbitsForSale(filters);
                setRabbits(data);
                setError(null);
            } catch (err) {
                setError(err as Error);
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