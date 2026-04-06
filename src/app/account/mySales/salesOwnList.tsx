'use client';

import { SaleDetailsPrivateCardDTO } from '@/api/types/AngoraDTOs';
import SaleOwnDetailsCard from '@/components/cards/saleOwnDetailsCard';
import { Button } from '@heroui/react';
import { ROUTES } from '@/constants/navigationConstants';
import { useRouter } from 'next/navigation';

interface Props {
  items: SaleDetailsPrivateCardDTO[];
  page: number;
  totalPages: number;
  onCardClick: (item: SaleDetailsPrivateCardDTO) => void;
  onPageChange: (nextPage: number) => void;
}

export default function SalesOwnList({ items, page, totalPages, onCardClick, onPageChange }: Props) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/70 p-6 text-center">
        <p className="text-zinc-300 mb-2">Der er endnu ingen annoncer på din konto</p>
        <p className="text-zinc-500 mb-4">Begynd med at oprette dit første salgsopslag.</p>
        <Button color="primary" onPress={() => router.push(ROUTES.ACCOUNT.MY_RABBITS)}>Opret annonce</Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <SaleOwnDetailsCard
            key={`${item.entityType}-${item.slug}`}
            item={item}
            onClick={() => onCardClick(item)}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          <Button
            color="secondary"
            disabled={page <= 1}
            onPress={() => onPageChange(Math.max(page - 1, 1))}
          >Tilbage</Button>
          <div className="text-sm text-zinc-400">Side {page} af {totalPages}</div>
          <Button
            color="secondary"
            disabled={page >= totalPages}
            onPress={() => onPageChange(Math.min(page + 1, totalPages))}
          >Næste</Button>
        </div>
      )}
    </>
  );
}
