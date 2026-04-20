// src/store/saleYarnFilterStore.ts
import { create } from 'zustand';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { YarnSaleFilterDTO } from '@/api/types/YarnDTOs';

type FilterValue = string | number | boolean | null | undefined;

interface YarnFilterState {
    filters: Partial<YarnSaleFilterDTO>;
    updateFilter: (key: keyof YarnSaleFilterDTO, value: FilterValue) => void;
    clearFilter: (key: keyof YarnSaleFilterDTO) => void;
    clearAllFilters: () => void;
    syncWithUrl: (searchParams: URLSearchParams) => void;
}

export const saleYarnFilterStore = create<YarnFilterState>()((set) => ({
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
        const newFilters: Partial<YarnSaleFilterDTO> = {};

        // Base filters
        if (searchParams.has('SortBy'))       newFilters.sortBy       = searchParams.get('SortBy') || undefined;
        if (searchParams.has('City'))         newFilters.city         = searchParams.get('City') || undefined;
        if (searchParams.has('CanBeShipped')) newFilters.canBeShipped = searchParams.get('CanBeShipped') === 'true';

        // Yarn-specific filters
        if (searchParams.has('ApplicationCategory')) newFilters.applicationCategory = searchParams.get('ApplicationCategory') || undefined;
        if (searchParams.has('WeightCategory'))      newFilters.weightCategory      = searchParams.get('WeightCategory') || undefined;
        if (searchParams.has('FiberType'))           newFilters.fiberType           = searchParams.get('FiberType') || undefined;

        // Numeric
        if (searchParams.has('PlyCount')) {
            const val = parseInt(searchParams.get('PlyCount') || '0');
            if (!isNaN(val)) newFilters.plyCount = val;
        }
        if (searchParams.has('MinNeedleSizeMm')) {
            const val = parseFloat(searchParams.get('MinNeedleSizeMm') || '0');
            if (!isNaN(val)) newFilters.minNeedleSizeMm = val;
        }
        if (searchParams.has('MaxNeedleSizeMm')) {
            const val = parseFloat(searchParams.get('MaxNeedleSizeMm') || '0');
            if (!isNaN(val)) newFilters.maxNeedleSizeMm = val;
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

export function useYarnFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsObj = useSearchParams();

    const { filters, updateFilter, clearFilter, clearAllFilters, syncWithUrl } = saleYarnFilterStore();

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
