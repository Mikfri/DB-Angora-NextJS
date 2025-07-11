// src/components/nav/side/index/RabbitOwnNav.tsx
'use client';
import { OwnFilters } from "@/api/types/filterTypes";
import RabbitOwnNavBase from '../base/RabbitOwnNavBase';
import { RabbitOwnNavClient } from '../client/RabbitOwnNavClient';

interface RabbitOwnNavProps {
    activeFilters: OwnFilters;
    onFilterChange: (filters: Partial<OwnFilters>) => void;
    setLifeStatusFilter?: (status: 'all' | 'alive' | 'deceased') => void;
}
/**
 * Integrated RabbitOwnNav component
 * Combines server-side base with client-side content
 */
export default function RabbitOwnNav({
    activeFilters,
    onFilterChange,
    setLifeStatusFilter
}: RabbitOwnNavProps) {
    return (
        <RabbitOwnNavBase>
            <RabbitOwnNavClient 
                activeFilters={activeFilters} 
                onFilterChange={onFilterChange}
                setLifeStatusFilter={setLifeStatusFilter}
            />
        </RabbitOwnNavBase>
    );
}