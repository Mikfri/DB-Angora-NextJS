// src/app/annoncer/kaniner/rabbitSaleList.tsx
'use client'
import { useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import SaleDetailsCard from '@/components/cards/saleDetailsCard';
import { SaleDetailsCardDTO } from '@/api/types/AngoraDTOs';
import { Button, Pagination } from "@heroui/react";
import { ROUTES } from '@/constants/navigation';

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
    // Brug slug hvis tilgængelig (foretrukken metode)
    if (item.slug) {
      switch (item.entityType.toLowerCase()) {
        case 'rabbit':
          router.push(ROUTES.PROFILES.RABBIT(item.slug));
          break;
        case 'wool':
          router.push(ROUTES.PROFILES.WOOL(item.slug));
          break;
        default:
          // Fallback for ukendte typer
          router.push(`${ROUTES.SALE.BASE}/${item.entityType.toLowerCase()}/${item.slug}`);
          break;
      }
    } else {
      // Fallback til traditionelle profile routes med entityId
      switch (item.entityType.toLowerCase()) {
        case 'rabbit':
          router.push(ROUTES.PROFILES.RABBIT_PROFILE(item.entityId));
          break;
        case 'wool':
          router.push(ROUTES.PROFILES.WOOL_PROFILE(item.entityId));
          break;
        default:
          // Ultimate fallback for ukendte typer
          router.push(`${ROUTES.SALE.BASE}/${item.entityType.toLowerCase()}/profile/${item.entityId}`);
          break;
      }
    }
  }, [router]);

  // Håndterer skift af side - bruger ROUTES konstant
  const handlePageChange = useCallback((page: number) => {
    // Opret en ny URLSearchParams instans baseret på de nuværende parametre
    const params = new URLSearchParams(searchParams.toString());

    // Opdater page parameter
    params.set('Page', page.toString());

    // Naviger til den nye URL med opdaterede søgeparametre - bruger ROUTES konstant
    router.push(`${ROUTES.SALE.RABBITS}?${params.toString()}`);
  }, [router, searchParams]);

  // Vis tom tilstand - bruger ROUTES konstant
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
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
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