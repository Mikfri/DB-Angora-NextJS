// src/app/account/myRabbits/rabbitOwnList.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import RabbitOwnNav from '@/components/nav/side/index/RabbitOwnNav';
import RabbitPreviewCard from '@/components/cards/rabbitPreviewCard';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import { useRabbitsOwnedStore } from '@/store/rabbitsOwnedStore';

// Ingen props nødvendig mere! Alt kommer fra storen
export default function RabbitOwnList() {
    const router = useRouter();
    
    // Hent alt fra storen
    const {
        rabbits,
        filteredRabbits,
        pagination,
        resetFilters
    } = useRabbitsOwnedStore();

    // Opret navigation element
    const navElement = useMemo(() => (
        <RabbitOwnNav />
    ), []);

    // Vis filtrerede kaniner (som nu kommer direkte fra storen)
    const displayRabbits = filteredRabbits;

    // Content med kaniner
    const content = (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            {/* Debug info */}
            <div className="text-xs text-zinc-500 mb-4">
                Side {pagination.page} • Viser {displayRabbits.length} ud af {rabbits.length} kaniner
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