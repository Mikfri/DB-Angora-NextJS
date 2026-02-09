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
import { Rabbit_OwnedFilterDTO, Rabbit_OwnedPreviewDTO } from '@/api/types/AngoraDTOs';
import { getRabbitsOwnedByUser } from '@/app/actions/rabbit/rabbitCrudActions';
import { useAuthStore } from './authStore';
import { OwnFilters } from '@/api/types/filterTypes';

// Default filter values for OwnFilters (client-side/CSR)
const DEFAULT_FILTERS: Required<OwnFilters> = {
    search: '',
    gender: '',
    race: '',
    color: '',
    forSale: false,
    isForBreeding: false,
    lifeStatus: false,
    showJuveniles: false,
    raceColorApproval: null,
    bornAfterDate: null,
    includeLinkedRabbits: true, // <-- NYT FELT
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
    rabbits: Rabbit_OwnedPreviewDTO[];
    filters: Required<OwnFilters>;
    isAnyFilterActive: boolean;
    pagination: PaginationState;
    isLoading: boolean;
    error: string | null;
    filteredRabbits: Rabbit_OwnedPreviewDTO[];
    fetchRabbits: (page?: number, userId?: string) => Promise<void>;
    updateFilters: (newFilters: Partial<OwnFilters>) => void;
    resetFilters: () => void;
    setLifeStatusFilter: (status: 'all' | 'alive' | 'deceased') => void;
    changePage: (newPage: number) => void;
}

// Hjælpefunktion: Check om der er aktive filtre
const checkActiveFilters = (filters: Required<OwnFilters>): boolean => {
    return filters.search !== '' ||
        filters.gender !== '' ||
        filters.race !== '' ||
        filters.color !== '' ||
        filters.forSale !== false ||
        filters.isForBreeding !== false ||
        filters.lifeStatus !== null ||
        filters.showJuveniles !== false ||
        filters.raceColorApproval !== null ||
        filters.bornAfterDate !== null;
};

