'use client';

import { SaleDetailsPrivateCardDTO } from '@/api/types/AngoraDTOs';
import SaleOwnDetailsCard from '@/components/cards/saleOwnDetailsCard';
import { Button, Pagination } from '@/components/ui/heroui';
import { ROUTES } from '@/constants/navigationConstants';
import { useRouter } from 'next/navigation';

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
      <div className="rounded-xl border border-divider bg-surface-secondary p-6 text-center">
        <p className="text-foreground mb-2">Ingen annoncer matcher dit filter</p>
        <p className="text-muted mb-4">Prøv at vælge en anden statuskategori, eller opret en ny annonce.</p>
        <Button variant="primary" onPress={() => router.push(ROUTES.ACCOUNT.MY_RABBITS)}>Opret annonce</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {items.map((item, index) => (
          <SaleOwnDetailsCard
            key={`${item.entityType}-${item.slug}`}
            item={item}
            onClick={() => onCardClick(item)}
            priority={index === 0}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination size="sm">
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page <= 1}
                  onPress={() => onPageChange(page - 1)}
                >
                  <Pagination.PreviousIcon />
                </Pagination.Previous>
              </Pagination.Item>

              {getPageItems(page, totalPages).map((item, i) =>
                item === 'ellipsis' ? (
                  <Pagination.Item key={`ellipsis-${i}`}>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                ) : (
                  <Pagination.Item key={item}>
                    <Pagination.Link
                      isActive={item === page}
                      onPress={() => onPageChange(item)}
                    >
                      {item}
                    </Pagination.Link>
                  </Pagination.Item>
                )
              )}

              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page >= totalPages}
                  onPress={() => onPageChange(page + 1)}
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

