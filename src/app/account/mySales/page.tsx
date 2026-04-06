// src/app/account/mySales/page.tsx

/**
 * Siden for brugerens annoncer (kaniner, uld, garn, skind...).
 * - Viser liste over brugerens aktive annoncer (kaniner til salg, uld, garn, skind osv.).
 * - OBS: Bevidst client-side da denne side ligger låst bag login og ikke har SEO-krav.
 * - Fremtidig udvidelse: Kan tilføje faner/sektioner for forskellige annonce-typer (kaniner, uld, garn, skind).
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner, Button } from '@heroui/react';
import SalesOwnList from './salesOwnList';
import { SaleDetailsPrivateCardDTO } from '@/api/types/AngoraDTOs';
import { getSaleItemsByTargetedUserId } from '@/app/actions/sales/salesManagementAcions';
import { useAuthStore } from '@/store/authStore';
import { useUserAccountProfileStore } from '@/store/userAccountProfileStore';
import { ROUTES } from '@/constants/navigationConstants';

const DEFAULT_PAGE_SIZE = 12;

export default function AccountAnnouncementsPage() {
  const router = useRouter();

  const { userIdentity, isLoading: authLoading } = useAuthStore();
  const breederAccount = useUserAccountProfileStore(state => state.breederAccount);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<SaleDetailsPrivateCardDTO[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const breederRegNo = breederAccount?.breederRegNo ?? null;
  const targetedUserId = userIdentity?.id ?? '';

  const hasBreederAccess = useMemo(() => {
    return !!targetedUserId || !!breederRegNo;
  }, [targetedUserId, breederRegNo]);

  const loadMySales = useCallback(async () => {
    if (!targetedUserId) {
      setItems([]);
      setError('Bruger-id ikke fundet. Log ind igen eller opdatér din profil.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getSaleItemsByTargetedUserId(targetedUserId, page, DEFAULT_PAGE_SIZE);
      if (result.success) {
        setItems(result.data.data);
        setTotalPages(result.data.totalPages || 1);
      } else {
        setError(result.error || 'Der opstod en fejl ved indlæsning af annoncer.');
      }
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Der opstod en ukendt fejl.');
    } finally {
      setIsLoading(false);
    }
  }, [targetedUserId, page]);

  useEffect(() => {
    if (!authLoading && hasBreederAccess) {
      loadMySales();
    }
  }, [authLoading, hasBreederAccess, loadMySales]);

  const handleCardClick = useCallback((item: SaleDetailsPrivateCardDTO) => {
    router.push(`${ROUTES.ACCOUNT.MY_SALES}/${item.entityType.toLowerCase()}/${item.id}`);
  }, [router]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[45vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!hasBreederAccess) {
    return (
      <div className="main-content-container"> 
        <h1 className="site-title">Mine annoncer</h1>
        <p className="text-zinc-400 mb-4">Du skal have en aktiv avlerkonto for at se og administrere dine annoncer.</p>
        <Button color="primary" onPress={() => router.push(ROUTES.ACCOUNT.PROFILE)}>Gå til profil</Button>
      </div>
    );
  }

  return (
    <div className="main-content-container">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="site-title">Mine annoncer</h1>
          <p className="text-zinc-400">Her kan du se dine seneste salgsannoncer og klikke videre for at redigere eller lukke dem.</p>
        </div>
        <Button color="primary" onPress={() => router.push(ROUTES.ACCOUNT.MY_RABBITS)}>Opret ny annonce</Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-200">{error}</div>
      )}

      <SalesOwnList
        items={items}
        page={page}
        totalPages={totalPages}
        onCardClick={handleCardClick}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}

