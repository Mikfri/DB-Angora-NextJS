import { useState, useCallback, useMemo, useEffect } from 'react';
import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';
import { OwnFilters } from '@/api/types/filterTypes';

// Default filter values
const DEFAULT_FILTERS: Required<OwnFilters> = {
    search: '',
    gender: null,
    race: null,
    color: null,
    forSale: false,
    isForBreeding: false,
    showDeceased: false,
    showJuveniles: false,
    raceColorApproval: null,
    bornAfterDate: null,
};

export function useOwnRabbits(initialRabbits: Rabbit_PreviewDTO[]) {
    const [rabbits] = useState<Rabbit_PreviewDTO[]>(initialRabbits);
    const [filters, setFilters] = useState<Required<OwnFilters>>(DEFAULT_FILTERS);

    // Memoize filtered rabbits
    const filteredRabbits = useMemo(() => {
        console.log('useOwnRabbits - Applying filters:', filters);
        
        return rabbits.filter(rabbit => {
            // Check for deceased rabbits
            const isDeceased = rabbit.dateOfDeath !== null;
            if (!filters.showDeceased && isDeceased) return false;
            
            // Check for juvenile filter
            if (filters.showJuveniles && !rabbit.isJuvenile) return false;

            // Basic search
            const searchLower = filters.search?.toLowerCase() || '';
            const matchesSearch = !searchLower || (
                (rabbit.nickName?.toLowerCase()?.includes(searchLower) || false) ||
                (rabbit.earCombId?.toLowerCase()?.includes(searchLower) || false) ||
                (rabbit.race?.toLowerCase()?.includes(searchLower) || false) ||
                (rabbit.color?.toLowerCase()?.includes(searchLower) || false)
            );
            
            // Specialty filters
            const matchesRaceColorApproval = !filters.raceColorApproval || 
                (filters.raceColorApproval === 'Approved' && rabbit.approvedRaceColorCombination === true) ||
                (filters.raceColorApproval === 'NotApproved' && rabbit.approvedRaceColorCombination === false);
            
            // Date filter
            const matchesBornAfter = !filters.bornAfterDate || 
                (rabbit.dateOfBirth && new Date(rabbit.dateOfBirth) >= new Date(filters.bornAfterDate));
            
            // Basic property filters
            const matchesGender = !filters.gender || rabbit.gender === filters.gender;
            const matchesRace = !filters.race || rabbit.race === filters.race;
            const matchesColor = !filters.color || rabbit.color === filters.color;
            
            // Flag filters
            const matchesForSale = !filters.forSale || rabbit.hasSaleDetails === true;
            const matchesForBreeding = !filters.isForBreeding || rabbit.isForBreeding === true;
            
            // All conditions must match
            return matchesSearch &&
                matchesGender &&
                matchesRace &&
                matchesColor &&
                matchesForSale &&
                matchesForBreeding &&
                matchesRaceColorApproval &&
                matchesBornAfter;
        });
    }, [rabbits, filters]);

    // Handler for updating filters - explicit handling for boolean values
    const updateFilters = useCallback((newFilters: Partial<OwnFilters>) => {
        console.log('useOwnRabbits - Updating filters with:', newFilters);
        
        setFilters(prev => {
            // Create a deep copy
            const updated = { ...prev };
            
            // Handle special conversion for boolean properties
            if (newFilters.forSale !== undefined) updated.forSale = Boolean(newFilters.forSale);
            if (newFilters.isForBreeding !== undefined) updated.isForBreeding = Boolean(newFilters.isForBreeding);
            if (newFilters.showDeceased !== undefined) updated.showDeceased = Boolean(newFilters.showDeceased);
            if (newFilters.showJuveniles !== undefined) updated.showJuveniles = Boolean(newFilters.showJuveniles);
            
            // Handle string and other properties
            if (newFilters.search !== undefined) updated.search = newFilters.search;
            if (newFilters.gender !== undefined) updated.gender = newFilters.gender;
            if (newFilters.race !== undefined) updated.race = newFilters.race;
            if (newFilters.color !== undefined) updated.color = newFilters.color;
            if (newFilters.raceColorApproval !== undefined) updated.raceColorApproval = newFilters.raceColorApproval;
            if (newFilters.bornAfterDate !== undefined) updated.bornAfterDate = newFilters.bornAfterDate;
            
            return updated;
        });
    }, []);

    // Reset all filters
    const resetFilters = useCallback(() => {
        console.log('useOwnRabbits - Resetting all filters');
        setFilters({ ...DEFAULT_FILTERS });
    }, []);

    // Count filtered results for debugging
    useEffect(() => {
        console.log(`useOwnRabbits - Filter results: ${filteredRabbits.length} of ${rabbits.length} rabbits`);
    }, [filteredRabbits.length, rabbits.length]);

    return {
        filteredRabbits,
        filters,
        setFilters: updateFilters,
        resetFilters
    };
}