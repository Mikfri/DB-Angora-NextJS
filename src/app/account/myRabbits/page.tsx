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

import { useEffect, useState } from 'react';
import { Spinner } from "@heroui/react";
import RabbitOwnList from './rabbitOwnList';
import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';
import { getMyRabbits } from '@/app/actions/rabbit/myRabbits';

export default function RabbitsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rabbits, setRabbits] = useState<Rabbit_PreviewDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadRabbits() {
      try {
        setIsLoading(true);
        
        // Brug server action til at håndtere auth og data hentning
        const result = await getMyRabbits();
        
        if (!result.success) {
          setError(result.error || "Der opstod en fejl ved indlæsning af dine kaniner.");
          return;
        }
        
        setRabbits(result.data);
      } catch (err) {
        console.error("Error loading my rabbits:", err);
        setError("Der opstod en fejl ved indlæsning af dine kaniner.");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadRabbits();
  }, []);
  
  // Resten af koden er uændret
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" color="primary" />
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
  
  if (!rabbits || rabbits.length === 0) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <p>Du har endnu ikke registreret nogle kaniner.</p>
      </div>
    );
  }

  return <RabbitOwnList rabbits={rabbits} />;
}