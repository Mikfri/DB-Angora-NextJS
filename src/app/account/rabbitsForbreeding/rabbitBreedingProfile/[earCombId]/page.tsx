// src/app/account/rabbitsForbreeding/rabbitBreedingProfile/[earCombId]/page.tsx
/**
 * VIGTIG NOTE OM RENDERING:
 * ========================
 * Denne side bruger bevidst Client-Side Rendering (CSR) af følgende grunde:
 * 
 * 1. Siden er beskyttet bag login, så SEO er ikke relevant
 * 2. CSR løser TypeScript type problemer med Next.js page props
 * 3. Siden behøver ikke server-rendering for at fungere effektivt
 * 
 * Derfor skal denne implementering IKKE ændres tilbage til SSR uden
 * at tage højde for TypeScript komplikationerne.
 */

'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRabbitForbreedingProfile } from "@/app/actions/rabbit/rabbitCrudActions";
import { Spinner } from "@heroui/react";
import { Rabbit_ForbreedingProfileDTO } from "@/api/types/AngoraDTOs";
import RabbitBreedingProfile from "./rabbitBreedingProfile";

export default function RabbitBreedingProfilePage() {
  const { earCombId } = useParams<{ earCombId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Rabbit_ForbreedingProfileDTO | null>(null);

  useEffect(() => {
    if (!earCombId) return;
    setLoading(true);
    getRabbitForbreedingProfile(earCombId)
      .then(result => {
        if (result.success) {
          setProfile(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
      })
      .finally(() => setLoading(false));
  }, [earCombId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" color="primary" label="Indlæser avlsprofil..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <p className="text-zinc-400">Ingen profil fundet.</p>
      </div>
    );
  }

  return <RabbitBreedingProfile profile={profile} />;
}