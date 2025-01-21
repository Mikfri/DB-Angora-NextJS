// src/app/account/rabbitsForbreeding/rabbitsBreedingList.tsx
'use client';
import { useRouter } from 'next/navigation';
import BreedingNav from '@/components/sectionNav/variants/rabbitBreedingNav';
import RabbitForbreedingCard from '@/components/cards/rabbitForbreedingCard';
import { useBreedingRabbits } from '@/hooks/rabbits/useRabbitBreedingFilter';
import { Rabbit_ForbreedingPreviewDTO } from '@/Types/backendTypes';

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
            <div className="rabbit-card-grid">
                {filteredRabbits.map((rabbit) => (
                    <RabbitForbreedingCard
                        key={rabbit.earCombId}
                        rabbit={rabbit}
                        onClick={() => router.push(`/account/rabbitsForbreeding/profile/${rabbit.earCombId}`)}
                    />
                ))}
            </div>
        </>
    );
}