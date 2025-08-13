'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import RabbitOwnNav from '@/components/nav/side/index/RabbitOwnNav';
import RabbitPreviewCard from '@/components/cards/rabbitPreviewCard';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import { useRabbitsOwnedStore } from '@/store/rabbitsOwnedStore';
import { ROUTES } from '@/constants/navigation';

export default function RabbitOwnList({ userId }: { userId: string }) {
    const router = useRouter();
    const { fetchRabbits, rabbits, filteredRabbits, pagination, resetFilters, changePage, isLoading, error } = useRabbitsOwnedStore();

    // Hent kaniner for userId ved mount og når userId ændrer sig
    useEffect(() => {
        if (userId) fetchRabbits(1, userId);
    }, [fetchRabbits, userId]);

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

    // Loading og fejl
    if (isLoading && rabbits.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                    <p className="text-zinc-300">Indlæser dine kaniner...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Content med kaniner
    const content = (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
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

    // Pagineringskontrol
    const paginationControls = pagination.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-zinc-400">
                Viser side {pagination.page} af {pagination.totalPages} 
                ({pagination.totalCount} kaniner i alt)
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => changePage(1)}
                    disabled={!pagination.hasPreviousPage || isLoading}
                    className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50"
                >
                    «
                </button>
                <button
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage || isLoading}
                    className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50"
                >
                    ‹
                </button>
                <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(pageNum => 
                            pageNum === 1 || 
                            pageNum === pagination.totalPages || 
                            Math.abs(pageNum - pagination.page) <= 1
                        )
                        .map((pageNum, index, arr) => {
                            const showEllipsisBefore = index > 0 && arr[index - 1] !== pageNum - 1;
                            return (
                                <div key={pageNum} className="flex">
                                    {showEllipsisBefore && <span className="px-3 py-1">...</span>}
                                    <button
                                        onClick={() => changePage(pageNum)}
                                        disabled={isLoading}
                                        className={`px-3 py-1 rounded min-w-[2.5rem] ${
                                            pageNum === pagination.page
                                                ? "bg-primary text-white"
                                                : "bg-zinc-700 hover:bg-zinc-600"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                </div>
                            );
                        })}
                </div>
                <button
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={!pagination.hasNextPage || isLoading}
                    className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50"
                >
                    ›
                </button>
                <button
                    onClick={() => changePage(pagination.totalPages)}
                    disabled={!pagination.hasNextPage || isLoading}
                    className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50"
                >
                    » 
                </button>
            </div>
        </div>
    );

    // Wrap alt i SideNavLayout
    return (
        <SideNavLayout sideNav={navElement}>
            {content}
            {paginationControls}
        </SideNavLayout>
    );
}