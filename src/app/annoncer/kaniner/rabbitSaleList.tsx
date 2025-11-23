// src/app/annoncer/kaniner/rabbitSaleList.tsx
'use client'
import { useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import SaleDetailsCard from '@/components/cards/saleDetailsCard';
import { SaleDetailsCardDTO } from '@/api/types/AngoraDTOs';
import { Button, Pagination } from "@heroui/react";
import { ROUTES } from '@/constants/navigationConstants';

// Interface for pagineringsinfo
interface PagingInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface Props {
  items: SaleDetailsCardDTO[];
  paging?: PagingInfo;
}

export default function SaleList({
  items,
  paging
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Opdateret klik-handler til kort - bruger korrekte ROUTES konstanter
  const handleCardClick = useCallback((item: SaleDetailsCardDTO) => {
    if (item.slug) {
      switch (item.entityType.toLowerCase()) {
        case 'rabbit':
          router.push(ROUTES.SALE.RABBIT(item.slug));
          break;
        case 'wool':
          router.push(ROUTES.SALE.WOOL(item.slug));
          break;
        default:
          router.push(`${ROUTES.SALE.BASE}/${item.entityType.toLowerCase()}/${item.slug}`);
          break;
      }
    } else {
      switch (item.entityType.toLowerCase()) {
        case 'rabbit':
          router.push(ROUTES.SALE.RABBIT_PROFILE(item.entityId));
          break;
        case 'wool':
          router.push(ROUTES.SALE.WOOL_PROFILE(item.entityId));
          break;
        default:
          router.push(`${ROUTES.SALE.BASE}/${item.entityType.toLowerCase()}/profile/${item.entityId}`);
          break;
      }
    }
  }, [router]);

  // Håndterer skift af side - bruger ROUTES konstant
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('Page', page.toString());
    router.push(`${ROUTES.SALE.RABBITS}?${params.toString()}`);
  }, [router, searchParams]);

  // Vis tom tilstand
  if (items.length === 0) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center py-16">
        <h2 className="text-2xl font-bold text-zinc-200 mb-2">
          Ingen kaniner matcher din søgning
        </h2>
        <p className="text-zinc-400 mb-6">
          Prøv at ændre dine filtre for at se flere resultater
        </p>
        <Button
          color="primary"
          onPress={() => router.push(ROUTES.SALE.RABBITS)}
        >
          Vis alle kaniner
        </Button>
      </div>
    );
  }

  // Primær UI - grid layout for salgsobjekter
  return (
    <div className="space-y-6">
      <div className="main-content-container">
        {/* Sideinfo og antal */}
        {paging && (
          <div className="text-xs text-zinc-500 mb-4">
            Side {paging.currentPage} • Viser {items.length} ud af {paging.totalCount} kaniner
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <SaleDetailsCard
              key={`${item.entityType}-${item.entityId}`}
              item={item}
              onClick={() => handleCardClick(item)}
            />
          ))}
        </div>
      </div>

      {/* Vis paginering hvis der er flere sider */}
      {paging && paging.totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination
            total={paging.totalPages}
            initialPage={paging.currentPage}
            onChange={handlePageChange}
            showControls
            color="primary"
            className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-2"
          />
        </div>
      )}
    </div>
  );
}