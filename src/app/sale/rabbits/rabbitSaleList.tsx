// src/app/sale/rabbits/rabbitSaleProfile.tsx
'use client'
import { useRouter } from 'next/navigation';
import { useFilteredRabbits } from '@/hooks/rabbits/useRabbitForsaleFilter';
import ForSaleNav from '@/components/sectionNav/variants/rabbitSaleNav';
import RabbitForsaleCard from '@/components/cards/rabbitForsaleCard';

export default function RabbitsForSalePage() {
    const router = useRouter();
    const { rabbits, filters, isLoading, updateFilters } = useFilteredRabbits();

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