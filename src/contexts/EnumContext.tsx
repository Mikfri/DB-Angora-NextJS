// src/contexts/EnumContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GetEnumValues, type EnumType } from '@/api/endpoints/enumController';

// Re-export type så komponenter kan bruge den
export type { EnumType };

/**
 * Cache type - mapper enum type til array af værdier
 */
type EnumCache = Partial<Record<EnumType, string[]>>;

/**
 * Context interface med alle tilgængelige metoder
 */
interface EnumContextType {
    getEnumValues: (enumType: EnumType) => Promise<string[]>;
    getMultipleEnumValues: (enumTypes: EnumType[]) => Promise<Record<EnumType, string[]>>;
    isLoading: (enumType: EnumType) => boolean;
    resetCache: () => void;
}

const EnumContext = createContext<EnumContextType | null>(null);

// Hyppigt brugte enums for pre-fetching (kan tilpasses efter behov)
const COMMON_ENUMS: EnumType[] = ['Race', 'Color', 'Gender'];

// Cache konfiguration
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 dage
const CACHE_VERSION = '1.1.0'; // Opdateret version
const CACHE_KEY = 'db-angora-enum-cache';
const CACHE_TIMESTAMP_KEY = 'db-angora-enum-cache-timestamp';
const CACHE_VERSION_KEY = 'db-angora-enum-cache-version';

/**
 * Ryd localStorage cache
 */
function clearLocalStorageCache() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        localStorage.removeItem(CACHE_VERSION_KEY);
    }
}

/**
 * Indlæs cache fra localStorage
 */
function loadCacheFromStorage(): EnumCache {
    if (typeof window === 'undefined') return {};

    const savedCache = localStorage.getItem(CACHE_KEY);
    const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const cacheVersion = localStorage.getItem(CACHE_VERSION_KEY);

    // Tjek version
    if (cacheVersion !== CACHE_VERSION) {
        console.log('📦 Enum cache version mismatch, clearing...');
        clearLocalStorageCache();
        return {};
    }

    // Tjek timestamp
    if (savedCache && cacheTimestamp) {
        const now = Date.now();
        const timestamp = parseInt(cacheTimestamp, 10);

        if (!isNaN(timestamp) && now - timestamp < CACHE_EXPIRY) {
            try {
                console.log('📦 Loaded enums from localStorage cache');
                return JSON.parse(savedCache);
            } catch (e) {
                console.error('Failed to parse cached enums:', e);
                clearLocalStorageCache();
            }
        } else {
            console.log('📦 Enum cache expired');
            clearLocalStorageCache();
        }
    }

    return {};
}

/**
 * EnumProvider - håndterer enum caching og fetching
 */
export function EnumProvider({ children }: { children: ReactNode }) {
    const [cache, setCache] = useState<EnumCache>(loadCacheFromStorage);
    const [loadingEnums, setLoadingEnums] = useState<Record<string, boolean>>({});

    /**
     * Nulstil cache manuelt
     */
    const resetCache = useCallback(() => {
        clearLocalStorageCache();
        setCache({});
        console.log('🧹 Enum cache cleared manually');
    }, []);

    /**
     * Hent enum-værdier med caching
     */
    const getEnumValues = useCallback(async (enumType: EnumType): Promise<string[]> => {
        // Return fra cache hvis tilgængelig
        if (cache[enumType]) {
            console.log(`📋 Using cached ${enumType} enum values`);
            return cache[enumType]!;
        }

        // Sæt loading state
        setLoadingEnums(prev => ({ ...prev, [enumType]: true }));

        try {
            console.log(`🔄 Fetching ${enumType} enum values from API`);
            const values = await GetEnumValues(enumType);

            // Gem i cache
            setCache(prev => ({ ...prev, [enumType]: values }));
            return values;
        } catch (error) {
            console.error(`Failed to load ${enumType} enum values:`, error);
            return [];
        } finally {
            setLoadingEnums(prev => ({ ...prev, [enumType]: false }));
        }
    }, [cache]);

    /**
     * Hent flere enum-værdier på én gang
     */
    const getMultipleEnumValues = useCallback(async (
        enumTypes: EnumType[]
    ): Promise<Record<EnumType, string[]>> => {
        const results: Partial<Record<EnumType, string[]>> = {};

        // Filtrer enums vi ikke har cached
        const missingEnums = enumTypes.filter(enumType => !cache[enumType]);

        // Return alt fra cache hvis muligt
        if (missingEnums.length === 0) {
            console.log('📋 Using cached values for all requested enums');
            enumTypes.forEach(enumType => {
                results[enumType] = cache[enumType]!;
            });
            return results as Record<EnumType, string[]>;
        }

        // Fetch manglende enums parallelt
        console.log(`🔄 Fetching ${missingEnums.length} missing enums`);
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

        // Tilføj cached enums
        enumTypes.forEach(enumType => {
            if (!results[enumType] && cache[enumType]) {
                results[enumType] = cache[enumType]!;
            }
        });

        return results as Record<EnumType, string[]>;
    }, [cache, getEnumValues]);

    /**
     * Tjek om enum er ved at blive loaded
     */
    const isLoading = useCallback((enumType: EnumType): boolean => {
        return !!loadingEnums[enumType];
    }, [loadingEnums]);

    /**
     * Pre-fetch hyppigt brugte enums ved mount
     */
    const prefetchCommonEnums = useCallback(async () => {
        const missingEnums = COMMON_ENUMS.filter(enumType => !cache[enumType]);

        if (missingEnums.length === 0) {
            console.log('✅ All common enums already cached');
            return;
        }

        console.log(`🚀 Pre-fetching ${missingEnums.length} common enums`);
        try {
            await getMultipleEnumValues(missingEnums);
            console.log('✅ Common enum pre-fetching complete');
        } catch (error) {
            console.error('Error pre-fetching enums:', error);
        }
    }, [cache, getMultipleEnumValues]);

    // Pre-fetch ved mount
    useEffect(() => {
        prefetchCommonEnums();
    }, [prefetchCommonEnums]);

    // Gem cache til localStorage ved ændringer
    useEffect(() => {
        if (typeof window !== 'undefined' && Object.keys(cache).length > 0) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
            localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
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

/**
 * Hook til at bruge enum context
 */
export function useEnums() {
    const context = useContext(EnumContext);
    if (!context) {
        throw new Error('useEnums must be used within an EnumProvider');
    }
    return context;
}