// src/app/sale/rabbits/rabbitSaleList.tsx
'use client'

import { useNav } from "@/components/Providers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import ForSaleNav from '@/components/sectionNav/variants/rabbitSaleNav';
import RabbitForsaleCard from '@/components/cards/rabbitForsaleCard';
import { Rabbits_SaleDetailsPreviewList } from '@/api/types/AngoraDTOs';
import { ForSaleFilters } from '@/api/types/filterTypes';
import MyNav from "@/components/sectionNav/variants/myNav";
import { getRabbitsForSale, ForSaleParams } from "@/app/actions/rabbit/forsale";
import { Skeleton } from "@heroui/react";

// Simple cache object (uden for komponenten)
const filterCache: Record<string, Rabbits_SaleDetailsPreviewList> = {};

interface Props {
    rabbits: Rabbits_SaleDetailsPreviewList;
    initialFilters: ForSaleFilters;
    showSecondaryNav?: boolean;
}

export default function RabbitsForSale({
    rabbits: initialRabbits,
    initialFilters,
    showSecondaryNav = false
}: Props) {
    const { setPrimaryNav, setSecondaryNav } = useNav();
    const router = useRouter();
    
    // Local state for client-side updates
    const [rabbits, setRabbits] = useState(initialRabbits);
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    
    // Update filters and refetch data
    const updateFilters = useCallback(async (newFilters: Partial<ForSaleFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        
        // Update URL
        const params = new URLSearchParams();
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, String(value));
            }
        });
        
        const queryString = params.toString();
        const newPath = `/sale/rabbits${queryString ? `?${queryString}` : ''}`;
        
        // Update URL without page reload
        router.replace(newPath, { scroll: false });
        
        // Generate cache key
        const cacheKey = JSON.stringify(updatedFilters);
        
        // Check cache first
        if (filterCache[cacheKey]) {
            console.log("Using cached data for:", cacheKey);
            setRabbits(filterCache[cacheKey]);
            return;
        }
        
        // Fetch new data with Server Action
        setIsLoading(true);
        const result = await getRabbitsForSale(updatedFilters as ForSaleParams);
        setIsLoading(false);
        
        if (result.success) {
            // Store in cache
            filterCache[cacheKey] = result.data;
            setRabbits(result.data);
        }
    }, [filters, router]);
    
    // Card click handler
    const handleCardClick = useCallback((earCombId: string) => {
        router.push(`/sale/rabbits/profile/${earCombId}`);
    }, [router]);

    // Primary nav component
    const primaryNav = useMemo(() => (
        <ForSaleNav
            key="forsale-nav"
            activeFilters={filters}
            onFilterChange={updateFilters}
        />
    ), [filters, updateFilters]);

    // Secondary nav component
    const secondaryNav = useMemo(() => (
        <MyNav key="secondary-nav" />
    ), []);

    // Set up navigations
    useEffect(() => {
        setPrimaryNav(primaryNav);
        if (showSecondaryNav) {
            setSecondaryNav(secondaryNav);
        } else {
            setSecondaryNav(null);
        }
        
        return () => {
            setPrimaryNav(null);
            setSecondaryNav(null);
        };
    }, [primaryNav, secondaryNav, setPrimaryNav, setSecondaryNav, showSecondaryNav]);

    // Loading state with skeleton UI
    if (isLoading) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {[...Array(6)].map((_, idx) => (
                        <div key={`skeleton-${idx}`} className="w-[300px]">
                            <Skeleton className="rounded-lg">
                                <div className="h-[300px]"></div>
                            </Skeleton>
                            <div className="mt-4 space-y-3">
                                <Skeleton className="w-3/5 rounded-lg">
                                    <div className="h-4"></div>
                                </Skeleton>
                                <Skeleton className="w-4/5 rounded-lg">
                                    <div className="h-4"></div>
                                </Skeleton>
                                <Skeleton className="w-2/5 rounded-lg">
                                    <div className="h-4"></div>
                                </Skeleton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (rabbits.length === 0) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center py-16">
                <h2 className="text-2xl font-bold text-zinc-200 mb-2">Ingen kaniner matcher din søgning</h2>
                <p className="text-zinc-400">Prøv at ændre dine filtre for at se flere resultater</p>
            </div>
        );
    }

    // Render rabbits
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