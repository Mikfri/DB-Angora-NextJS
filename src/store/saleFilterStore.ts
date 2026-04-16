// src/store/saleFilterStore.ts

/**
 * SaleFilterStore (Zustand)
 * -----------------------------------
 * Central state management for sale item filter/search UI.
 *
 * Ansvar:
 *  - Holder og opdaterer alle filterværdier for SaleDetails (entityType, price, zip, city, canBeShipped, sortBy)
 *  - Synkroniserer filter state med URL (både fra og til URL)
 *  - Gør det muligt for alle salgs-komponenter at læse/ændre filter state uden prop-drilling
 *  - Giver actions til at opdatere, nulstille og synkronisere filtre samt at "apply filters" (dvs. opdatere URL)
 *
 * Brugsmønster:
 *  - Importér og brug `useSaleFilters()` hook i dine client components
 *  - Læs/skriv til filters, brug updateFilter/clearFilter/applyFilters mv.
 *  - URL'en opdateres automatisk korrekt, og state bevares på tværs af navigation
 */

import { create } from 'zustand';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SaleDetailsFilterDTO } from '@/api/types/AngoraDTOs';
import { ROUTES } from '@/constants/navigationConstants';

type FilterValue = string | number | boolean | null | undefined;

interface SaleFilterState {
    filters: Partial<SaleDetailsFilterDTO>;

    updateFilter: (key: keyof SaleDetailsFilterDTO, value: FilterValue) => void;
    clearFilter: (key: keyof SaleDetailsFilterDTO) => void;
    clearAllFilters: () => void;
    syncWithUrl: (searchParams: URLSearchParams) => void;
}

export const saleFilterStore = create<SaleFilterState>()((set) => ({
    filters: {},

    updateFilter: (key, value) =>
        set(state => ({
            filters: { ...state.filters, [key]: value }
        })),

    clearFilter: (key) =>
        set(state => {
            const newFilters = { ...state.filters };
            delete newFilters[key];
            return { filters: newFilters };
        }),

    clearAllFilters: () => set({ filters: {} }),

    syncWithUrl: (searchParams) => {
        const newFilters: Partial<SaleDetailsFilterDTO> = {};

        if (searchParams.has('EntityType')) newFilters.entityType = searchParams.get('EntityType') || undefined;
        if (searchParams.has('City')) newFilters.city = searchParams.get('City') || undefined;
        if (searchParams.has('SortBy')) newFilters.sortBy = searchParams.get('SortBy') || undefined;

        if (searchParams.has('MinPrice')) {
            const v = Number(searchParams.get('MinPrice'));
            if (!isNaN(v)) newFilters.minPrice = v;
        }
        if (searchParams.has('MaxPrice')) {
            const v = Number(searchParams.get('MaxPrice'));
            if (!isNaN(v)) newFilters.maxPrice = v;
        }
        if (searchParams.has('MinZipCode')) {
            const v = Number(searchParams.get('MinZipCode'));
            if (!isNaN(v)) newFilters.minZipCode = v;
        }
        if (searchParams.has('MaxZipCode')) {
            const v = Number(searchParams.get('MaxZipCode'));
            if (!isNaN(v)) newFilters.maxZipCode = v;
        }
        if (searchParams.has('CanBeShipped')) {
            newFilters.canBeShipped = searchParams.get('CanBeShipped') === 'true';
        }

        set({ filters: newFilters });
    },
}));

// Hook for client components
export function useSaleFilters() {
    const router = useRouter();
    const searchParamsObj = useSearchParams();

    const {
        filters,
        updateFilter,
        clearFilter,
        clearAllFilters,
        syncWithUrl,
    } = saleFilterStore();

    // Læser altid fra store direkte for at undgå race-condition ved clearAllFilters + applyFilters
    const applyFilters = (overrides?: Partial<SaleDetailsFilterDTO>) => {
        const currentFilters = saleFilterStore.getState().filters;
        const merged = { ...currentFilters, ...(overrides || {}) };
        const params = new URLSearchParams();

        if (merged.entityType) params.set('EntityType', merged.entityType);
        if (merged.city) params.set('City', merged.city);
        if (merged.sortBy) params.set('SortBy', merged.sortBy);
        if (merged.minPrice != null) params.set('MinPrice', String(merged.minPrice));
        if (merged.maxPrice != null) params.set('MaxPrice', String(merged.maxPrice));
        if (merged.minZipCode != null) params.set('MinZipCode', String(merged.minZipCode));
        if (merged.maxZipCode != null) params.set('MaxZipCode', String(merged.maxZipCode));
        if (merged.canBeShipped != null) params.set('CanBeShipped', String(merged.canBeShipped));

        params.delete('Page');
        router.push(`${ROUTES.SALE.BASE}?${params.toString()}`);
    };

    const syncFiltersWithUrl = () => {
        if (searchParamsObj) {
            syncWithUrl(searchParamsObj);
        }
    };

    return {
        filters,
        updateFilter,
        clearFilter,
        clearAllFilters,
        applyFilters,
        syncFiltersWithUrl,
    };
}
