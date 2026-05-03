// src/store/salePeltFilterStore.ts
import { create } from 'zustand';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { PeltSaleFilterDTO } from '@/api/types/PeltDTOs';

type FilterValue = string | number | boolean | null | undefined;

interface PeltFilterState {
    filters: Partial<PeltSaleFilterDTO>;
    updateFilter: (key: keyof PeltSaleFilterDTO, value: FilterValue) => void;
    clearFilter: (key: keyof PeltSaleFilterDTO) => void;
    clearAllFilters: () => void;
    syncWithUrl: (searchParams: URLSearchParams) => void;
}

export const salePeltFilterStore = create<PeltFilterState>()((set) => ({
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
        const newFilters: Partial<PeltSaleFilterDTO> = {};

        // Base filters
        if (searchParams.has('SortBy'))       newFilters.sortBy       = searchParams.get('SortBy') || undefined;
        if (searchParams.has('City'))         newFilters.city         = searchParams.get('City') || undefined;
        if (searchParams.has('CanBeShipped')) newFilters.canBeShipped = searchParams.get('CanBeShipped') === 'true';

        // Pelt-specific string filters
        if (searchParams.has('Race'))          newFilters.race          = searchParams.get('Race') || undefined;
        if (searchParams.has('Color'))         newFilters.color         = searchParams.get('Color') || undefined;
        if (searchParams.has('TanningMethod')) newFilters.tanningMethod = searchParams.get('TanningMethod') || undefined;
        if (searchParams.has('Condition'))     newFilters.condition     = searchParams.get('Condition') || undefined;

        // Numeric filters
        if (searchParams.has('MinLengthCm')) {
            const val = parseFloat(searchParams.get('MinLengthCm') || '0');
            if (!isNaN(val)) newFilters.minLengthCm = val;
        }
        if (searchParams.has('MaxLengthCm')) {
            const val = parseFloat(searchParams.get('MaxLengthCm') || '0');
            if (!isNaN(val)) newFilters.maxLengthCm = val;
        }
        if (searchParams.has('MinWidthCm')) {
            const val = parseFloat(searchParams.get('MinWidthCm') || '0');
            if (!isNaN(val)) newFilters.minWidthCm = val;
        }
        if (searchParams.has('MaxWidthCm')) {
            const val = parseFloat(searchParams.get('MaxWidthCm') || '0');
            if (!isNaN(val)) newFilters.maxWidthCm = val;
        }
        if (searchParams.has('MinZipCode')) {
            const val = parseInt(searchParams.get('MinZipCode') || '0');
            if (!isNaN(val)) newFilters.minZipCode = val;
        }
        if (searchParams.has('MaxZipCode')) {
            const val = parseInt(searchParams.get('MaxZipCode') || '0');
            if (!isNaN(val)) newFilters.maxZipCode = val;
        }
        if (searchParams.has('MinPrice')) {
            const val = parseFloat(searchParams.get('MinPrice') || '0');
            if (!isNaN(val)) newFilters.minPrice = val;
        }
        if (searchParams.has('MaxPrice')) {
            const val = parseFloat(searchParams.get('MaxPrice') || '0');
            if (!isNaN(val)) newFilters.maxPrice = val;
        }

        set({ filters: newFilters });
    },
}));

export function usePeltFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsObj = useSearchParams();

    const { filters, updateFilter, clearFilter, clearAllFilters, syncWithUrl } = salePeltFilterStore();

    const applyFilters = () => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                const urlKey = key.charAt(0).toUpperCase() + key.slice(1);
                params.set(urlKey, String(value));
            }
        });

        params.delete('Page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const syncFiltersWithUrl = () => {
        if (searchParamsObj) syncWithUrl(searchParamsObj);
    };

    return { filters, updateFilter, clearFilter, clearAllFilters, applyFilters, syncFiltersWithUrl };
}
