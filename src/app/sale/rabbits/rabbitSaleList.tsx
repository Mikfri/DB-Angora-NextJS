// src/app/sale/rabbits/rabbitSaleList.tsx
'use client'
import { useNav } from "@/components/Providers";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import ForSaleNav from '@/components/sectionNav/variants/rabbitSaleNav';
import RabbitForsaleCard from '@/components/cards/rabbitForsaleCard';
import { Rabbits_SaleDetailsPreviewList } from '@/api/types/AngoraDTOs';
import { ForSaleFilters } from '@/api/types/filterTypes';
import MyNav from "@/components/sectionNav/variants/myNav";
import { useRabbitsForSale } from "@/lib/hooks/useSWR/useRabbitForsaleSWR";
import { Skeleton } from "@heroui/react";

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
    const { rabbits, filters, updateFilters, isLoading } = useRabbitsForSale(initialData, initialFilters);

    // Stabil callback for card click - undgår genskabelse ved hver render
    const handleCardClick = useCallback((earCombId: string) => {
        router.push(`/sale/rabbits/profile/${earCombId}`);
    }, [router]);

    // Memoize primary nav component with unique key
    const primaryNav = useMemo(() => (
        <ForSaleNav
            key="forsale-nav"
            activeFilters={filters}
            onFilterChange={updateFilters}
        />
    ), [filters, updateFilters]);

    // Memoize secondary nav with unique key
    const secondaryNav = useMemo(() => (
        <MyNav key="secondary-nav" />
    ), []);

    // Set up both navigations with clear dependencies
    useEffect(() => {
        setPrimaryNav(primaryNav);
        
        // Only set secondary nav if showSecondaryNav is true
        if (showSecondaryNav) {
            setSecondaryNav(secondaryNav);
        } else {
            // Ensure we clear secondary nav when not needed
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

    // Results state
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
    // return (
    //     <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
    //         <div className="grid grid-template-columns-responsive gap-6">
    //             {rabbits.map((rabbit) => (
    //                 <div key={rabbit.earCombId} className="min-w-[300px] w-full">
    //                     <RabbitForsaleCard 
    //                         rabbit={rabbit} 
    //                         onClick={() => handleCardClick(rabbit.earCombId)} 
    //                     />
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );
}