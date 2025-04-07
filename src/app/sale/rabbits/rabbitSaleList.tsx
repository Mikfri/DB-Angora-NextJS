// src/app/sale/rabbits/rabbitSaleList.tsx
'use client'

import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import RabbitForsaleCard from '@/components/cards/rabbitForsaleCard';
import { Rabbits_SaleDetailsPreviewList } from '@/api/types/AngoraDTOs';
import { getRabbitsForSale, ForSaleParams } from "@/app/actions/rabbit/forsale";
import { Skeleton } from "@heroui/react";

// Cache map for bedre performance
const filterCache = new Map<string, Rabbits_SaleDetailsPreviewList>();

interface Props {
    rabbits: Rabbits_SaleDetailsPreviewList;
}

export default function RabbitsForSale({
    rabbits: initialRabbits,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State declarations
    const [rabbits, setRabbits] = useState<Rabbits_SaleDetailsPreviewList>(initialRabbits);
    const [isLoading, setIsLoading] = useState(false);

    // URL parameter håndtering
    useEffect(() => {
        if (searchParams.size === 0) return;

        const updateFromUrl = async () => {
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
            
            const cacheKey = JSON.stringify(urlFilters);
            
            // Tjek cache først
            if (filterCache.has(cacheKey)) {
                setRabbits(filterCache.get(cacheKey)!);
                return;
            }
            
            // Hent nye data hvis nødvendigt
            setIsLoading(true);
            
            try {
                const result = await getRabbitsForSale(urlFilters as ForSaleParams);
                
                if (result.success) {
                    filterCache.set(cacheKey, result.data);
                    setRabbits(result.data);
                }
            } catch (error) {
                console.error('Fejl ved hentning af kaniner:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        updateFromUrl();
    }, [searchParams]);

    // Klik-handler til kort
    const handleCardClick = useCallback((earCombId: string) => {
        router.push(`/sale/rabbits/profile/${earCombId}`);
    }, [router]);

    // Visninger baseret på tilstand
    if (isLoading) return renderSkeleton();
    if (rabbits.length === 0) return renderEmptyState();

    // Primær UI - bruger NØJAGTIGT samme grid layout som RabbitOwnList
    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

// UI-hjælpefunktioner med samme layout som RabbitOwnList
const renderSkeleton = () => (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="max-w-sm rounded-xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="bg-zinc-800 p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4 rounded-lg" />
                        <Skeleton className="h-4 w-1/2 rounded-lg" />
                        <Skeleton className="h-4 w-2/3 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const renderEmptyState = () => (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center py-16">
        <h2 className="text-2xl font-bold text-zinc-200 mb-2">
            Ingen kaniner matcher din søgning
        </h2>
        <p className="text-zinc-400">
            Prøv at ændre dine filtre for at se flere resultater
        </p>
    </div>
);