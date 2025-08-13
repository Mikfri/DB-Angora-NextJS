'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import RabbitOwnNav from '@/components/nav/side/index/RabbitOwnNav';
import RabbitPreviewCard from '@/components/cards/rabbitPreviewCard';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import { useRabbitsOwnedStore } from '@/store/rabbitsOwnedStore';
import { ROUTES } from '@/constants/navigation';

// Ingen props nødvendig mere! Alt kommer fra storen
export default function RabbitOwnList({ userId }: { userId?: string }) {
    const router = useRouter();
    const { fetchRabbits } = useRabbitsOwnedStore();
    useEffect(() => {
        fetchRabbits(1, userId);
    }, [fetchRabbits, userId]);

    // Hent alt fra storen
    const {
        rabbits,
        filteredRabbits,
        pagination,
        resetFilters
    } = useRabbitsOwnedStore();

    // Sorterings-state
    const [sortBy, setSortBy] = useState<'none' | 'dateOfBirth' | 'race'>('none');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Sortér rabbits efter valgt sortering, eller behold original rækkefølge
    const sortedRabbits = useMemo(() => {
        if (sortBy === 'none') return filteredRabbits;
        const rabbitsCopy = [...filteredRabbits];
        rabbitsCopy.sort((a, b) => {
            if (sortBy === 'dateOfBirth') {
                const dateA = new Date(a.dateOfBirth).getTime();
                const dateB = new Date(b.dateOfBirth).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
            if (sortBy === 'race') {
                if (a.race < b.race) return sortOrder === 'asc' ? -1 : 1;
                if (a.race > b.race) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            }
            return 0;
        });
        return rabbitsCopy;
    }, [filteredRabbits, sortBy, sortOrder]);

    // Opret navigation element
    const navElement = useMemo(() => (
        <RabbitOwnNav />
    ), []);

    // Sorteringskontrol til UI
    const sortControls = (
        <div className="flex gap-2 mb-4 items-center">
            <span className="text-xs text-zinc-400">Sortér efter:</span>
            <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'none' | 'dateOfBirth' | 'race')}
                className="bg-zinc-700 text-zinc-100 rounded px-2 py-1 text-xs"
            >
                <option value="none">Ingen sortering</option>
                <option value="dateOfBirth">Fødselsdato</option>
                <option value="race">Race</option>
            </select>
            <button
                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                className="bg-zinc-700 text-zinc-100 rounded px-2 py-1 text-xs"
                disabled={sortBy === 'none'}
            >
                {sortOrder === 'asc' ? 'Stigende ↑' : 'Faldende ↓'}
            </button>
        </div>
    );

    // Content med kaniner
    const content = (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            {/* Debug info */}
            <div className="text-xs text-zinc-500 mb-4">
                Side {pagination.page} • Viser {sortedRabbits.length} ud af {rabbits.length} kaniner
            </div>
            {sortControls}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedRabbits.map((rabbit) => (
                    <RabbitPreviewCard
                        key={rabbit.earCombId}
                        rabbit={rabbit}
                        onClick={() => router.push(ROUTES.ACCOUNT.RABBIT_PROFILE(rabbit.earCombId))}
                    />
                ))}

                {sortedRabbits.length === 0 && (
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