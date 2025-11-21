// src/app/account/myRabbits/rabbitProfile/[earCombId]/page.tsx
'use client';

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

import { notFound } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useRabbitProfile } from '@/contexts/RabbitProfileContext';
import RabbitProfile from "./rabbitProfile";

export default function RabbitProfilePage() {
  const { profile, isLoading, error } = useRabbitProfile();
  
  // Viser loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }
  
  // Viser fejlmeddelelser
  if (error) {
    if (error.status === 404) {
      return notFound();
    }
    
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }
  
  // Viser kaninprofilen når den er indlæst
  if (profile) {
    return <RabbitProfile rabbitProfile={profile} />;
  }
  
  return null;
}