// src/app/account/myRabbits/rabbitOwnList.tsx
'use client';
import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback, useMemo } from 'react';
import RabbitOwnNav from '@/components/nav/side/index/RabbitOwnNav';
import { useOwnRabbits } from '@/hooks/rabbits/useRabbitOwnFilter';
import RabbitPreviewCard from '@/components/cards/rabbitPreviewCard';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import { OwnFilters } from '@/api/types/filterTypes';

type Props = {
    rabbits: Rabbit_PreviewDTO[];
    isPaginated?: boolean;
    currentPage?: number;
    overrideFilters?: boolean; // Add this prop to force display of all rabbits
};

export default function RabbitOwnList({
    rabbits,
    isPaginated = false,
    currentPage = 1,
    overrideFilters = false
}: Props) {
    const router = useRouter();
    const {
        filteredRabbits,
        filters,
        setFilters,
        resetFilters,
        setLifeStatusFilter  // Tilføj denne
    } = useOwnRabbits(rabbits, isPaginated);

    // Stabil callback til filteropdateringer med korrekt type
    const handleFilterChange = useCallback((newFilters: Partial<OwnFilters>) => {
        console.log("RabbitOwnList - Handling filter change:", newFilters);
        setFilters(newFilters);
    }, [setFilters]);

    // Log filteropdateringer for debugging
    useEffect(() => {
        console.log("RabbitOwnList - Current filters:", filters);
        console.log(`RabbitOwnList - Filtered rabbits: ${filteredRabbits.length} (from ${rabbits.length} on page ${currentPage})`);
    }, [filters, filteredRabbits.length, rabbits.length, currentPage]);

    // Reset filtre når siden ændres for at undgå konflikt mellem paginering og filtrering
    useEffect(() => {
        if (isPaginated) {
            console.log(`Page changed to ${currentPage}, resetting filters`);
            resetFilters();
        }
    }, [currentPage, isPaginated, resetFilters]);

    // Opret navigation element
    const navElement = useMemo(() => (
        <RabbitOwnNav
            activeFilters={filters}
            onFilterChange={handleFilterChange}
            setLifeStatusFilter={setLifeStatusFilter}
        />
    ), [filters, handleFilterChange, setLifeStatusFilter]);

    // Hvis overrideFilters er true, vis rabbits direkte (ignorer filtreringen)
    const displayRabbits = overrideFilters ? rabbits : filteredRabbits;

    // Content med kaniner
    const content = (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            {/* Debug info */}
            <div className="text-xs text-zinc-500 mb-4">
                Side {currentPage} • Viser {displayRabbits.length} ud af {rabbits.length} kaniner
                {overrideFilters && ' (Filtre ignoreres)'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayRabbits.map((rabbit) => (
                    <RabbitPreviewCard
                        key={rabbit.earCombId}
                        rabbit={rabbit}
                        onClick={() => router.push(`/account/myRabbits/rabbitProfile/${rabbit.earCombId}`)}
                    />
                ))}

                {displayRabbits.length === 0 && (
                    <div className="col-span-full text-center py-8">
                        <p className="text-zinc-400">Ingen kaniner matcher de valgte filtre</p>
                        <button
                            onClick={resetFilters}
                            className="mt-2 text-primary underline text-sm"
                        >
                            Nulstil alle filtre
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Wrap alt i SideNavLayout
    return (
        <SideNavLayout sideNav={navElement}>
            {content}
        </SideNavLayout>
    );
}