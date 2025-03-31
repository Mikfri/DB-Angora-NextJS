// src/components/nav/side/index/RabbitSaleNav.tsx
'use client';
import { ForSaleFilters } from "@/api/types/filterTypes";
import RabbitSaleNavBase from '../base/RabbitSaleNavBase';
import { RabbitSaleNavClient } from '../client/RabbitSaleNavClient';

interface RabbitSaleNavProps {
    activeFilters?: Partial<ForSaleFilters>;
    onFilterChange?: (filters: ForSaleFilters) => void;
}

/**
 * Integrated RabbitSaleNav component
 * Combines server-side base with client-side content
 */
export default function RabbitSaleNav({
    activeFilters = {},
    onFilterChange
}: RabbitSaleNavProps) {
    return (
        <RabbitSaleNavBase>
            <RabbitSaleNavClient 
                activeFilters={activeFilters} 
                onFilterChange={onFilterChange}
            />
        </RabbitSaleNavBase>
    );
}