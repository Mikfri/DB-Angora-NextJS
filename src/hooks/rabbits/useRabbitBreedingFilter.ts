// src/hooks/rabbits/useRabbitBreedingFilter.tsx

import { Rabbit_ForbreedingPreviewDTO } from "@/api/types/AngoraDTOs";
import { BreedingFilters } from "@/api/types/filterTypes";
import { useCallback, useMemo, useState } from "react";

// Default filter values med korrekte typer
const DEFAULT_FILTERS: BreedingFilters = {
    search: '',
    Gender: '',
    Race: '',
    Color: '',
    raceColorApproval: '',
    bornAfterDate: null,
    minZipCode: undefined,
    maxZipCode: undefined,
};

export function useBreedingRabbits(initialRabbits: Rabbit_ForbreedingPreviewDTO[]) {
    const [filters, setFilters] = useState<BreedingFilters>({ ...DEFAULT_FILTERS });

    // Apply filters to rabbits
    const filteredRabbits = useMemo(() => {
        return initialRabbits.filter(rabbit => {
            // Søgning i relevante felter
            const matchesSearch = !filters.search || filters.search === '' || (
                (rabbit.earCombId?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
                (rabbit.race?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
                (rabbit.color?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
                (rabbit.city?.toLowerCase().includes(filters.search.toLowerCase()) ?? false)
            );
            if (!matchesSearch) return false;

            // Gender filter
            if (filters.Gender && rabbit.gender !== filters.Gender) return false;

            // Race filter
            if (filters.Race && rabbit.race !== filters.Race) return false;

            // Color filter
            if (filters.Color && rabbit.color !== filters.Color) return false;

            // Postnummer range filter
            if (filters.minZipCode && rabbit.zipCode && rabbit.zipCode < filters.minZipCode) return false;
            if (filters.maxZipCode && rabbit.zipCode && rabbit.zipCode > filters.maxZipCode) return false;

            return true;
        });
    }, [initialRabbits, filters]);

    // Update filters with type-safety
    const updateFilters = useCallback((newFilters: Partial<BreedingFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    // Reset all filters
    const resetFilters = useCallback(() => {
        setFilters({ ...DEFAULT_FILTERS });
    }, []);

    return {
        filteredRabbits,
        filters,
        setFilters: updateFilters,
        resetFilters
    };
}