// src/contexts/EnumContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GetEnumValues, RabbitEnum } from '@/api/endpoints/enumController';

// Re-export enum typen så komponenter ikke behøver direkte afhængighed til API laget
export type { RabbitEnum };

// Type definition for our cache
type EnumCache = {
    [key in RabbitEnum]?: string[];
};

// Type for the context
interface EnumContextType {
    getEnumValues: (enumType: RabbitEnum) => Promise<string[]>;
    getMultipleEnumValues: (enumTypes: RabbitEnum[]) => Promise<Record<RabbitEnum, string[]>>;
    isLoading: (enumType: RabbitEnum) => boolean;
    resetCache: () => void; // Tilføjet reset funktion
}

// Create the context
const EnumContext = createContext<EnumContextType | null>(null);

// Hyppigt brugte enums for pre-fetching
const COMMON_ENUMS: RabbitEnum[] = ['Race', 'Color', 'Gender'];

// Cache ekspiration periode - 7 dage
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000;

// Cache version - opdater dette hvis enum struktur ændres
const CACHE_VERSION = '1.0.1';

// Helper funktion - flyttet ud af komponenten for at undgå cirkulær reference
function clearLocalStorageCache() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('db-angora-enum-cache');
        localStorage.removeItem('db-angora-enum-cache-timestamp');
        localStorage.removeItem('db-angora-enum-cache-version');
    }
}

export function EnumProvider({ children }: { children: ReactNode }) {
    // Initialiser cache fra localStorage hvis tilgængelig
    const [cache, setCache] = useState<EnumCache>(() => {
        if (typeof window !== 'undefined') {
            const savedCache = localStorage.getItem('db-angora-enum-cache');
            const cacheTimestamp = localStorage.getItem('db-angora-enum-cache-timestamp');
            const cacheVersion = localStorage.getItem('db-angora-enum-cache-version');

            // Tjek om cache version matcher
            if (savedCache && cacheTimestamp && cacheVersion === CACHE_VERSION) {
                const now = Date.now();
                const timestamp = parseInt(cacheTimestamp, 10);

                // Tjek om cachen er mindre end 7 dage gammel
                if (!isNaN(timestamp) && now - timestamp < CACHE_EXPIRY) {
                    try {
                        console.log('📦 Loaded enums from localStorage cache');
                        return JSON.parse(savedCache);
                    } catch (e) {
                        console.error('Failed to parse cached enums:', e);
                    }
                } else {
                    console.log('📦 Enum cache expired, will fetch fresh data');
                    clearLocalStorageCache();
                }
            } else if (cacheVersion !== CACHE_VERSION) {
                console.log('📦 Enum cache version changed, clearing old cache');
                clearLocalStorageCache();
            }
        }
        return {};
    });

    const [loadingEnums, setLoadingEnums] = useState<Record<string, boolean>>({});

    // Expose as public method - bruger nu den globale funktion
    const resetCache = useCallback(() => {
        clearLocalStorageCache();
        setCache({});
        console.log('🧹 Enum cache cleared manually');
    }, []);

    // Function to get enum values with caching
    const getEnumValues = useCallback(async (enumType: RabbitEnum): Promise<string[]> => {
        // Return from cache if available
        if (cache[enumType]) {
            console.log(`📋 Using cached ${enumType} enum values`);
            return cache[enumType]!;
        }

        // Set loading state
        setLoadingEnums(prev => ({ ...prev, [enumType]: true }));
        
        try {
            // Fetch from API
            console.log(`🔄 Fetching ${enumType} enum values`);
            const values = await GetEnumValues(enumType);
            
            // Store in cache
            setCache(prev => ({ ...prev, [enumType]: values }));
            return values;
        } catch (error) {
            console.error(`Failed to load ${enumType} enum values:`, error);
            return [];
        } finally {
            setLoadingEnums(prev => ({ ...prev, [enumType]: false }));
        }
    }, [cache]);

    // Function to get multiple enum values at once
    const getMultipleEnumValues = useCallback(async (enumTypes: RabbitEnum[]): Promise<Record<RabbitEnum, string[]>> => {
        const results: Partial<Record<RabbitEnum, string[]>> = {};
        
        // Filter only enums we don't have cached
        const missingEnums = enumTypes.filter(enumType => !cache[enumType]);
        
        // Return all from cache if possible
        if (missingEnums.length === 0) {
            console.log('📋 Using cached values for all requested enums');
            enumTypes.forEach(enumType => {
                results[enumType] = cache[enumType]!;
            });
            return results as Record<RabbitEnum, string[]>;
        }
        
        // Fetch missing enums in parallel
        await Promise.all(
            missingEnums.map(async (enumType) => {
                try {
                    results[enumType] = await getEnumValues(enumType);
                } catch (error) {
                    console.error(`Failed to load ${enumType}:`, error);
                    results[enumType] = [];
                }
            })
        );
        
        // Add cached enums to results
        enumTypes.forEach(enumType => {
            if (!results[enumType] && cache[enumType]) {
                results[enumType] = cache[enumType]!;
            }
        });
        
        return results as Record<RabbitEnum, string[]>;
    }, [cache, getEnumValues]);

    // Provide loading status
    const isLoading = useCallback((enumType: RabbitEnum): boolean => {
        return !!loadingEnums[enumType];
    }, [loadingEnums]);

    // Pre-fetch hyppigt brugte enums ved mount med useCallback
    const prefetchCommonEnums = useCallback(async () => {
        console.log('🚀 Pre-fetching common enum values');
        
        // Filter kun enums vi ikke allerede har i cache
        const missingEnums = COMMON_ENUMS.filter(enumType => !cache[enumType]);
        
        if (missingEnums.length === 0) {
            console.log('✅ All common enums already in cache');
            return;
        }
        
        try {
            await getMultipleEnumValues(missingEnums);
            console.log('✅ Common enum pre-fetching complete');
        } catch (error) {
            console.error('Error pre-fetching enums:', error);
        }
    }, [cache, getMultipleEnumValues]);

    // Kør prefetch ved mount
    useEffect(() => {
        prefetchCommonEnums();
    }, [prefetchCommonEnums]);

    // Gem cache til localStorage når det ændres
    useEffect(() => {
        if (typeof window !== 'undefined' && Object.keys(cache).length > 0) {
            localStorage.setItem('db-angora-enum-cache', JSON.stringify(cache));
            localStorage.setItem('db-angora-enum-cache-timestamp', Date.now().toString());
            localStorage.setItem('db-angora-enum-cache-version', CACHE_VERSION);
        }
    }, [cache]);

    return (
        <EnumContext.Provider value={{ 
            getEnumValues, 
            getMultipleEnumValues, 
            isLoading,
            resetCache 
        }}>
            {children}
        </EnumContext.Provider>
    );
}

// Hook to use the enum context
export function useEnums() {
    const context = useContext(EnumContext);
    if (!context) {
        throw new Error('useEnums must be used within an EnumProvider');
    }
    return context;
}