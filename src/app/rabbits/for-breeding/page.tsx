// app/rabbits/for-breeding/page.tsx
'use client';
import { GetRabbitsForBreeding } from '@/services/AngoraDbService'
import RabbitCard from '@/components/cards/rabbitForsaleCard';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Rabbit_PreviewDTO } from '@/types/backendTypes';

export default function ForBreedingPage() {
    const router = useRouter();
    const [rabbitsForBreeding, setRabbitsForBreeding] = useState<Rabbit_PreviewDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchRabbits = async () => {
            try {
                const result = await GetRabbitsForBreeding();
                setRabbitsForBreeding(result); // Direct array now
            } catch (error) {
                console.error('Failed to fetch rabbits:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchRabbits();
    }, []);

    const handleCardClick = (earCombId: string) => {
        router.push(`/rabbits/profile/${earCombId}`);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!rabbitsForBreeding.length) {
        return <div>Ingen kaniner til avl</div>;
    }

    return (
        <div className="rabbit-card-grid">
            {rabbitsForBreeding.map((rabbit) => (
                <RabbitCard 
                    key={rabbit.earCombId} 
                    rabbit={rabbit}
                    onClick={() => handleCardClick(rabbit.earCombId)}
                />
            ))}
        </div>
    );
}