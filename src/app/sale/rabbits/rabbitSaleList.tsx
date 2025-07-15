// src/app/sale/rabbits/rabbitSaleList.tsx
'use client'
import { useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import SaleDetailsCard from '@/components/cards/saleDetailsCard';
import { SaleDetailsCardDTO } from '@/api/types/AngoraDTOs';
import { Button, Pagination } from "@heroui/react";

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

  // Håndterer skift af side
  const handlePageChange = useCallback((page: number) => {
    // Opret en ny URLSearchParams instans baseret på de nuværende parametre
    const params = new URLSearchParams(searchParams.toString());
    
    // Opdater page parameter
    params.set('Page', page.toString());
    
    // Naviger til den nye URL med opdaterede søgeparametre
    router.push(`/sale/rabbits?${params.toString()}`);
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
          onPress={() => router.push('/sale/rabbits')}
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
              onClick={() => handleCardClick(item.entityType, item.entityId)}
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