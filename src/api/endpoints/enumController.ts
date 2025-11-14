import { getApiUrl } from "../config/apiConfig";

/**
 * Alle tilgængelige enum endpoints
 * Bruges til type-safety og auto-completion
 */
const ENUM_ENDPOINTS = {
    // Kanin-relaterede enums
    Race: 'Enum/Races',
    Color: 'Enum/Colors',
    Gender: 'Enum/Genders',
    RabbitHomeEnvironment: 'Enum/RabbitHomeEnvironments',
    EntityType: 'Enum/EntityTypes',
    
    // Blog-relaterede enums
    BlogCategories: 'Enum/BlogCategories',
    BlogSortOptions: 'Enum/BlogSortOptions',
} as const;

/**
 * Union type af alle enum keys
 * Giver type-safety når vi kalder GetEnumValues
 */
export type EnumType = keyof typeof ENUM_ENDPOINTS;

/**
 * Hent enum-værdier fra API med caching
 * @param enumType - Enum type at hente (fx 'Race', 'BlogCategories')
 * @returns Array af enum-værdier som strings
 */
export async function GetEnumValues(enumType: EnumType): Promise<string[]> {
    const endpoint = ENUM_ENDPOINTS[enumType];
    
    try {
        const response = await fetch(getApiUrl(endpoint), {
            cache: 'force-cache', // Browser-level caching
            next: { revalidate: 604800 } // Next.js cache: 7 dage
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch ${enumType}: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${enumType} enum:`, error);
        throw error;
    }
}

/**
 * Type guard til at tjekke om en string er en valid EnumType
 */
export function isValidEnumType(value: string): value is EnumType {
    return value in ENUM_ENDPOINTS;
}