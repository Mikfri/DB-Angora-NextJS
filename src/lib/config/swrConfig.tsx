// src/lib/config/swrConfig.ts - Opret denne nye fil
'use client'

import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

export const swrOptions = {
  // Grundlæggende indstillinger
  fetcher: (url: string) => fetch(url).then(res => {
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }),
  dedupingInterval: 10000,
  revalidateOnFocus: false, 
  
  // Next.js 15+ optimeringer
  keepPreviousData: true,  // Bevar tidligere data mens ny data indlæses
  suspense: false,         // Sæt til true hvis du vil bruge React Suspense med SWR
  
  // Fejlhåndtering
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  
  // Tilpasset revalidering strategi
  revalidateIfStale: true,
  revalidateOnReconnect: true,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0    // 0 for ingen auto-refresh, eller millisekunder
};

export function SWRProvider({ children }: { children: ReactNode }) {
  return <SWRConfig value={swrOptions}>{children}</SWRConfig>;
}