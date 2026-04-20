// src/app/annoncer/garn/yarnSaleList.tsx
'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SaleDetailsCard from '@/components/cards/saleDetailsCard';
import { SaleDetailsPublicCardDTO } from '@/api/types/AngoraDTOs';
import { Button } from '@heroui/react';
import { ROUTES } from '@/constants/navigationConstants';

interface PagingInfo {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface Props {
    items: SaleDetailsPublicCardDTO[];
    paging?: PagingInfo;
}

export default function YarnSaleList({ items, paging }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleCardClick = useCallback((item: SaleDetailsPublicCardDTO) => {
        router.push(ROUTES.SALE.SALEPROFILE(item.slug));
    }, [router]);

    const handlePageChange = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('Page', page.toString());
        router.push(`${ROUTES.SALE.YARN}?${params.toString()}`);
    }, [router, searchParams]);

    if (items.length === 0) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center py-16">
                <h2 className="text-2xl font-bold text-zinc-200 mb-2">
                    Ingen garn matcher din søgning
                </h2>
                <p className="text-zinc-400 mb-6">
                    Prøv at ændre dine filtre for at se flere resultater
                </p>
                <Button
                    variant="primary"
                    onPress={() => router.push(ROUTES.SALE.YARN)}
                >
                    Vis alt garn
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="main-content-container">
                {paging && (
                    <div className="text-xs text-zinc-500 mb-4">
                        Side {paging.currentPage} • Viser {items.length} ud af {paging.totalCount} annoncer
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <SaleDetailsCard
                            key={`${item.entityType}-${item.slug}`}
                            item={item}
                            onClick={() => handleCardClick(item)}
                        />
                    ))}
                </div>
            </div>

            {paging && paging.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-4">
                    <Button
                        variant="outline"
                        isDisabled={!paging.hasPreviousPage}
                        onPress={() => handlePageChange(paging.currentPage - 1)}
                    >
                        Forrige
                    </Button>
                    <span className="text-zinc-400 text-sm">
                        Side {paging.currentPage} / {paging.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        isDisabled={!paging.hasNextPage}
                        onPress={() => handlePageChange(paging.currentPage + 1)}
                    >
                        Næste
                    </Button>
                </div>
            )}
        </div>
    );
}
