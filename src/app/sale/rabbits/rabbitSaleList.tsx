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
            <div className="rabbit-card-grid">
                {rabbits.map((rabbit) => (
                    <RabbitForsaleCard 
                        key={rabbit.earCombId} 
                        rabbit={rabbit}
                        onClick={() => handleCardClick(rabbit.earCombId)}
                    />
                ))}
            </div>
        </>
    );
}