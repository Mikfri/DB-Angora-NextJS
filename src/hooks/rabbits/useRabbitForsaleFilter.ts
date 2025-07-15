// src/lib/hooks/rabbits/useRabbitForsaleFilter.tsx
import { useCallback, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Rabbit_ForSaleFilterDTO } from '@/api/types/filterTypes';

type FilterValue = string | number | undefined | null;

// Default filter værdier
const DEFAULT_FILTERS: Rabbit_ForSaleFilterDTO = {
    race: null,
    color: null,
    gender: null,
    rightEarId: null,
    bornAfter: null,
    minZipCode: null,
    maxZipCode: null
};

// Pure function til URL parameter ekstraktion
function extractFiltersFromUrl(searchParams: ReturnType<typeof useSearchParams>): Partial<Rabbit_ForSaleFilterDTO> {
    if (!searchParams) return {};

    return {
        race: searchParams?.get('Race') ?? null,
        color: searchParams?.get('Color') ?? null,
        gender: searchParams?.get('Gender') ?? null,
        rightEarId: searchParams?.get('RightEarId') ?? null,
        bornAfter: searchParams?.get('BornAfter') ?? null,
        minZipCode: searchParams?.has('MinZipCode')
            ? Number(searchParams.get('MinZipCode')) || null
            : null,
        maxZipCode: searchParams?.has('MaxZipCode')
            ? Number(searchParams.get('MaxZipCode')) || null
            : null
    };
}

interface UseRabbitSearchOptions {
    initialFilters?: Partial<Rabbit_ForSaleFilterDTO>;
    onFilterChange?: (filters: Rabbit_ForSaleFilterDTO) => void;
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
    const [filters, setFilters] = useState<Rabbit_ForSaleFilterDTO>(() => ({
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
    const updateFilter = useCallback((key: keyof Rabbit_ForSaleFilterDTO, value: FilterValue) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    // Nulstil enkelt filter
    const clearFilter = useCallback((key: keyof Rabbit_ForSaleFilterDTO) => {
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