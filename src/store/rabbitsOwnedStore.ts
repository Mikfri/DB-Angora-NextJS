// src/store/rabbitsOwnedStore.ts

/**
 * Rabbits Owned Store - TIL BRUG I CLIENT COMPONENTS
 * Centraliseret tilstandshåndtering for "Mine Kaniner" sektionen.
 * Håndterer indlæsning, filtrering og paginering af brugerens kaniner.
 * 
 * Ansvarsområder:
 * - Indlæsning af kaniner via API
 * - Filtrering baseret på bruger-valgte kriterier (race, farve, køn, osv.)
 * - Håndtering af pagination
 * - Status-tracking (loading, error)
 * 
 * Nøglefunktionalitet:
 * - fetchRabbits: Henter kaniner fra API'en med paginering
 * - updateFilters: Opdaterer filtreringsindstillinger og resultater
 * - resetFilters: Nulstiller alle filtre til standardværdier
 * - setLifeStatusFilter: Specialiseret funktion til levende/død filtrering
 * - changePage: Skift mellem sider i paginerede resultater
 */

import { create } from 'zustand';
import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';
import { OwnFilters } from '@/api/types/filterTypes';
import { getMyRabbits } from '@/app/actions/breederAccount/breederAccountActions';

// Default filter values - flyttet fra useRabbitOwnFilter.ts
const DEFAULT_FILTERS: Required<OwnFilters> = {
    search: '',
    gender: null,
    race: null,
    color: null,
    forSale: false,
    isForBreeding: false,
    lifeStatus: null,  // NULL = vis alle, true = kun døde, false = kun levende
    showJuveniles: false,
    raceColorApproval: null,
    bornAfterDate: null,
};

// Tilstandstyper for pagination
interface PaginationState {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Standard pagination-tilstand
const DEFAULT_PAGINATION: PaginationState = {
    page: 1,
    pageSize: 50,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
};

// Hovedinterface for hele storen
interface RabbitsOwnedStore {
    // Tilstande
    rabbits: Rabbit_PreviewDTO[];        // Alle kaniner på nuværende side
    filters: Required<OwnFilters>;        // Aktive filtre
    isAnyFilterActive: boolean;           // Flag om der er aktive filtre
    pagination: PaginationState;          // Pagination information
    isLoading: boolean;                   // Loading-tilstand
    error: string | null;                 // Fejlbesked

    // Beregnet data
    filteredRabbits: Rabbit_PreviewDTO[]; // Filtrerede kaniner

    // Handlinger - Data
    fetchRabbits: (page?: number) => Promise<void>; // Hent kaniner

    // Handlinger - Filtrering
    updateFilters: (newFilters: Partial<OwnFilters>) => void;
    resetFilters: () => void;
    setLifeStatusFilter: (status: 'all' | 'alive' | 'deceased') => void;

