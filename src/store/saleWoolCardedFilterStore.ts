// src/store/saleWoolCardedFilterStore.ts
import { create } from 'zustand';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { WoolCardedSaleFilterDTO } from '@/api/types/WoolCardedDTOs';

type FilterValue = string | number | boolean | null | undefined;

interface WoolCardedFilterState {
    filters: Partial<WoolCardedSaleFilterDTO>;
    updateFilter: (key: keyof WoolCardedSaleFilterDTO, value: FilterValue) => void;
    clearFilter: (key: keyof WoolCardedSaleFilterDTO) => void;
    clearAllFilters: () => void;
    syncWithUrl: (searchParams: URLSearchParams) => void;
}

export const saleWoolCardedFilterStore = create<WoolCardedFilterState>()((set) => ({
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
        const newFilters: Partial<WoolCardedSaleFilterDTO> = {};

        // Base filters
        if (searchParams.has('SortBy'))       newFilters.sortBy       = searchParams.get('SortBy') || undefined;
        if (searchParams.has('City'))         newFilters.city         = searchParams.get('City') || undefined;
        if (searchParams.has('CanBeShipped')) newFilters.canBeShipped = searchParams.get('CanBeShipped') === 'true';

        // WoolCarded-specific filters
        if (searchParams.has('FiberType'))    newFilters.fiberType    = searchParams.get('FiberType') || undefined;
        if (searchParams.has('NaturalColor')) newFilters.naturalColor = searchParams.get('NaturalColor') || undefined;
        if (searchParams.has('DyedColor'))    newFilters.dyedColor    = searchParams.get('DyedColor') || undefined;
        if (searchParams.has('IsDyed')) {
            const val = searchParams.get('IsDyed');
            if (val === 'true')  newFilters.isDyed = true;
            if (val === 'false') newFilters.isDyed = false;
        }

        // Numeric
        if (searchParams.has('MinAverageFiberLengthCm')) {
            const val = parseFloat(searchParams.get('MinAverageFiberLengthCm') || '0');
            if (!isNaN(val)) newFilters.minAverageFiberLengthCm = val;
        }
        if (searchParams.has('MaxAverageFiberLengthCm')) {
            const val = parseFloat(searchParams.get('MaxAverageFiberLengthCm') || '0');
            if (!isNaN(val)) newFilters.maxAverageFiberLengthCm = val;
        }
        if (searchParams.has('MinTotalWeightGrams')) {
            const val = parseFloat(searchParams.get('MinTotalWeightGrams') || '0');
            if (!isNaN(val)) newFilters.minTotalWeightGrams = val;
        }
        if (searchParams.has('MaxTotalWeightGrams')) {
            const val = parseFloat(searchParams.get('MaxTotalWeightGrams') || '0');
            if (!isNaN(val)) newFilters.maxTotalWeightGrams = val;
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

export function useWoolCardedFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsObj = useSearchParams();

    const { filters, updateFilter, clearFilter, clearAllFilters, syncWithUrl } = saleWoolCardedFilterStore();

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
