// src/store/rabbitsForbreedingStore.ts

/**
 * Rabbits Forbreeding Store
 *
 * Ansvar:
 * - Centraliseret client-side state for sektionen "kaniner til avl".
 * - Holder rå data (rabbits) hentet fra API'et og en derivert liste (filteredRabbits).
 * - Indeholder aktuelle filtre (search, Race, Color, Gender, zip-range, m.fl.).
 * - Håndterer status (isLoading, error) og flags (isAnyFilterActive).
 * - Eksponerer actions:
 *   - fetchRabbits(): henter data fra serveren og opdaterer rabbits + filteredRabbits
 *   - updateFilters(partial): opdaterer filtre og genberegner filteredRabbits
 *   - resetFilters(): nulstiller filtre og filteredRabbits
 *
 * Hvorfor den er nødvendig:
 * - Deling af state mellem sidenav (RabbitForbreedingNavClient) og sideindhold
 *   (rabbitsForbreeding page / rabbitBreedingList) uden prop-drilling.
 * - Giver et enkelt, konsistent single source of truth for filtre og resultater,
 *   så nav kan opdatere filtre og listen automatisk reagerer (reaktiv opdatering).
 * - Undgår dobbelte fetches og race conditions ved at samle fetch-logikken ét sted.
 * - Zustand-storen kører i browseren (client), hvilket er korrekt for interaktivt UI
 *   der bruger hooks og browser-APIs. Den tillader også at bevare state når brugeren
 *   navigerer internt (fx tilbage/frem) uden at miste filtervalg.
 *
 * Praktisk effekt:
 * - RabbitForbreedingNavClient aflæser `filters` og kalder `updateFilters` når brugeren
 *   ændrer filtre. Det opdaterer `filteredRabbits` øjeblikkeligt klient-side (CSR).
 * - rabbitsForbreeding page kalder `fetchRabbits` (fx ved mount) og viser `filteredRabbits`.
 * - UI bliver responsivt, konsistent og enklere at teste/vedligeholde.
 */

import { create } from 'zustand';
import { Rabbit_ForbreedingPreviewDTO } from '@/api/types/AngoraDTOs';
import { getBreedingRabbits } from '@/app/actions/rabbit/forbreeding';

// Lokal filter type der tillader undefined for optional felter
interface ForbreedingFilters {
    search: string;
    Gender: string;
    Race: string;
    Color: string;
    raceColorApproval: string;
    bornAfterDate: Date | null;
    minZipCode: number | undefined;
    maxZipCode: number | undefined;
}

// Default filter values
const DEFAULT_FILTERS: ForbreedingFilters = {
    search: '',
    Gender: '',
    Race: '',
    Color: '',
    raceColorApproval: '',
    bornAfterDate: null,
    minZipCode: undefined,
    maxZipCode: undefined,
};

interface RabbitsForbreedingStore {
    // Data
    rabbits: Rabbit_ForbreedingPreviewDTO[];
    filteredRabbits: Rabbit_ForbreedingPreviewDTO[];
    
    // Filters
    filters: ForbreedingFilters;
    isAnyFilterActive: boolean;
    
    // Status
    isLoading: boolean;
    error: string | null;
    
    // Actions
    fetchRabbits: () => Promise<void>;
    updateFilters: (newFilters: Partial<ForbreedingFilters>) => void;
    resetFilters: () => void;
}

// Hjælpefunktion: Check om der er aktive filtre
const checkActiveFilters = (filters: ForbreedingFilters): boolean => {
    return filters.search !== '' ||
        filters.Gender !== '' ||
        filters.Race !== '' ||
        filters.Color !== '' ||
        filters.raceColorApproval !== '' ||
        filters.bornAfterDate !== null ||
        filters.minZipCode !== undefined ||
        filters.maxZipCode !== undefined;
};

// Hjælpefunktion: Filtrer kaniner baseret på filtre (client-side)
const filterRabbits = (
    rabbits: Rabbit_ForbreedingPreviewDTO[], 
    filters: ForbreedingFilters
): Rabbit_ForbreedingPreviewDTO[] => {
    return rabbits.filter(rabbit => {
        // Søgning i relevante felter
        const searchLower = filters.search?.toLowerCase() || '';
        const matchesSearch = !searchLower || (
            (rabbit.earCombId?.toLowerCase().includes(searchLower) ?? false) ||
            (rabbit.race?.toLowerCase().includes(searchLower) ?? false) ||
            (rabbit.color?.toLowerCase().includes(searchLower) ?? false) ||
            (rabbit.city?.toLowerCase().includes(searchLower) ?? false) ||
            (rabbit.nickName?.toLowerCase().includes(searchLower) ?? false)
        );
        if (!matchesSearch) return false;

        // Gender filter
        if (filters.Gender && rabbit.gender !== filters.Gender) return false;

        // Race filter
        if (filters.Race && rabbit.race !== filters.Race) return false;

        // Color filter
        if (filters.Color && rabbit.color !== filters.Color) return false;

        // Postnummer range filter
        if (filters.minZipCode !== undefined && rabbit.zipCode < filters.minZipCode) return false;
        if (filters.maxZipCode !== undefined && rabbit.zipCode > filters.maxZipCode) return false;

        return true;
    });
};

export const useRabbitsForbreedingStore = create<RabbitsForbreedingStore>((set, get) => ({
    rabbits: [],
    filteredRabbits: [],
    filters: DEFAULT_FILTERS,
    isAnyFilterActive: false,
    isLoading: false,
    error: null,

    fetchRabbits: async () => {
        set({ isLoading: true, error: null });

        try {
            const result = await getBreedingRabbits();

            if (!result.success) {
                set({
                    error: result.error || "Der opstod en fejl ved indlæsning af avlskaniner.",
                    isLoading: false
                });
                return;
            }

            const { filters } = get();
            const newRabbits = result.data || [];

            set({
                rabbits: newRabbits,
                filteredRabbits: filterRabbits(newRabbits, filters),
                isLoading: false
            });

        } catch (error) {
            console.error("Error in fetchRabbits:", error);
            set({
                error: error instanceof Error ? error.message : "Der opstod en uventet fejl.",
                isLoading: false
            });
        }
    },

    updateFilters: (newFilters) => {
        set(state => {
            const updatedFilters = { ...state.filters, ...newFilters };
            const isActive = checkActiveFilters(updatedFilters);
            const newFilteredRabbits = filterRabbits(state.rabbits, updatedFilters);

            return {
                filters: updatedFilters,
                isAnyFilterActive: isActive,
                filteredRabbits: newFilteredRabbits
            };
        });
    },

    resetFilters: () => {
        set(state => ({
            filters: DEFAULT_FILTERS,
            isAnyFilterActive: false,
            filteredRabbits: filterRabbits(state.rabbits, DEFAULT_FILTERS)
        }));
    },
}));