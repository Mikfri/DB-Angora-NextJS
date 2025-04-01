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
};

export default function RabbitOwnList({ rabbits }: Props) {
    const router = useRouter();
    const { 
        filteredRabbits, 
        filters, 
        setFilters,
        resetFilters
    } = useOwnRabbits(rabbits);

    // Stabil callback til filteropdateringer med korrekt type
    const handleFilterChange = useCallback((newFilters: Partial<OwnFilters>) => {
        console.log("RabbitOwnList - Handling filter change:", newFilters);
        setFilters(newFilters);
    }, [setFilters]);

    // Log filteropdateringer for debugging
    useEffect(() => {
        console.log("RabbitOwnList - Current filters:", filters);
        console.log("RabbitOwnList - Filtered rabbits:", filteredRabbits.length);
    }, [filters, filteredRabbits.length]);

    // Opret navigation element
    const navElement = useMemo(() => (
        <RabbitOwnNav
            activeFilters={filters}
            onFilterChange={handleFilterChange}
        />
    ), [filters, handleFilterChange]);
    
    // Content med kaniner
    const content = (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRabbits.map((rabbit) => (
                    <RabbitPreviewCard
                        key={rabbit.earCombId}
                        rabbit={rabbit}
                        onClick={() => router.push(`/account/myRabbits/rabbitProfile/${rabbit.earCombId}`)}
                    />
                ))}
                
                {filteredRabbits.length === 0 && (
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