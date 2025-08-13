// src/app/account/myRabbits/page.tsx
'use client';

/**
 * VIGTIG NOTE OM RENDERING:
 * ========================
 * Denne side bruger bevidst Client-Side Rendering (CSR) af følgende grunde:
 * 
 * 1. Siden er beskyttet bag login, så SEO er ikke relevant
 * 2. CSR løser problemer med cookies i statisk build proces
 * 3. Siden behøver ikke server-rendering for at fungere effektivt
 * 
 * Derfor skal denne implementering IKKE ændres tilbage til SSR uden
 * at tage højde for disse komplikationer.
 */

'use client';

import { useAuthStore } from '@/store/authStore';
import RabbitOwnList from './rabbitOwnList';

export default function RabbitsPage() {
  const { userIdentity, isLoading } = useAuthStore();

  // Vent på at brugerdata er klar
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-zinc-300">Indlæser brugerdata...</p>
        </div>
      </div>
    );
  }

  if (!userIdentity?.id) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <p className="text-red-500">Bruger-ID mangler. Du skal være logget ind.</p>
      </div>
    );
  }

  // Send userId som prop til RabbitOwnList
  return <RabbitOwnList userId={userIdentity.id} />;
}