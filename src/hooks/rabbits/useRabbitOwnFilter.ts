// src/hooks/rabbits/useRabbitOwnFilter.ts
import { useState, useCallback, useMemo } from 'react';
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
    lifeStatus: null,  // NULL = vis alle, true = kun døde, false = kun levende
    showJuveniles: false,
    raceColorApproval: null,
    bornAfterDate: null,
};

export function useOwnRabbits(initialRabbits: Rabbit_PreviewDTO[], isPaginated: boolean = false) {
    const [filters, setFilters] = useState<Required<OwnFilters>>(DEFAULT_FILTERS);
    
    // Tjek om der er aktive filtre
    const isAnyFilterActive = useMemo(() => {
        return filters.search !== '' || 
               filters.gender !== null ||
               filters.race !== null ||
               filters.color !== null ||
               filters.forSale !== false ||
               filters.isForBreeding !== false ||
               filters.lifeStatus !== null || // Kun aktiv hvis ikke null
               filters.showJuveniles !== false ||
               filters.raceColorApproval !== null ||
               filters.bornAfterDate !== null;
    }, [filters]);

    // Filtrer kaniner baseret på det aktuelle filtersæt
    const filteredRabbits = useMemo(() => {
        // Ved paginering og ingen aktive filtre - returner blot alle kaniner
        if (isPaginated && !isAnyFilterActive) {
            return initialRabbits;
        }
        
        // Ellers anvend filtre
        return initialRabbits.filter(rabbit => {
            // Tjek for afdøde kaniner (kun hvis lifeStatus er sat til andet end null)
            const isDeceased = rabbit.dateOfDeath !== null;
            
            // FORBEDRET LOGIK: Kun anvend dette filter hvis det ikke er null
            if (filters.lifeStatus !== null && filters.lifeStatus !== isDeceased) {
                return false;
            }
            
            // Tjek for ungdyr
            if (filters.showJuveniles && !rabbit.isJuvenile) return false;

            // Søgning
            const searchLower = filters.search?.toLowerCase() || '';
            const matchesSearch = !searchLower || (
                (rabbit.nickName?.toLowerCase()?.includes(searchLower) || false) ||
                (rabbit.earCombId?.toLowerCase()?.includes(searchLower) || false) ||
                (rabbit.race?.toLowerCase()?.includes(searchLower) || false) ||
                (rabbit.color?.toLowerCase()?.includes(searchLower) || false)
            );
            
            // Race/farve godkendelse
            const matchesRaceColorApproval = !filters.raceColorApproval || 
                (filters.raceColorApproval === 'Approved' && rabbit.approvedRaceColorCombination === true) ||
                (filters.raceColorApproval === 'NotApproved' && rabbit.approvedRaceColorCombination === false);
            
            // Dato filter
            const matchesBornAfter = !filters.bornAfterDate || 
                (rabbit.dateOfBirth && new Date(rabbit.dateOfBirth) >= new Date(filters.bornAfterDate));
            
            // Basis egenskaber
            const matchesGender = !filters.gender || rabbit.gender === filters.gender;
            const matchesRace = !filters.race || rabbit.race === filters.race;
            const matchesColor = !filters.color || rabbit.color === filters.color;
            
            // Flag filtre
            const matchesForSale = !filters.forSale || rabbit.hasSaleDetails === true;
            const matchesForBreeding = !filters.isForBreeding || rabbit.isForBreeding === true;
            
            // Alle betingelser skal matche
            return matchesSearch &&
                matchesGender &&
                matchesRace &&
                matchesColor &&
                matchesForSale &&
                matchesForBreeding &&
                matchesRaceColorApproval &&
                matchesBornAfter;
        });
    }, [initialRabbits, filters, isPaginated, isAnyFilterActive]);

    // Opdatér filtre
    const updateFilters = useCallback((newFilters: Partial<OwnFilters>) => {
        setFilters(prev => ({
            ...prev,
            
            // Særlig håndtering af lifeStatus
            ...(newFilters.lifeStatus !== undefined ? { 
                lifeStatus: newFilters.lifeStatus
            } : {}),
            
            // Andre boolean properties
            ...(newFilters.forSale !== undefined ? { forSale: Boolean(newFilters.forSale) } : {}),
            ...(newFilters.isForBreeding !== undefined ? { isForBreeding: Boolean(newFilters.isForBreeding) } : {}),
            ...(newFilters.showJuveniles !== undefined ? { showJuveniles: Boolean(newFilters.showJuveniles) } : {}),
            
            // Andre egenskaber
            ...(newFilters.search !== undefined ? { search: newFilters.search } : {}),
            ...(newFilters.gender !== undefined ? { gender: newFilters.gender } : {}),
            ...(newFilters.race !== undefined ? { race: newFilters.race } : {}),
            ...(newFilters.color !== undefined ? { color: newFilters.color } : {}),
            ...(newFilters.raceColorApproval !== undefined ? { raceColorApproval: newFilters.raceColorApproval } : {}),
            ...(newFilters.bornAfterDate !== undefined ? { bornAfterDate: newFilters.bornAfterDate } : {}),
        }));
    }, []);

    // Nulstil alle filtre
    const resetFilters = useCallback(() => {
        setFilters({ ...DEFAULT_FILTERS });
    }, []);

    // Eksporter en ekstra funktion til at nemt vise levende/døde kaniner
    const setLifeStatusFilter = useCallback((status: 'all' | 'alive' | 'deceased') => {
        const lifeStatus = status === 'all' 
            ? null 
            : status === 'deceased';
            
        updateFilters({ lifeStatus });
    }, [updateFilters]);

    // Eksporter mere detaljeret info om aktive filtre
    const activeFilterInfo = useMemo(() => ({
        hasAnyFilter: isAnyFilterActive,
        hasLifeStatusFilter: filters.lifeStatus !== null,
        currentLifeStatus: filters.lifeStatus === null 
            ? 'all' 
            : filters.lifeStatus ? 'deceased' : 'alive'
    }), [isAnyFilterActive, filters.lifeStatus]);

    return {
        filteredRabbits,
        filters,
        setFilters: updateFilters,
        resetFilters,
        isAnyFilterActive,
        setLifeStatusFilter,
        activeFilterInfo
    };
}