// src/app/sale/rabbits/rabbitSaleList.tsx
'use client'
import { useCallback } from "react";
import { useRouter } from 'next/navigation';
import SaleDetailsCard from '@/components/cards/saleDetailsCard';
import { SaleDetailsCardList } from '@/api/types/AngoraDTOs';

interface Props {
    items: SaleDetailsCardList;
}

export default function SaleList({
    items,
}: Props) {
    const router = useRouter();

    // Klik-handler til kort
    const handleCardClick = useCallback((entityType: string, entityId: string) => {
        // Redirect baseret på entity type
        switch(entityType.toLowerCase()) {
            case 'rabbit':
                router.push(`/sale/rabbits/profile/${entityId}`);
                break;
            case 'wool':
                router.push(`/sale/wool/profile/${entityId}`);
                break;
            default:
                router.push(`/sale/${entityType.toLowerCase()}/profile/${entityId}`);
                break;
        }
    }, [router]);

    // Vis tom tilstand
    if (items.length === 0) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center py-16">
                <h2 className="text-2xl font-bold text-zinc-200 mb-2">
                    Ingen objekter matcher din søgning
                </h2>
                <p className="text-zinc-400">
                    Prøv at ændre dine filtre for at se flere resultater
                </p>
            </div>
        );
    }

    // Primær UI - grid layout for salgsobjekter
    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                    <SaleDetailsCard
                        key={`${item.entityType}-${item.entityId}`}
                        item={item}
                        onClick={() => handleCardClick(item.entityType, item.entityId)}
                    />
                ))}
            </div>
        </div>
    );
}