// src/app/account/rabbitsForbreeding/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Spinner } from "@heroui/react";
import { Rabbit_ForbreedingPreviewDTO } from '@/api/types/AngoraDTOs';
import { getBreedingRabbits } from '@/app/actions/rabbit/forbreeding';
import RabbitBreedingList from './rabbitBreedingList';
import { useBreedingRabbits } from '@/hooks/rabbits/useRabbitBreedingFilter';

/**
 * VIGTIG NOTE OM RENDERING:
 * ========================
 * Denne side bruger bevidst Client-Side Rendering (CSR) af følgende grunde:
 * 
 * 1. Siden er beskyttet bag login, så SEO er ikke relevant
 * 2. CSR løser problemer med cookies i statisk build proces
 * 3. Siden behøver ikke server-rendering for at fungere effektivt
 */

export default function RabbitsForBreedingPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [rabbits, setRabbits] = useState<Rabbit_ForbreedingPreviewDTO[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Load rabbits from API
    useEffect(() => {
        async function loadRabbits() {
            try {
                setIsLoading(true);
                const result = await getBreedingRabbits();
                if (!result.success) {
                    setError(result.error);
                    return;
                }
                setRabbits(result.data);
            } catch (err) {
                console.error("Error loading breeding rabbits:", err);
                setError("Der opstod en fejl ved indlæsning af avlskaniner.");
            } finally {
                setIsLoading(false);
            }
        }
        loadRabbits();
    }, []);

    // Brug kun filteredRabbits fra hook
    const { filteredRabbits } = useBreedingRabbits(rabbits);

    // Render content based on loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-content-container">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!filteredRabbits || filteredRabbits.length === 0) {
        return (
            <div className="main-content-container">
                <p>Der er ingen avlskaniner tilgængelige på nuværende tidspunkt.</p>
            </div>
        );
    }

    // Returnerer kun hovedindholdet
    return <RabbitBreedingList rabbits={filteredRabbits} />;
}