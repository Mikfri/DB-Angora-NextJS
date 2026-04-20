// src/hooks/transferRequests/useTransferRequest.ts

import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  respondToTransferRequest,
  deleteTransferRequest,
  getPendingTransferRequestCount,
  getTransferRequestsReceived,
  getTransferRequestsIssued
} from '@/app/actions/transfers/transferRequestsActions';
import { TransferRequestPreviewDTO, TransferRequestPreviewFilterDTO } from '@/api/types/AngoraDTOs';

export function useTransferRequests() {
  const { data: session } = useSession();
  const [received, setReceived] = useState<TransferRequestPreviewDTO[]>([]);
  const [sent, setSent] = useState<TransferRequestPreviewDTO[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (filter?: TransferRequestPreviewFilterDTO) => {
    const userId = session?.userIdentity?.id;
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const [rec, sent] = await Promise.all([
        getTransferRequestsReceived(userId, filter),
        getTransferRequestsIssued(userId, filter)
      ]);
      if (rec.success && sent.success) {
        setReceived(rec.data.data);
        setSent(sent.data.data);
      } else {
        setError((!rec.success ? rec.error : null) || (!sent.success ? sent.error : null) || 'Ukendt fejl');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ukendt fejl');
    } finally {
      setIsLoading(false);
    }
  }, [session?.userIdentity?.id]);

  const loadPendingCount = useCallback(async () => {
    const userId = session?.userIdentity?.id;
    if (!userId) return;

    const result = await getPendingTransferRequestCount(userId);
    if (result.success) {
      setPendingCount(result.count);
    }
  }, [session?.userIdentity?.id]);

  const respond = useCallback(async (id: number, accept: boolean) => {
    return respondToTransferRequest(id, accept);
  }, []);

  const remove = useCallback(async (id: number) => {
    return deleteTransferRequest(id);
  }, []);

  return { received, sent, pendingCount, isLoading, error, load, loadPendingCount, respond, remove };
}