    // Handlinger - Pagination
    changePage: (newPage: number) => void;
}

// Hjælpefunktion: Check om der er aktive filtre
const checkActiveFilters = (filters: Required<OwnFilters>): boolean => {
    return filters.search !== '' ||
        filters.gender !== null ||
        filters.race !== null ||
        filters.color !== null ||
        filters.forSale !== false ||
        filters.isForBreeding !== false ||
        filters.lifeStatus !== null ||
        filters.showJuveniles !== false ||
        filters.raceColorApproval !== null ||
        filters.bornAfterDate !== null;
};

// Hjælpefunktion: Filtrer kaniner baseret på filtre
const filterRabbits = (rabbits: Rabbit_PreviewDTO[], filters: Required<OwnFilters>): Rabbit_PreviewDTO[] => {
    return rabbits.filter(rabbit => {
        // Tjek for afdøde kaniner (kun hvis lifeStatus ikke er null)
        const isDeceased = rabbit.dateOfDeath !== null;
        if (filters.lifeStatus !== null && filters.lifeStatus !== isDeceased) {
            return false;
        }

        // Tjek for ungdyr
        if (filters.showJuveniles && !rabbit.isJuvenile) return false;

        // Søgning
        const searchLower = filters.search?.toLowerCase() || '';
        const matchesSearch = !searchLower || (
            (rabbit.nickName?.toLowerCase()?.includes(searchLower) || false) ||
            (rabbit.earCombId?.toLowerCase()?.includes(searchLower) || false) ||
            (rabbit.race?.toLowerCase()?.includes(searchLower) || false) ||
            (rabbit.color?.toLowerCase()?.includes(searchLower) || false)
        );

        // Race/farve godkendelse
        const matchesRaceColorApproval = !filters.raceColorApproval ||
            (filters.raceColorApproval === 'Approved' && rabbit.approvedRaceColorCombination === true) ||
            (filters.raceColorApproval === 'NotApproved' && rabbit.approvedRaceColorCombination === false);

        // Dato filter
        const matchesBornAfter = !filters.bornAfterDate ||
            (rabbit.dateOfBirth && new Date(rabbit.dateOfBirth) >= new Date(filters.bornAfterDate));

        // Basis egenskaber
        const matchesGender = !filters.gender || rabbit.gender === filters.gender;
        const matchesRace = !filters.race || rabbit.race === filters.race;
        const matchesColor = !filters.color || rabbit.color === filters.color;

        // Flag filtre
        const matchesForSale = !filters.forSale || rabbit.hasSaleDetails === true;
        const matchesForBreeding = !filters.isForBreeding || rabbit.isForBreeding === true;

        // Alle betingelser skal matche
        return matchesSearch &&
            matchesGender &&
            matchesRace &&
            matchesColor &&
            matchesForSale &&
            matchesForBreeding &&
            matchesRaceColorApproval &&
            matchesBornAfter;
    });
};

// Opret Zustand store
export const useRabbitsOwnedStore = create<RabbitsOwnedStore>((set, get) => ({
    // Initial tilstande
    rabbits: [],
    filters: DEFAULT_FILTERS,
    isAnyFilterActive: false,
    pagination: DEFAULT_PAGINATION,
    isLoading: false,
    error: null,

    // Beregn filtrerede kaniner via en funktion i stedet for getter
    // Dette er en normal funktion som vi kalder i komponenterne
    filteredRabbits: [], // Start med tom array

    // Handling: Hent kaniner
    fetchRabbits: async (page = 1) => {
        const { pagination } = get();

        try {
            set({ isLoading: true, error: null });
            console.log(`🔄 Zustand: Loading rabbits page ${page}`);

            const result = await getMyRabbits(page, pagination.pageSize);

            if (!result.success) {
                set({
                    error: result.error || "Der opstod en fejl ved indlæsning af dine kaniner.",
                    isLoading: false
                });
                return;
            }

            const newRabbits = result.data?.data || [];
            console.log(`📦 Zustand: Received ${newRabbits.length} rabbits`);

            // Opdater store med nye data og filtrerede data
            set({
                rabbits: newRabbits,
                filters: DEFAULT_FILTERS,
                isAnyFilterActive: false,
                filteredRabbits: filterRabbits(newRabbits, DEFAULT_FILTERS),
                pagination: {
                    page: result.data?.page || 1,
                    pageSize: result.data?.pageSize || pagination.pageSize,
                    totalPages: result.data?.totalPages || 1,
                    totalCount: result.data?.totalCount || 0,
                    hasNextPage: result.data?.hasNextPage || false,
                    hasPreviousPage: result.data?.hasPreviousPage || false
                },
                isLoading: false
            });

        } catch (error) {
            console.error("Error in fetchRabbits:", error);
            set({
                error: "Der opstod en uventet fejl ved indlæsning af dine kaniner.",
                isLoading: false
            });
        }
    },

    // Handling: Skift side
    changePage: (newPage) => {
        const { pagination, fetchRabbits } = get();
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            // Scroll til toppen med smooth animation
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchRabbits(newPage);
        }
    },

    // Handling: Opdater filtre
    updateFilters: (newFilters) => {
        set(state => {
            const updatedFilters = {
                ...state.filters,
                // Håndter lifeStatus særligt
                ...(newFilters.lifeStatus !== undefined ? {
                    lifeStatus: newFilters.lifeStatus
                } : {}),

                // Andre boolean properties
                ...(newFilters.forSale !== undefined ? { forSale: Boolean(newFilters.forSale) } : {}),
                ...(newFilters.isForBreeding !== undefined ? { isForBreeding: Boolean(newFilters.isForBreeding) } : {}),
                ...(newFilters.showJuveniles !== undefined ? { showJuveniles: Boolean(newFilters.showJuveniles) } : {}),

                // Andre egenskaber
                ...(newFilters.search !== undefined ? { search: newFilters.search } : {}),
                ...(newFilters.gender !== undefined ? { gender: newFilters.gender } : {}),
                ...(newFilters.race !== undefined ? { race: newFilters.race } : {}),
                ...(newFilters.color !== undefined ? { color: newFilters.color } : {}),
                ...(newFilters.raceColorApproval !== undefined ? {
                    raceColorApproval: newFilters.raceColorApproval
                } : {}),
                ...(newFilters.bornAfterDate !== undefined ? {
                    bornAfterDate: newFilters.bornAfterDate
                } : {}),
            };

            const isActive = checkActiveFilters(updatedFilters);

            // Beregn nye filtrerede kaniner baseret på de opdaterede filtre
            const newFilteredRabbits = filterRabbits(state.rabbits, updatedFilters);

            return {
                filters: updatedFilters,
                isAnyFilterActive: isActive,
                filteredRabbits: newFilteredRabbits // Opdater filtrerede resultater
            };
        });
    },

    // Handling: Nulstil filtre
    resetFilters: () => {
        set(state => ({
            filters: DEFAULT_FILTERS,
            isAnyFilterActive: false,
            filteredRabbits: filterRabbits(state.rabbits, DEFAULT_FILTERS) // Beregn filtrerede kaniner efter reset
        }));
    },

    // Handling: Sæt levende/død filter
    setLifeStatusFilter: (status) => {
        const lifeStatus = status === 'all' ? null : status === 'deceased';
        get().updateFilters({ lifeStatus });
    },
}));