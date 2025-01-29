// src/app/sale/rabbits/rabbitSaleProfile.tsx
'use client'
import { useRouter } from 'next/navigation';
import ForSaleNav from '@/components/sectionNav/variants/rabbitSaleNav';
import RabbitForsaleCard from '@/components/cards/rabbitForsaleCard';
import { Rabbits_ForsalePreviewList } from '@/Types/backendTypes';
import { ForSaleFilters } from '@/Types/filterTypes';
import { useFilteredRabbits } from '@/hooks/rabbits/useRabbitForsaleFilter';

interface Props {
    initialData: Rabbits_ForsalePreviewList;
    initialFilters: ForSaleFilters;
}

export default function RabbitsForSale({ initialData, initialFilters }: Props) {
    const router = useRouter();
    const { rabbits, filters, updateFilters, isLoading } = useFilteredRabbits(initialData, initialFilters);

    const handleCardClick = (earCombId: string) => {
        router.push(`/sale/rabbits/profile/${earCombId}`);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ForSaleNav 
                activeFilters={filters} 
                onFilterChange={updateFilters} 
            />
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
        </>
    );
}