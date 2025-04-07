'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Rabbit_ForbreedingPreviewDTO } from '@/api/types/AngoraDTOs';
import RabbitForbreedingCard from '@/components/cards/rabbitForbreedingCard';

type Props = {
    rabbits: Rabbit_ForbreedingPreviewDTO[];
};

export default function RabbitBreedingList({ rabbits }: Props) {
    const router = useRouter();

    // Card click handler
    const handleCardClick = useCallback((earCombId: string) => {
        router.push(`/account/rabbitsForbreeding/profile/${earCombId}`);
    }, [router]);

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rabbits.map((rabbit) => (
                    <RabbitForbreedingCard
                        key={rabbit.earCombId}
                        rabbit={rabbit}
                        onClick={() => handleCardClick(rabbit.earCombId)}
                    />
                ))}
                
                {rabbits.length === 0 && (
                    <div className="col-span-3 py-10 text-center">
                        <h3 className="text-xl text-zinc-300 mb-2">Ingen kaniner matcher dine filterkriterier</h3>
                        <p className="text-zinc-400">Prøv at ændre dine filtre eller nulstil dem for at se flere resultater.</p>
                    </div>
                )}
            </div>
        </div>
    );
}