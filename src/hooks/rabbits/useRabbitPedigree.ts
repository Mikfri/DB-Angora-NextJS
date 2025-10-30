// src/hooks/rabbits/useRabbitPedigree.ts

import { useState, useEffect, useCallback } from 'react';
import { getRabbitPedigree } from '@/app/actions/rabbit/rabbitCrudActions';
import type { PedigreeResultDTO } from '@/api/types/AngoraDTOs';

export function useRabbitPedigree(earCombId: string, maxGenerations: number = 4) {
  const [pedigreeResult, setPedigreeResult] = useState<PedigreeResultDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPedigree = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await getRabbitPedigree(earCombId, maxGenerations);

    if (result.success) {
      setPedigreeResult(result.data);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }, [earCombId, maxGenerations]);

  useEffect(() => {
    if (earCombId) {
      fetchPedigree();
    }
  }, [earCombId, maxGenerations, fetchPedigree]);

  return {
    pedigreeResult,
    isLoading,
    error,
    refreshPedigree: fetchPedigree
  };
}