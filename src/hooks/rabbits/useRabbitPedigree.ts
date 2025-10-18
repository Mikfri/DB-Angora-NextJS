// src/hooks/rabbits/useRabbitPedigree.ts
import { useCallback, useEffect, useState } from 'react';
import { PedigreeResultDTO } from '@/api/types/AngoraDTOs';
import { getRabbitPedigree } from '@/app/actions/rabbit/rabbitCrudActions';

export function useRabbitPedigree(earCombId: string, maxGeneration: number = 4) {
  const [pedigreeResult, setPedigreeResult] = useState<PedigreeResultDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPedigree = useCallback(async () => {
    if (!earCombId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getRabbitPedigree(earCombId, maxGeneration);
      
      if (result.success) {
        setPedigreeResult(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Der opstod en fejl ved indlæsning af stamtavlen');
      console.error('Pedigree fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [earCombId, maxGeneration]);

  useEffect(() => {
    fetchPedigree();
  }, [fetchPedigree]);

  return {
    pedigreeResult,
    isLoading,
    error,
    refreshPedigree: fetchPedigree
  };
}