// src/app/account/mySales/page.tsx

/**
 * Siden for brugerens annoncer (kaniner, uld, garn, skind...).
 * - Viser liste over brugerens annoncer filtreret efter status-tab.
 * - CSR: Ingen SEO-krav — siden er låst bag login.
 * - Data hentes én gang via salesOwnedStore, filtrering sker lokalt.
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner, Button } from '@/components/ui/heroui';
import SalesOwnList from './salesOwnList';
import { SaleDetailsPrivateCardDTO } from '@/api/types/AngoraDTOs';
import { useAuthStore } from '@/store/authStore';
import { useSalesOwnedStore, SaleStatusFilter } from '@/store/salesOwnedStore';
import { ROUTES } from '@/constants/navigationConstants';
import Tabs, { TabItem } from '@/components/ui/custom/tabs/Tabs';

const STATUS_TABS: { key: SaleStatusFilter; label: string }[] = [
  { key: 'all',    label: 'Alle' },
  { key: 'Active', label: 'Aktive' },
  { key: 'OnHold', label: 'Inaktive' },
  { key: 'Sold',   label: 'Solgte' },
];

export default function AccountAnnouncementsPage() {
  const router = useRouter();
  const { userIdentity, isLoading: authLoading } = useAuthStore();

  const {
    filteredItems,
    statusFilter,
    pagination,
    isLoading,
    error,
    fetchItems,
    setStatusFilter,
    changePage,
    items,
  } = useSalesOwnedStore();

  const targetedUserId = userIdentity?.id ?? '';

  useEffect(() => {
    if (!authLoading && targetedUserId) {
      fetchItems(targetedUserId);
    }
  }, [authLoading, targetedUserId, fetchItems]);

  const handleCardClick = useCallback((item: SaleDetailsPrivateCardDTO) => {
    router.push(`${ROUTES.ACCOUNT.MY_SALES}/${item.entityType.toLowerCase()}/${item.id}`);
  }, [router]);

  const countFor = (key: SaleStatusFilter) =>
    key === 'all' ? items.length : items.filter((i) => i.status === key).length;

  // Byg pagineret slice til listen
  const { page, pageSize, totalPages } = pagination;
  const pagedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  // Bygger tabs
  const tabItems: TabItem[] = STATUS_TABS.map(({ key, label }) => {
    const count = countFor(key);
    return {
      key,
      label: count > 0 ? `${label} (${count})` : label,
      content: (
        <SalesOwnList
          items={pagedItems}
          page={page}
          totalPages={totalPages}
          onCardClick={handleCardClick}
          onPageChange={changePage}
        />
      ),
    };
  });

  if (authLoading || (isLoading && items.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[45vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!targetedUserId) {
    return (
      <div className="main-content-container">
        <h1 className="site-title">Mine annoncer</h1>
        <p className="text-muted mb-4">Du skal være logget ind for at se dine annoncer.</p>
        <Button variant="primary" onPress={() => router.push(ROUTES.ACCOUNT.PROFILE)}>Gå til profil</Button>
      </div>
    );
  }

  return (
    <div className="main-content-container">
      <div className="mb-6">
        <h1 className="site-title">Mine annoncer</h1>
        <p className="text-muted">Se og administrer dine salgsannoncer.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger">
          {error}
        </div>
      )}

      <Tabs
        items={tabItems}
        activeKey={statusFilter}
        onChange={(key) => setStatusFilter(key as SaleStatusFilter)}
        aria-label="Filtrer annoncer efter status"
      />
    </div>
  );
}

