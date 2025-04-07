// src/app/account/rabbitsForbreeding/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Spinner } from "@heroui/react";
import { Rabbit_ForbreedingPreviewDTO } from '@/api/types/AngoraDTOs';
import { BreedingFilters } from '@/api/types/filterTypes';
import { getBreedingRabbits } from '@/app/actions/rabbit/forbreeding';
import RabbitBreedingList from './rabbitBreedingList';
import { useBreedingRabbits } from '@/hooks/rabbits/useRabbitBreedingFilter';
import { useNav } from '@/components/providers/Providers';
import RabbitBreedingNav from '@/components/nav/side/index/RabbitBreedingNav';

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
    const { setPrimaryNav } = useNav();
    
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
    
    // Use the useBreedingRabbits hook to handle filtering
    const { filteredRabbits, filters, setFilters } = useBreedingRabbits(rabbits);
    
    // Handler for filter changes with proper typing
    const handleFilterChange = useCallback((newFilters: Partial<BreedingFilters>) => {
        setFilters(newFilters);
    }, [setFilters]);
    
    // Set the navigation using useNav hook
    useEffect(() => {
        setPrimaryNav(
            <RabbitBreedingNav 
                activeFilters={filters} 
                onFilterChange={handleFilterChange}
            />
        );
        
        return () => {
            setPrimaryNav(null);
        };
    }, [filters, handleFilterChange, setPrimaryNav]);
    
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
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
    
    if (!filteredRabbits || filteredRabbits.length === 0) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <p>Der er ingen avlskaniner tilgængelige på nuværende tidspunkt.</p>
            </div>
        );
    }

    // Returnerer direkte indholdet uden at wrappe det i SideNavLayout
    return <RabbitBreedingList rabbits={filteredRabbits} />;
}