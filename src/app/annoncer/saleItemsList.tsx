// src/app/annoncer/saleItemsList.tsx
'use client'

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SaleDetailsCard from '@/components/cards/saleDetailsCard';
import { SaleDetailsPublicCardDTO } from '@/api/types/AngoraDTOs';
import { Button, Pagination } from '@/components/ui/heroui';
import { ROUTES } from '@/constants/navigationConstants';

function getPageItems(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [1];
    if (current > 3) pages.push('ellipsis');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
    }
    if (current < total - 2) pages.push('ellipsis');
    pages.push(total);
    return pages;
}

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

export default function SaleItemsList({ items, paging }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleCardClick = useCallback((item: SaleDetailsPublicCardDTO) => {
        router.push(ROUTES.SALE.SALEPROFILE(item.slug));
    }, [router]);

    const handlePageChange = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('Page', page.toString());
        router.push(`${ROUTES.SALE.BASE}?${params.toString()}`);
    }, [router, searchParams]);

    if (items.length === 0) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center py-16">
                <h2 className="text-2xl font-bold text-zinc-200 mb-2">
                    Ingen annoncer matcher din søgning
                </h2>
                <p className="text-zinc-400 mb-6">
                    Prøv at ændre dine filtre for at se flere resultater
                </p>
                <Button
                    variant="primary"
                    onPress={() => router.push(ROUTES.SALE.BASE)}
                >
                    Vis alle annoncer
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="flex justify-center py-4">
                    <Pagination size="sm">
                        <Pagination.Content>
                            <Pagination.Item>
                                <Pagination.Previous
                                    isDisabled={!paging.hasPreviousPage}
                                    onPress={() => handlePageChange(paging.currentPage - 1)}
                                >
                                    <Pagination.PreviousIcon />
                                </Pagination.Previous>
                            </Pagination.Item>

                            {getPageItems(paging.currentPage, paging.totalPages).map((item, i) =>
                                item === 'ellipsis' ? (
                                    <Pagination.Item key={`ellipsis-${i}`}>
                                        <Pagination.Ellipsis />
                                    </Pagination.Item>
                                ) : (
                                    <Pagination.Item key={item}>
                                        <Pagination.Link
                                            isActive={item === paging.currentPage}
                                            onPress={() => handlePageChange(item)}
                                        >
                                            {item}
                                        </Pagination.Link>
                                    </Pagination.Item>
                                )
                            )}

                            <Pagination.Item>
                                <Pagination.Next
                                    isDisabled={!paging.hasNextPage}
                                    onPress={() => handlePageChange(paging.currentPage + 1)}
                                >
                                    <Pagination.NextIcon />
                                </Pagination.Next>
                            </Pagination.Item>
                        </Pagination.Content>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
