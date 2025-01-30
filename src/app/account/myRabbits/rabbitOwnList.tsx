// src/app/account/myRabbits/rabbitOwnList.tsx
'use client';
import { Rabbit_PreviewDTO } from '@/Types/AngoraDTOs';
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
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRabbits.map((rabbit) => (
                        <RabbitPreviewCard
                            key={rabbit.earCombId}
                            rabbit={rabbit}
                            onClick={() => router.push(`/account/myRabbits/rabbitProfile/${rabbit.earCombId}`)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}