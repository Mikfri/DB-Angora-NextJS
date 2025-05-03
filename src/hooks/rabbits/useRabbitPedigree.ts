// src/hooks/rabbits/useRabbitPedigree.ts
import { useCallback, useEffect, useState } from 'react';
import { Rabbit_PedigreeDTO } from '@/api/types/AngoraDTOs';
import { getRabbitPedigree } from '@/app/actions/rabbit/pedigree';

export function useRabbitPedigree(earCombId: string) {
  const [pedigree, setPedigree] = useState<Rabbit_PedigreeDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPedigree = useCallback(async () => {
    if (!earCombId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getRabbitPedigree(earCombId);
      
      if (result.success) {
        setPedigree(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Der opstod en fejl ved indlæsning af stamtavlen');
      console.error('Pedigree fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [earCombId]);

  useEffect(() => {
    fetchPedigree();
  }, [fetchPedigree]);

  return {
    pedigree,
    isLoading,
    error,
    refreshPedigree: fetchPedigree
  };
}