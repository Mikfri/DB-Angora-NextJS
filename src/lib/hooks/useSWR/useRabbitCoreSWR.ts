// src/lib/hooks/useSWR/useRabbitCoreSWR.ts
// ANSVAR: Base fetchers og simple data hooks uden UI
import useSWR from 'swr';
// Fjern ubrugte imports
import { 
  Rabbit_ProfileDTO,
  Rabbit_PreviewDTO 
} from '@/api/types/AngoraDTOs';
import { useAuthStore } from '@/store/authStore';

// Base fetcher funktioner
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching data.');
  }
  return res.json();
};

export const protectedFetcher = async (url: string) => {
  // Brug authStore direkte her
  const accessToken = await useAuthStore.getState().getAccessToken();
  if (!accessToken) throw new Error('Not authenticated');
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  
  if (!res.ok) {
    throw new Error('An error occurred while fetching data.');
  }
  
  return res.json();
};

// Type-sikker query string builder for alle filter typer
export function buildQueryString<T>(filters?: T): string {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  
  // Sikkert at bruge på ethvert objekt
  Object.entries(filters as object).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  
  return params.toString() ? `?${params.toString()}` : '';
}


export function useRabbitProfile(earCombId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Rabbit_ProfileDTO>(
    earCombId ? `/api/rabbits/profile/${earCombId}` : null,
    protectedFetcher,
    { revalidateOnFocus: false }
  );

  return { rabbit: data, isLoading, error, refresh: mutate };
}

// Fix: Fjern 'any' og brug en generisk type for stærkere typechecking
export function useRabbitList<T = Rabbit_PreviewDTO[]>(
  endpoint: string, 
  filters?: Record<string, unknown>
) {
  const queryString = buildQueryString(filters);
  
  // Fix: Vælg den rigtige fetcher baseret på endpoint
  const fetcherFn = endpoint.startsWith('/api/account') ? protectedFetcher : fetcher;
  
  const { data, error, isLoading, mutate } = useSWR<T>(
    `${endpoint}${queryString}`,
    fetcherFn,
    { revalidateOnFocus: false }
  );

  return { 
    rabbits: data || ([] as unknown as T),  // Fix: Typesikker fallback
    isLoading, 
    error, 
    refresh: mutate 
  };
}

// BEMÆRK: Uden UI-specifikke hooks, kun data hentning