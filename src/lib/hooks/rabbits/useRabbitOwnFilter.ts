// src/lib/hooks/rabbits/useRabbitOwnFilter.ts
import { useState } from 'react';
import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';
import { OwnFilters } from '@/api/types/filterTypes';

// Udvidelse af OwnFilters til at sikre nødvendige felter er påkrævet
// src/lib/hooks/rabbits/useRabbitOwnFilter.ts
type RequiredOwnFilters = {
    [K in keyof OwnFilters]-?: OwnFilters[K] extends undefined | null ? OwnFilters[K] : OwnFilters[K];
};

export function useOwnRabbits(initialRabbits: Rabbit_PreviewDTO[]) {
    const [filters, setFilters] = useState<RequiredOwnFilters>({
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
    });

    const filteredRabbits = initialRabbits.filter(rabbit => {
        // Tjek for afdøde kaniner
        const isDeceased = rabbit.dateOfDeath !== null;
        if (!filters.showDeceased && isDeceased) return false;
        
        // Tjek for ungdyr via API-egenskaben
        if (filters.showJuveniles && !rabbit.isJuvenile) return false;

        const matchesSearch = filters.search === '' || (
            (rabbit.nickName?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
            (rabbit.earCombId.toLowerCase().includes(filters.search.toLowerCase())) ||
            (rabbit.race?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
            (rabbit.color?.toLowerCase().includes(filters.search.toLowerCase()) ?? false)
        );

        const matchesRaceColorApproval = !filters.raceColorApproval || 
            (filters.raceColorApproval === 'Approved' && rabbit.approvedRaceColorCombination === true) ||
            (filters.raceColorApproval === 'NotApproved' && rabbit.approvedRaceColorCombination === false);
        const matchesBornAfter = !filters.bornAfterDate ||
            (rabbit.dateOfBirth && new Date(rabbit.dateOfBirth) >= new Date(filters.bornAfterDate));
        const matchesGender = !filters.gender || rabbit.gender === filters.gender;
        const matchesRace = !filters.race || rabbit.race === filters.race;
        const matchesColor = !filters.color || rabbit.color === filters.color;
        const matchesForSale = !filters.forSale || rabbit.hasSaleDetails === true;
        
        // Forenklet - brug direkte isForBreeding property
        const matchesForBreeding = !filters.isForBreeding || rabbit.isForBreeding === true;

        return matchesSearch &&
            matchesGender &&
            matchesRace &&
            matchesColor &&
            matchesForSale &&
            matchesForBreeding &&
            matchesRaceColorApproval &&
            matchesBornAfter;
    });

    return {
        filteredRabbits,
        filters,
        setFilters
    };
}