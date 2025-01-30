// src/app/account/rabbitsForbreeding/rabbitsBreedingList.tsx
'use client';
import { useRouter } from 'next/navigation';
import BreedingNav from '@/components/sectionNav/variants/rabbitBreedingNav';
import RabbitForbreedingCard from '@/components/cards/rabbitForbreedingCard';
import { useBreedingRabbits } from '@/hooks/rabbits/useRabbitBreedingFilter';
import { Rabbit_ForbreedingPreviewDTO } from '@/Types/AngoraDTOs';

type Props = {
    rabbits: Rabbit_ForbreedingPreviewDTO[];
};

export default function RabbitBreedingList({ rabbits }: Props) {
    const router = useRouter();
    const { filteredRabbits, filters, setFilters } = useBreedingRabbits(rabbits);

    return (
        <>
            <BreedingNav
                activeFilters={filters}
                onFilterChange={(newFilters) => 
                    setFilters(prev => ({ ...prev, ...newFilters }))
                }
            />
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRabbits.map((rabbit) => (
                        <RabbitForbreedingCard
                            key={rabbit.earCombId}
                            rabbit={rabbit}
                            onClick={() => router.push(`/account/rabbitsForbreeding/profile/${rabbit.earCombId}`)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}