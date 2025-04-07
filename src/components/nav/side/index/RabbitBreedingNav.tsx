// src/components/nav/side/base/RabbitBreedingNavBase.tsx
'use client';
import { BreedingFilters } from "@/api/types/filterTypes";
import RabbitBreedingNavBase from '../base/RabbitBreedingNavBase';
import { RabbitBreedingNavClient } from '../client/RabbitBreedingNavClient';

interface RabbitBreedingNavProps {
    activeFilters?: Partial<BreedingFilters>;
    onFilterChange?: (filters: BreedingFilters) => void;
}

/**
 * Integrated RabbitBreedingNav component
 * Combines server-side base with client-side content
 */
export default function RabbitBreedingNav({
    activeFilters = {},
    onFilterChange
}: RabbitBreedingNavProps) {
    return (
        <RabbitBreedingNavBase>
            <RabbitBreedingNavClient 
                activeFilters={activeFilters} 
                onFilterChange={onFilterChange}
            />
        </RabbitBreedingNavBase>
    );
}