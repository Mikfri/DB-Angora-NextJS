// src/store/salesOwnedStore.ts

/**
 * Sales Owned Store - TIL BRUG I CLIENT COMPONENTS
 * Centraliseret tilstandshåndtering for "Mine Annoncer" sektionen.
 *
 * Strategi: hent alle brugerens annoncer én gang (stor pageSize),
 * filtrer og paginer derefter lokalt i browseren (CSR-model).
 */

import { create } from 'zustand';
import { SaleDetailsPrivateCardDTO } from '@/api/types/AngoraDTOs';
import { getSaleItemsByTargetedUserId } from '@/app/actions/sales/salesManagementAcions';

// Status-tab værdier
export type SaleStatusFilter = 'all' | 'Active' | 'OnHold' | 'Sold';

const CLIENT_FETCH_PAGE_SIZE = 500;
const DEFAULT_PAGE_SIZE = 12;

interface PaginationState {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
}

const DEFAULT_PAGINATION: PaginationState = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 1,
    totalCount: 0,
};

function buildPagination(page: number, pageSize: number, total: number): PaginationState {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return { page: Math.min(Math.max(page, 1), totalPages), pageSize, totalPages, totalCount: total };
}

function applyFilters(
    items: SaleDetailsPrivateCardDTO[],
    statusFilter: SaleStatusFilter,
    search: string,
): SaleDetailsPrivateCardDTO[] {
    return items.filter((item) => {
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const q = search.trim().toLowerCase();
        const matchesSearch = !q || item.title?.toLowerCase().includes(q) || item.entityType?.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });
}

interface SalesOwnedStore {
    items: SaleDetailsPrivateCardDTO[];
    filteredItems: SaleDetailsPrivateCardDTO[];
    statusFilter: SaleStatusFilter;
    search: string;
    pagination: PaginationState;
    isLoading: boolean;
    error: string | null;

    fetchItems: (userId: string) => Promise<void>;
    setStatusFilter: (status: SaleStatusFilter) => void;
    setSearch: (search: string) => void;
    changePage: (page: number) => void;
    reset: () => void;
}

export const useSalesOwnedStore = create<SalesOwnedStore>((set, get) => ({
    items: [],
    filteredItems: [],
    statusFilter: 'all',
    search: '',
    pagination: DEFAULT_PAGINATION,
    isLoading: false,
    error: null,

    fetchItems: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const result = await getSaleItemsByTargetedUserId(userId, 1, CLIENT_FETCH_PAGE_SIZE);
            if (!result.success) {
                set({ isLoading: false, error: result.error ?? 'Fejl ved indlæsning' });
                return;
            }
            const all = result.data.data ?? [];
            const { statusFilter, search, pagination } = get();
            const filtered = applyFilters(all, statusFilter, search);
            set({
                items: all,
                filteredItems: filtered,
                pagination: buildPagination(1, pagination.pageSize, filtered.length),
                isLoading: false,
            });
        } catch (e) {
            set({ isLoading: false, error: e instanceof Error ? e.message : 'Ukendt fejl' });
        }
    },

    setStatusFilter: (statusFilter) => {
        const { items, search, pagination } = get();
        const filtered = applyFilters(items, statusFilter, search);
        set({
            statusFilter,
            filteredItems: filtered,
            pagination: buildPagination(1, pagination.pageSize, filtered.length),
        });
    },

    setSearch: (search) => {
        const { items, statusFilter, pagination } = get();
        const filtered = applyFilters(items, statusFilter, search);
        set({
            search,
            filteredItems: filtered,
            pagination: buildPagination(1, pagination.pageSize, filtered.length),
        });
    },

    changePage: (page) => {
        const { pagination } = get();
        if (page >= 1 && page <= pagination.totalPages) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            set((state) => ({ pagination: { ...state.pagination, page } }));
        }
    },

    reset: () => set({
        items: [],
        filteredItems: [],
        statusFilter: 'all',
        search: '',
        pagination: DEFAULT_PAGINATION,
        isLoading: false,
        error: null,
    }),
}));
