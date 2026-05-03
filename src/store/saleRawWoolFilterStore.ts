// src/store/saleRawWoolFilterStore.ts
import { create } from 'zustand';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { WoolRawSaleFilterDTO } from '@/api/types/WoolRawDTOs';

type FilterValue = string | number | boolean | null | undefined;

interface RawWoolFilterState {
    filters: Partial<WoolRawSaleFilterDTO>;
    updateFilter: (key: keyof WoolRawSaleFilterDTO, value: FilterValue) => void;
    clearFilter: (key: keyof WoolRawSaleFilterDTO) => void;
    clearAllFilters: () => void;
    syncWithUrl: (searchParams: URLSearchParams) => void;
}

export const saleRawWoolFilterStore = create<RawWoolFilterState>()((set) => ({
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
        const newFilters: Partial<WoolRawSaleFilterDTO> = {};

        // Base filters
        if (searchParams.has('SortBy'))       newFilters.sortBy       = searchParams.get('SortBy') || undefined;
        if (searchParams.has('City'))         newFilters.city         = searchParams.get('City') || undefined;
        if (searchParams.has('CanBeShipped')) newFilters.canBeShipped = searchParams.get('CanBeShipped') === 'true';

        // WoolRaw-specific filters
        if (searchParams.has('FiberType'))    newFilters.fiberType    = searchParams.get('FiberType') || undefined;
        if (searchParams.has('NaturalColor')) newFilters.naturalColor = searchParams.get('NaturalColor') || undefined;

        // Numeric
        if (searchParams.has('MinFiberLengthCm')) {
            const val = parseFloat(searchParams.get('MinFiberLengthCm') || '0');
            if (!isNaN(val)) newFilters.minFiberLengthCm = val;
        }
        if (searchParams.has('MaxFiberLengthCm')) {
            const val = parseFloat(searchParams.get('MaxFiberLengthCm') || '0');
            if (!isNaN(val)) newFilters.maxFiberLengthCm = val;
        }
        if (searchParams.has('MinWeightGrams')) {
            const val = parseFloat(searchParams.get('MinWeightGrams') || '0');
            if (!isNaN(val)) newFilters.minWeightGrams = val;
        }
        if (searchParams.has('MaxWeightGrams')) {
            const val = parseFloat(searchParams.get('MaxWeightGrams') || '0');
            if (!isNaN(val)) newFilters.maxWeightGrams = val;
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

export function useRawWoolFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsObj = useSearchParams();

    const { filters, updateFilter, clearFilter, clearAllFilters, syncWithUrl } = saleRawWoolFilterStore();

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
