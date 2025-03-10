// src/app/account/myRabbits/rabbitOwnList.tsx
'use client';
import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useNav } from "@/components/Providers";
import OwnNav from '@/components/sectionNav/variants/rabbitOwnNav';
import { useOwnRabbits } from '@/lib/hooks/rabbits/useRabbitOwnFilter';
import RabbitPreviewCard from '@/components/cards/rabbitPreviewCard';
import MyNav from "@/components/sectionNav/variants/myNav";

type Props = {
    rabbits: Rabbit_PreviewDTO[];
};

export default function RabbitOwnList({ rabbits }: Props) {
    const router = useRouter();
    const { setPrimaryNav, setSecondaryNav } = useNav();
    const { filteredRabbits, filters, setFilters } = useOwnRabbits(rabbits);

    // Memoize both nav components
    const primaryNav = useMemo(() => (
        <OwnNav
            activeFilters={filters}
            onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        />
    ), [filters, setFilters]);

    const secondaryNav = useMemo(() => (
        <MyNav />
    ), []);

    // Set up both navigations
    useEffect(() => {
        setPrimaryNav(primaryNav);
        setSecondaryNav(secondaryNav);
        return () => {
            setPrimaryNav(null);
            setSecondaryNav(null);
        };
    }, [primaryNav, secondaryNav, setPrimaryNav, setSecondaryNav]);

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRabbits.map((rabbit) => (
                    <RabbitPreviewCard
                        key={rabbit.earCombId}
                        rabbit={rabbit}
                        onClick={() => router.push(`/account/myRabbits/rabbitProfile/${rabbit.earCombId}`)}
                    />
                ))}
            </div>
        </div>
    );
}