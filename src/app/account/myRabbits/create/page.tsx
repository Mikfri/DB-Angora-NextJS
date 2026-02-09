// src/app/account/myRabbits/create/page.tsx

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
import CreateRabbitForm from './createRabbitForm';

export default function CreateRabbitPage() {
  const { userIdentity, isLoading } = useAuthStore();

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
      <div className="main-content-container">
        <p className="text-red-500">Bruger-ID mangler. Du skal være logget ind.</p>
      </div>
    );
  }

  return <CreateRabbitForm targetedUserId={userIdentity.id} />;
}