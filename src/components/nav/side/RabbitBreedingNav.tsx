// src/components/nav/side/RabbitBreedingNav.tsx
import { BreedingFilters } from "@/api/types/filterTypes";
import { RabbitBreedingNavClient } from './RabbitBreedingNavClient';

interface RabbitBreedingNavProps {
    activeFilters?: Partial<BreedingFilters>;
    onFilterChange?: (filters: BreedingFilters) => void;
}

/**
 * RabbitBreedingNav - Navigation for breeding rabbits
 * Server wrapper that imports client logic
 */
export default function RabbitBreedingNav({
    activeFilters = {},
    onFilterChange
}: RabbitBreedingNavProps) {
    return (
        <nav className="side-nav">
            <RabbitBreedingNavClient 
                activeFilters={activeFilters} 
                onFilterChange={onFilterChange}
            />
        </nav>
    );
}