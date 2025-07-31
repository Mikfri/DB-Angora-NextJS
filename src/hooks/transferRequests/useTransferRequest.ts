// src/hooks/transferRequests/useTransferRequest.ts

import { useCallback, useState } from 'react';
import { getReceivedTransferRequests, getSentTransferRequests } from '@/app/actions/breederAccount/breederAccountActions';
import { respondToTransferRequest, deleteTransferRequest } from '@/app/actions/transfers/transferRequestsActions';
import { TransferRequestPreviewDTO, TransferRequestPreviewFilterDTO } from '@/api/types/AngoraDTOs';

export function useTransferRequests() {
  const [received, setReceived] = useState<TransferRequestPreviewDTO[]>([]);
  const [sent, setSent] = useState<TransferRequestPreviewDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (filter?: TransferRequestPreviewFilterDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const [rec, sent] = await Promise.all([
        getReceivedTransferRequests(filter),
        getSentTransferRequests(filter)
      ]);
      if (rec.success && sent.success) {
        setReceived(rec.data ?? []);
        setSent(sent.data ?? []);
      } else {
        setError(rec.error || sent.error || 'Ukendt fejl');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ukendt fejl');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const respond = useCallback(async (id: number, accept: boolean) => {
    return respondToTransferRequest(id, accept);
  }, []);

  const remove = useCallback(async (id: number) => {
    return deleteTransferRequest(id);
  }, []);

  return { received, sent, isLoading, error, load, respond, remove };
}