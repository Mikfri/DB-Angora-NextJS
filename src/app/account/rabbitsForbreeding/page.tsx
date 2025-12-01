// src/app/account/rabbitsForbreeding/page.tsx
'use client';

import { useEffect } from 'react';
import { Spinner } from "@heroui/react";
import RabbitBreedingList from './rabbitBreedingList';
import { useRabbitsForbreedingStore } from '@/store/rabbitsForbreedingStore';

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
    const { 
        filteredRabbits, 
        isLoading, 
        error, 
        fetchRabbits 
    } = useRabbitsForbreedingStore();

    // Load rabbits from API ved mount
    useEffect(() => {
        fetchRabbits();
    }, [fetchRabbits]);

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

    return <RabbitBreedingList rabbits={filteredRabbits} />;
}