// src/app/sale/rabbits/rabbitSaleList.tsx
'use client'
import { useNav } from "@/components/Providers";
import { useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import ForSaleNav from '@/components/sectionNav/variants/rabbitSaleNav';
import RabbitForsaleCard from '@/components/cards/rabbitForsaleCard';
import { Rabbits_SaleDetailsPreviewList } from '@/api/types/AngoraDTOs';
import { ForSaleFilters } from '@/api/types/filterTypes';
import { useFilteredRabbits } from '@/lib/hooks/rabbits/useRabbitForsaleFilter';
import MyNav from "@/components/sectionNav/variants/myNav";

interface Props {
    initialData: Rabbits_SaleDetailsPreviewList;
    initialFilters: ForSaleFilters;
    showSecondaryNav?: boolean;
}

export default function RabbitsForSale({
    initialData,
    initialFilters,
    showSecondaryNav = false // default to false
}: Props) {
    const { setPrimaryNav, setSecondaryNav } = useNav();
    const router = useRouter();
    const { rabbits, filters, updateFilters, isLoading } = useFilteredRabbits(initialData, initialFilters);

    // Memoize both nav components
    const primaryNav = useMemo(() => (
        <ForSaleNav
            activeFilters={filters}
            onFilterChange={updateFilters}
        />
    ), [filters, updateFilters]);

    const secondaryNav = useMemo(() => (
        <MyNav />
    ), []);

    // Set up both navigations
    useEffect(() => {
        setPrimaryNav(primaryNav);
        // Only set secondary nav if showSecondaryNav is true
        if (showSecondaryNav) {
            setSecondaryNav(secondaryNav);
        }
        return () => {
            setPrimaryNav(null);
            setSecondaryNav(null);
        };
    }, [primaryNav, secondaryNav, setPrimaryNav, setSecondaryNav, showSecondaryNav]);



    const handleCardClick = (earCombId: string) => {
        router.push(`/sale/rabbits/profile/${earCombId}`);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {rabbits.map((rabbit) => (
                <RabbitForsaleCard
                    key={rabbit.earCombId}
                    rabbit={rabbit}
                    onClick={() => handleCardClick(rabbit.earCombId)}
                />
            ))}
        </div>
    </div>
);
}