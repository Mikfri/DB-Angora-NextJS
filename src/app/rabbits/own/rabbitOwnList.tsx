// src/app/rabbits/own/rabbitOwnList.tsx
'use client';
import { Rabbit_PreviewDTO } from '@/types/backendTypes';
import { useRouter } from 'next/navigation';
import OwnNav from '@/components/sectionNav/variants/rabbitOwnNav';
import { useOwnRabbits } from '@/hooks/rabbits/useRabbitOwnFilter';
import RabbitPreviewCard from '@/components/cards/rabbitPreviewCard';

type Props = {
    rabbits: Rabbit_PreviewDTO[];
};

export default function RabbitOwnList({ rabbits }: Props) {
    const router = useRouter();
    const { filteredRabbits, filters, setFilters } = useOwnRabbits(rabbits);

    return (
        <>
            <OwnNav
                activeFilters={filters}
                onFilterChange={(newFilters) => 
                    setFilters(prev => ({ ...prev, ...newFilters }))
                }
            />
            <div className="rabbit-card-grid">
                {filteredRabbits.map((rabbit) => (
                    <RabbitPreviewCard
                        key={rabbit.earCombId}
                        rabbit={rabbit}
                        onClick={() => router.push(`/rabbits/profile/${rabbit.earCombId}`)}
                    />
                ))}
            </div>
        </>
    );
}