// Hjælpefunktion: Filtrer kaniner baseret på filtre (CSR)
const filterRabbits = (rabbits: Rabbit_OwnedPreviewDTO[], filters: Required<OwnFilters>): Rabbit_OwnedPreviewDTO[] => {
    return rabbits.filter(rabbit => {
        const searchLower = filters.search?.toLowerCase() || '';
        const isDeceased = rabbit.dateOfDeath !== null;
        if (!searchLower) {
            if (filters.lifeStatus !== null && filters.lifeStatus !== isDeceased) {
                return false;
            }
        }
        if (filters.showJuveniles && !rabbit.ungdyrGruppe_M) return false;

        const matchesSearch = !searchLower || (
            (rabbit.nickName?.toLowerCase()?.includes(searchLower) || false) ||
            (rabbit.earCombId?.toLowerCase()?.includes(searchLower) || false) ||
            (rabbit.race?.toLowerCase()?.includes(searchLower) || false) ||
            (rabbit.color?.toLowerCase()?.includes(searchLower) || false)
        );

        const matchesRaceColorApproval =
            filters.raceColorApproval === null ||
            (filters.raceColorApproval === true && rabbit.approvedRaceColorCombination === true) ||
            (filters.raceColorApproval === false && rabbit.approvedRaceColorCombination === false);

        const matchesBornAfter = !filters.bornAfterDate ||
            (rabbit.dateOfBirth && new Date(rabbit.dateOfBirth) >= new Date(filters.bornAfterDate));

        const matchesGender = !filters.gender || rabbit.gender === filters.gender;
        const matchesRace = !filters.race || rabbit.race === filters.race;
        const matchesColor = !filters.color || rabbit.color === filters.color;
        const matchesForSale = !filters.forSale || rabbit.hasSaleDetails === true;
        const matchesForBreeding = !filters.isForBreeding || rabbit.isForBreeding === true;

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

// Mapping OwnFilters -> Rabbit_OwnedFilterDTO (API filter)
function mapOwnFiltersToDTO(filters: OwnFilters, page: number, pageSize: number): Rabbit_OwnedFilterDTO {
    const dto: Rabbit_OwnedFilterDTO = {
        page,
        pageSize,
    };

    if (filters.search && filters.search.trim() !== '') {
        dto.rightEarId = filters.search.trim();
    }
    if (filters.gender && filters.gender !== '') {
        dto.gender = filters.gender;
    }
    if (filters.race && filters.race !== '') {
        dto.race = filters.race;
    }
    if (filters.color && filters.color !== '') {
        dto.color = filters.color;
    }
    if (filters.isForBreeding === true) {
        dto.isForBreeding = true;
    }
    if (filters.showJuveniles === true) {
        dto.ungdyrGruppe_M = true;
    }
    if (filters.lifeStatus === true) {
        dto.onlyDeceased = true;
    } else if (filters.lifeStatus === false) {
        dto.onlyDeceased = false;
    }
    if (filters.raceColorApproval !== null) {
        dto.approvedRaceColorCombination = filters.raceColorApproval;
    }
    if (filters.bornAfterDate) {
        dto.bornAfter = filters.bornAfterDate;
    }
    // NYT: includeLinkedRabbits
    if (typeof filters.includeLinkedRabbits === 'boolean') {
        dto.includeLinkedRabbits = filters.includeLinkedRabbits;
    }

    return dto;
}

// Zustand store
export const useRabbitsOwnedStore = create<RabbitsOwnedStore>((set, get) => ({
    rabbits: [],
    filters: DEFAULT_FILTERS,
    isAnyFilterActive: false,
    pagination: DEFAULT_PAGINATION,
    isLoading: false,
    error: null,
    filteredRabbits: [],

    fetchRabbits: async (page = 1, userId?: string) => {
        const { pagination, filters } = get();
        const effectiveUserId = userId || useAuthStore.getState().userIdentity?.id;

        try {
            if (!effectiveUserId) {
                set({
                    error: "Bruger-ID mangler. Du skal være logget ind.",
                    isLoading: false
                });
                return;
            }

            const filterDTO = mapOwnFiltersToDTO(filters, page, pagination.pageSize);
            const result = await getRabbitsOwnedByUser(effectiveUserId, filterDTO, page, pagination.pageSize);

            if (!result.success) {
                set({
                    error: result.error || "Der opstod en fejl ved indlæsning af dine kaniner.",
                    isLoading: false
                });
                return;
            }

            const newRabbits = result.data?.data || [];
            set({
                rabbits: newRabbits,
                filteredRabbits: filterRabbits(newRabbits, filters),
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
                error: error instanceof Error ? error.message : "Der opstod en uventet fejl ved indlæsning af dine kaniner.",
                isLoading: false
            });
        }
    },

    changePage: (newPage) => {
        const { pagination, fetchRabbits } = get();
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchRabbits(newPage);
        }
    },

    updateFilters: (newFilters) => {
        set(state => {
            const updatedFilters = {
                ...state.filters,
                ...(newFilters.lifeStatus !== undefined ? { lifeStatus: newFilters.lifeStatus } : {}),
                ...(newFilters.forSale !== undefined ? { forSale: Boolean(newFilters.forSale) } : {}),
                ...(newFilters.isForBreeding !== undefined ? { isForBreeding: Boolean(newFilters.isForBreeding) } : {}),
                ...(newFilters.showJuveniles !== undefined ? { showJuveniles: Boolean(newFilters.showJuveniles) } : {}),
                ...(newFilters.search !== undefined ? { search: newFilters.search } : {}),
                ...(newFilters.gender !== undefined ? { gender: newFilters.gender } : {}),
                ...(newFilters.race !== undefined ? { race: newFilters.race } : {}),
                ...(newFilters.color !== undefined ? { color: newFilters.color } : {}),
                ...(newFilters.raceColorApproval !== undefined ? { raceColorApproval: newFilters.raceColorApproval } : {}),
                ...(newFilters.bornAfterDate !== undefined ? { bornAfterDate: newFilters.bornAfterDate } : {}),
                ...(newFilters.includeLinkedRabbits !== undefined ? { includeLinkedRabbits: newFilters.includeLinkedRabbits } : {}), // <-- NYT
            };

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

    setLifeStatusFilter: (status) => {
        const lifeStatus = status === 'all' ? null : status === 'deceased';
        get().updateFilters({ lifeStatus });
    },
}));