// src/hooks/rabbits/useRabbitOwnFilter.ts
import { useState } from 'react';
import { Rabbit_PreviewDTO } from '@/Types/backendTypes';

export interface OwnFilters {
    search: string;
    Gender: string | undefined;
    Race: string | undefined;
    Color: string | undefined;
    ForSale: boolean;
    ForBreeding: boolean;
    showDeceased: boolean;
    raceColorApproval: string | undefined;
    bornAfterDate: string | null;
}

export function useOwnRabbits(initialRabbits: Rabbit_PreviewDTO[]) {
    const [filters, setFilters] = useState<OwnFilters>({
        search: '',
        Gender: undefined,
        Race: undefined,
        Color: undefined,
        ForSale: false,
        ForBreeding: false,
        showDeceased: false,
        raceColorApproval: undefined,
        bornAfterDate: null,
    });

    const filteredRabbits = initialRabbits.filter(rabbit => {
        const isDeceased = rabbit.dateOfDeath !== null;
        if (filters.showDeceased !== isDeceased) return false;

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
        const matchesGender = !filters.Gender || rabbit.gender === filters.Gender;
        const matchesRace = !filters.Race || rabbit.race === filters.Race;
        const matchesColor = !filters.Color || rabbit.color === filters.Color;
        const matchesForSale = !filters.ForSale || rabbit.forSale === 'Ja';
        const matchesForBreeding = !filters.ForBreeding || rabbit.forBreeding === 'Ja';

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