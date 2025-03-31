// src/lib/hooks/rabbits/useRabbitForsaleFilter.tsx
import { useCallback, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ForSaleFilters } from '@/api/types/filterTypes';

type FilterValue = string | number | undefined | null;

// Default filter værdier
const DEFAULT_FILTERS: ForSaleFilters = {
    Race: null,
    Color: null,
    Gender: null,
    RightEarId: null,
    BornAfter: null,
    MinZipCode: null,
    MaxZipCode: null
};

// Pure function til URL parameter ekstraktion
function extractFiltersFromUrl(searchParams: ReturnType<typeof useSearchParams>): Partial<ForSaleFilters> {
    if (!searchParams) return {};

    return {
        Race: searchParams?.get('Race') ?? null,
        Color: searchParams?.get('Color') ?? null,
        Gender: searchParams?.get('Gender') ?? null,
        RightEarId: searchParams?.get('RightEarId') ?? null,
        BornAfter: searchParams?.get('BornAfter') ?? null,
        MinZipCode: searchParams?.has('MinZipCode')
            ? Number(searchParams.get('MinZipCode')) || null
            : null,
        MaxZipCode: searchParams?.has('MaxZipCode')
            ? Number(searchParams.get('MaxZipCode')) || null
            : null
    };
}

interface UseRabbitSearchOptions {
    initialFilters?: Partial<ForSaleFilters>;
    onFilterChange?: (filters: ForSaleFilters) => void;
}

/**
 * Custom hook til håndtering af kanin-søgefunktionalitet
 */
export function useRabbitSearch({ 
    initialFilters = {}, 
    onFilterChange 
}: UseRabbitSearchOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Lokale filtre med default værdier og fra URL
    const [filters, setFilters] = useState<ForSaleFilters>(() => ({
        ...DEFAULT_FILTERS,
        ...initialFilters,
        ...extractFiltersFromUrl(searchParams)
    }));

    // Lyt efter URL ændringer og opdater filtre
    useEffect(() => {
        if (pathname?.includes('/sale/rabbits')) {
            const paramsFilters = extractFiltersFromUrl(searchParams);
            setFilters(prev => ({ ...prev, ...paramsFilters }));
        }
    }, [searchParams, pathname]);

    // Opdater enkelt filter
    const updateFilter = useCallback((key: keyof ForSaleFilters, value: FilterValue) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    // Nulstil enkelt filter
    const clearFilter = useCallback((key: keyof ForSaleFilters) => {
        setFilters(prev => ({ ...prev, [key]: null }));
    }, []);

    // Udfør søgning
    const search = useCallback(() => {
        if (onFilterChange) {
            onFilterChange(filters);
        } else {
            // Filtrer null/undefined/tomme værdier fra URL
            const filteredEntries = Object.entries(filters).filter(
                ([, v]) => v !== null && v !== undefined && v !== ''
            );

            // Opbyg URLSearchParams
            const params = new URLSearchParams(
                filteredEntries.map(([k, v]) => [k, String(v)])
            );

            // VIGTIGT: Tilføj en dummy parameter for tomme søgninger
            if (filteredEntries.length === 0) {
                params.append('all', 'true');
            }

            // Navigér med den opdaterede URL - brug replace for at undgå history stacking
            router.replace(`/sale/rabbits${params.toString() ? `?${params.toString()}` : ''}`);
        }
    }, [onFilterChange, filters, router]);

    // Reset alle filtre
    const resetAllFilters = useCallback(() => {
        setFilters({ ...DEFAULT_FILTERS });
    }, []);

    return {
        filters,
        updateFilter,
        clearFilter,
        search,
        resetAllFilters
    };
}