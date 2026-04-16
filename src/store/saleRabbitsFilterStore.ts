// src/store/saleRabbitsFilterStore.ts
import { create } from 'zustand';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { RabbitSaleFilterDTO } from '@/api/types/AngoraDTOs';

// Lav en type for værdier der kan bruges i filters
type FilterValue = string | number | boolean | null | undefined;

interface RabbitFilterState {
  // Filter state
  filters: Partial<RabbitSaleFilterDTO>;
  
  // Actions
  updateFilter: (key: keyof RabbitSaleFilterDTO, value: FilterValue) => void;
  clearFilter: (key: keyof RabbitSaleFilterDTO) => void;
  clearAllFilters: () => void;
  syncWithUrl: (searchParams: URLSearchParams) => void;
}

export const saleRabbitsFilterStore = create<RabbitFilterState>()((set) => ({
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
    const newFilters: Partial<RabbitSaleFilterDTO> = {};
    
    // Parse URL parameters to filter object using camelCase keys
    if (searchParams.has('Race')) newFilters.race = searchParams.get('Race') || undefined;
    if (searchParams.has('Color')) newFilters.color = searchParams.get('Color') || undefined;
    if (searchParams.has('Gender')) newFilters.gender = searchParams.get('Gender') || undefined;
    if (searchParams.has('SortBy')) newFilters.sortBy = searchParams.get('SortBy') || undefined;
    if (searchParams.has('CanBeShipped')) newFilters.canBeShipped = searchParams.get('CanBeShipped') === 'true';
    if (searchParams.has('City')) newFilters.city = searchParams.get('City') || undefined;
    
    // Numeric values
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
  }
}));

// Hook for client components
export function useRabbitFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsObj = useSearchParams();
  
  const { 
    filters, 
    updateFilter, 
    clearFilter, 
    clearAllFilters, 
    syncWithUrl 
  } = saleRabbitsFilterStore();
  
  // Apply filters function that needs router
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Transform camelCase keys to PascalCase for URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Convert first character to uppercase
        const urlKey = key.charAt(0).toUpperCase() + key.slice(1);
        params.set(urlKey, String(value));
      }
    });
    
    // Reset page on new filters
    params.delete('Page');
    
    // Navigate with new parameters
    router.push(`${pathname}?${params.toString()}`);
  };

  // Effekt til at synkronisere med URL ved komponentload
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
    syncFiltersWithUrl
  };
}
