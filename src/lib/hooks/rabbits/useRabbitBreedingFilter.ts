// src/lib/hooks/rabbits/useRabbitBreedingFilter.ts
import { Rabbit_ForbreedingPreviewDTO } from '@/api/types/AngoraDTOs';
import { useState } from 'react';

export interface BreedingFilters {
    search: string;
    Gender: string | undefined;
    Race: string | undefined;
    Color: string | undefined;
    raceColorApproval: string | undefined;
    bornAfterDate: string | null;
    minZipCode: number | undefined;
    maxZipCode: number | undefined;
}

export function useBreedingRabbits(initialRabbits: Rabbit_ForbreedingPreviewDTO[]) {
    const [filters, setFilters] = useState<BreedingFilters>({
        search: '',
        Gender: undefined,
        Race: undefined,
        Color: undefined,
        raceColorApproval: undefined,
        bornAfterDate: null,
        minZipCode: undefined,
        maxZipCode: undefined,
    });

    const filteredRabbits = initialRabbits.filter(rabbit => {
        const matchesSearch = filters.search === '' || (
            (rabbit.earCombId.toLowerCase().includes(filters.search.toLowerCase())) ||
            (rabbit.race?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
            (rabbit.color?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
            (rabbit.city?.toLowerCase().includes(filters.search.toLowerCase()) ?? false)
        );

        const matchesZipCode = (!filters.minZipCode || rabbit.zipCode >= filters.minZipCode) &&
            (!filters.maxZipCode || rabbit.zipCode <= filters.maxZipCode);

        const matchesRaceColorApproval = !filters.raceColorApproval || 
            (filters.raceColorApproval === 'Approved' && rabbit.approvedRaceColorCombination === true) ||
            (filters.raceColorApproval === 'NotApproved' && rabbit.approvedRaceColorCombination === false);
            
        const matchesBornAfter = !filters.bornAfterDate ||
            (rabbit.dateOfBirth && new Date(rabbit.dateOfBirth) >= new Date(filters.bornAfterDate));
            
        const matchesGender = !filters.Gender || rabbit.gender === filters.Gender;
        const matchesRace = !filters.Race || rabbit.race === filters.Race;
        const matchesColor = !filters.Color || rabbit.color === filters.Color;

        return matchesSearch &&
            matchesGender &&
            matchesRace &&
            matchesColor &&
            matchesRaceColorApproval &&
            matchesBornAfter &&
            matchesZipCode;
    });

    return {
        filteredRabbits,
        filters,
        setFilters
    };
}