// src/app/sale/rabbits/rabbitSaleList.tsx
'use client'

import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import RabbitForsaleCard from '@/components/cards/rabbitForsaleCard';
import { Rabbits_SaleDetailsPreviewList } from '@/api/types/AngoraDTOs';
import { getRabbitsForSale, ForSaleParams } from "@/app/actions/rabbit/forsale";
import { Skeleton } from "@heroui/react";

// Cache med Map for bedre type sikkerhed og performance
const filterCache = new Map<string, Rabbits_SaleDetailsPreviewList>();

interface Props {
    rabbits: Rabbits_SaleDetailsPreviewList;
}

export default function RabbitsForSale({
    rabbits: initialRabbits,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Fjernet den ubrugte filters state
    const [rabbits, setRabbits] = useState<Rabbits_SaleDetailsPreviewList>(initialRabbits);
    const [isLoading, setIsLoading] = useState(false);

    // Lyt efter URL-ændringer og opdater data
    useEffect(() => {
        const updateFromUrl = async () => {
            // Tag kun aktionen hvis der er søgeparametre
            if (searchParams.size > 0) {
                // Konverter søgeparametre til et objekt
                const urlFilters = Object.fromEntries(
                    Array.from(searchParams.entries()).map(([key, value]) => {
                        // Konverter zipkoder til tal
                        if (key === 'MinZipCode' || key === 'MaxZipCode') {
                            return [key, value ? parseInt(value) : null];
                        }
                        return [key, value];
                    })
                );
                
                // Generer cache nøgle
                const cacheKey = JSON.stringify(urlFilters);
                
                // Tjek cache først
                if (filterCache.has(cacheKey)) {
                    setRabbits(filterCache.get(cacheKey)!);
                    return;
                }
                
                // Hent nye data hvis det er nødvendigt
                setIsLoading(true);
                
                try {
                    const result = await getRabbitsForSale(urlFilters as ForSaleParams);
                    
                    if (result.success) {
                        // Gemmer i cache
                        filterCache.set(cacheKey, result.data);
                        setRabbits(result.data);
                    }
                } catch (error) {
                    console.error('Fejl ved hentning af kaniner:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        
        updateFromUrl();
    }, [searchParams]);

    // Card click handler - nu mere optimeret
    const handleCardClick = useCallback((earCombId: string) => {
        router.push(`/sale/rabbits/profile/${earCombId}`);
    }, [router]);

    // Returner baseret på tilstand
    if (isLoading) return renderSkeleton();
    if (rabbits.length === 0) return renderEmptyState();

    // Render kaniner - nu med optimeret rendering
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

// UI-rendering funktioner 
function renderSkeleton() {
    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="w-[300px]">
                        <div className="rounded-xl overflow-hidden">
                            <Skeleton className="h-[240px] w-full" />
                            <div className="bg-zinc-700/90 p-4 space-y-2">
                                <Skeleton className="h-6 w-3/4 rounded-lg" />
                                <Skeleton className="h-4 w-1/2 rounded-lg" />
                                <div className="flex justify-between items-center pt-2">
                                    <Skeleton className="h-5 w-1/3 rounded-lg" />
                                    <Skeleton className="h-8 w-1/4 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderEmptyState() {
    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center py-16">
            <h2 className="text-2xl font-bold text-zinc-200 mb-2">
                Ingen kaniner matcher din søgning
            </h2>
            <p className="text-zinc-400">
                Prøv at ændre dine filtre for at se flere resultater
            </p>
        </div>
    );
}