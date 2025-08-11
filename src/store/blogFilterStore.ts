// src/store/blogFilterStore.ts

/**
 * BlogFilterStore (Zustand)
 * -----------------------------------
 * Central state management for blog filter/search UI.
 *
 * Ansvar:
 *  - Holder og opdaterer alle filterværdier for blogs (searchTerm, authorFullName, tagFilter)
 *  - Synkroniserer filter state med URL (både fra og til URL)
 *  - Gør det muligt for alle blog-komponenter at læse/ændre filter state uden prop-drilling
 *  - Giver actions til at opdatere, nulstille og synkronisere filtre samt at "apply filters" (dvs. opdatere URL)
 *
 * Brugsmønster:
 *  - Importér og brug `useBlogFilters()` hook i dine client components
 *  - Læs/skriv til filters, brug updateFilter/clearFilter/applyFilters mv.
 *  - URL'en opdateres automatisk korrekt, og state bevares på tværs af navigation
 *
 * Fordele ved Zustand fremfor Context:
 *  - Ingen prop-drilling, ingen behov for at wrappe i en provider
 *  - Meget letvægts og performant (kun de hooks der bruger state re-rendres)
 *  - Kan bruges direkte i alle client components, også dybt i træet
 *  - Simpel API og nem at udvide
 *
 * Ulemper/alternativer:
 *  - Context kan være mere "idiomatisk" i Next.js hvis du har brug for SSR eller vil dele mere kompleks state
 *  - Context kræver dog mere boilerplate og kan give unødvendige re-renders hvis ikke optimeret
 *
 * Konklusion:
 *  - Zustand er et fremragende valg til UI-filtre og søge-state, især hvor du ønsker global, men letvægts, state management
 *  - Context kan være bedre hvis du har brug for SSR, eller hvis state skal deles med server components
 *
 * Hvorfor vi har valgt Zustand fremfor Context i dette projekt:
 *  - Blog-filtrene påvirker kun brugerens visning og har minimal SEO-værdi, da vi ikke ønsker at alle filter-kombinationer skal være SEO-landingssider.
 *  - Vi har ikke behov for at hydrere eller dele filter-state mellem server og klient, kun hurtig og brugervenlig client-side state.
 *  - Zustand giver os en simpel, reaktiv og prop-drill-fri løsning, der matcher vores behov for UI/UX og performance.
 *  - Hvis vi senere ønsker SEO på filter-kombinationer, kan vi altid flytte til Context/SSR for netop de cases.
 */
import { create } from 'zustand';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Blog_CardFilterDTO } from '@/api/types/AngoraDTOs';

// Lav en type for værdier der kan bruges i filters
type FilterValue = string | number | boolean | null | undefined;

interface BlogFilterState {
  // Filter state
  filters: Partial<Blog_CardFilterDTO>;
  
  // Actions
  updateFilter: (key: keyof Blog_CardFilterDTO, value: FilterValue) => void;
  clearFilter: (key: keyof Blog_CardFilterDTO) => void;
  clearAllFilters: () => void;
  syncWithUrl: (searchParams: URLSearchParams) => void;
}

export const blogFilterStore = create<BlogFilterState>()((set) => ({
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
    const newFilters: Partial<Blog_CardFilterDTO> = {};
    
    // Parse URL parameters to filter object using camelCase keys
    if (searchParams.has('AuthorFullName')) newFilters.authorFullName = searchParams.get('AuthorFullName') || undefined;
    if (searchParams.has('SearchTerm')) newFilters.searchTerm = searchParams.get('SearchTerm') || undefined;
    if (searchParams.has('TagFilter')) newFilters.tagFilter = searchParams.get('TagFilter') || undefined;
    
    set({ filters: newFilters });
  }
}));

// Hook for client components
export function useBlogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsObj = useSearchParams();
  
  const { 
    filters, 
    updateFilter, 
    clearFilter, 
    clearAllFilters, 
    syncWithUrl 
  } = blogFilterStore();
  
  // Apply filters function that needs router
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Transform camelCase keys to PascalCase for URL (samme som API forventer)
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'authorFullName') {
          params.set('AuthorFullName', String(value));
        } else if (key === 'searchTerm') {
          params.set('SearchTerm', String(value));
        } else if (key === 'tagFilter') {
          params.set('TagFilter', String(value));
        }
        // Ignorer page, pageSize, blogSortOption
      }
    });
    
    // Reset page on new filters (hvis vi senere tilføjer pagination)
    params.delete('Page');
    
    // Tilføj dummy parameter hvis ingen filtre
    if (params.toString() === '') {
      params.set('all', 'true');
    }
    
    // Navigate with new parameters
    router.push(`${pathname}?${params.toString()}`);
  };

  // Funktion til at synkronisere med URL ved komponentload
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
