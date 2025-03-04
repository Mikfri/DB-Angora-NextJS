// src/lib/hooks/rabbits/useRabbitBreedingFilter.ts
import { Rabbit_ForbreedingPreviewDTO } from '@/api/types/AngoraDTOs';
import { BreedingFilters } from '@/api/types/filterTypes';
import { useState } from 'react';

export function useBreedingRabbits(initialRabbits: Rabbit_ForbreedingPreviewDTO[]) {
    // Opdateret til at bruge feltnavne fra BreedingFilters interface
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
        // Søgning i relevante felter
        const matchesSearch = !filters.search || filters.search === '' || (
            (rabbit.earCombId?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
            (rabbit.race?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
            (rabbit.color?.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
            (rabbit.city?.toLowerCase().includes(filters.search.toLowerCase()) ?? false)
        );

        // Postnummer-filtrering
        const matchesZipCode = 
            (!filters.minZipCode || (rabbit.zipCode && rabbit.zipCode >= filters.minZipCode)) &&
            (!filters.maxZipCode || (rabbit.zipCode && rabbit.zipCode <= filters.maxZipCode));

        // Race/farve godkendelse
        const matchesRaceColorApproval = !filters.raceColorApproval || 
            (filters.raceColorApproval === 'Approved' && rabbit.approvedRaceColorCombination === true) ||
            (filters.raceColorApproval === 'NotApproved' && rabbit.approvedRaceColorCombination === false);
        
        // Fødselsdato
        const matchesBornAfter = !filters.bornAfterDate ||
            (rabbit.dateOfBirth && new Date(rabbit.dateOfBirth) >= new Date(filters.bornAfterDate));
            
        // Matchning på grundlæggende attributter
        const matchesGender = !filters.Gender || rabbit.gender === filters.Gender;
        const matchesRace = !filters.Race || rabbit.race === filters.Race;
        const matchesColor = !filters.Color || rabbit.color === filters.Color;

        // Kombiner alle filter-resultater
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