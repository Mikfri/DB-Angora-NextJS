// src/app/sale/rabbits/rabbitSaleList.tsx
'use client'
import { useCallback } from "react";
import { useRouter } from 'next/navigation';
import RabbitForsaleCard from '@/components/cards/rabbitForsaleCard';
import { Rabbits_SaleDetailsPreviewList } from '@/api/types/AngoraDTOs';

interface Props {
    rabbits: Rabbits_SaleDetailsPreviewList;
}

export default function RabbitsForSale({
    rabbits,
}: Props) {
    const router = useRouter();

    // Klik-handler til kort
    const handleCardClick = useCallback((earCombId: string) => {
        router.push(`/sale/rabbits/profile/${earCombId}`);
    }, [router]);

    // Vis tom tilstand
    if (rabbits.length === 0) {
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

    // Primær UI - grid layout for kaniner
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