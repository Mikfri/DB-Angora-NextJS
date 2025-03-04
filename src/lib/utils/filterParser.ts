// src/lib/utils/filterParser.ts

type FilterValue = string | number | boolean | null;

interface FilterConfig {
  numericFields?: string[];
  booleanFields?: string[];
  dateFields?: string[]; // For dato-felter
}

/**
 * Parse URL search parameters til et strongly-typed filter objekt
 * @param params URLSearchParams objekt fra request
 * @param config Konfiguration for forskellige felttyper
 * @returns Partial af den specificerede filter type
 */
export function parseFilters<T>(
  params: URLSearchParams, 
  config: FilterConfig = {}
): Partial<T> {
    const { numericFields = [], booleanFields = [], dateFields = [] } = config;
    const filters: Record<string, FilterValue> = {};
    
    params.forEach((value, key) => {
      if (!value) {
        filters[key] = null;
        return;
      }
      
      // Håndter numeriske værdier
      if (numericFields.includes(key)) {
        const num = Number(value);
        filters[key] = !isNaN(num) ? num : null;
      }
      // Håndter boolean værdier
      else if (booleanFields.includes(key)) {
        filters[key] = value === 'true' || value === '1';
      }
      // Håndter dato værdier
      else if (dateFields.includes(key)) {
        // Validér at vi har en gyldig dato-string
        const date = new Date(value);
        filters[key] = !isNaN(date.getTime()) ? value : null;
      }
      // Standard string værdier
      else {
        filters[key] = value;
      }
    });
    
    return filters as Partial<T>;
}