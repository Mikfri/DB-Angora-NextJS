// src/store/saleRabbitsFilterStore.ts
import { create } from 'zustand';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Rabbit_ForSaleFilterDTO } from '@/api/types/filterTypes';

// Lav en type for værdier der kan bruges i filters
type FilterValue = string | number | boolean | null | undefined;

interface RabbitFilterState {
  // Filter state
  filters: Partial<Rabbit_ForSaleFilterDTO>;
  
  // Actions
  updateFilter: (key: keyof Rabbit_ForSaleFilterDTO, value: FilterValue) => void;
  clearFilter: (key: keyof Rabbit_ForSaleFilterDTO) => void;
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
    const newFilters: Partial<Rabbit_ForSaleFilterDTO> = {};
    
    // Parse URL parameters to filter object using camelCase keys
    if (searchParams.has('Race')) newFilters.race = searchParams.get('Race') || undefined;
    if (searchParams.has('Color')) newFilters.color = searchParams.get('Color') || undefined;
    if (searchParams.has('Gender')) newFilters.gender = searchParams.get('Gender') || undefined;
    
    // Numeric values
    if (searchParams.has('MinZipCode')) {
      const val = parseInt(searchParams.get('MinZipCode') || '0');
      if (!isNaN(val)) newFilters.minZipCode = val;
    }
    
    if (searchParams.has('MaxZipCode')) {
      const val = parseInt(searchParams.get('MaxZipCode') || '0');
      if (!isNaN(val)) newFilters.maxZipCode = val;
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