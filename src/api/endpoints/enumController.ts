import { getApiUrl } from "../config/apiConfig";

/**
 * Repræsenterer et enum-par som returneres af API'en
 * Bemærk: .NET's JSON serializer bruger camelCase som standard
 */
export interface EnumOption {
    name: string;   
    value: number;
}

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

    // Pelt-relaterede enums
    TanningMethod: 'Enum/TanningMethods',
    PeltCondition: 'Enum/PeltConditions',

    // Wool-relaterede enums
    WoolFiberType: 'Enum/WoolFiberTypes',
    WoolNaturalColor: 'Enum/WoolNaturalColors',
    WoolDyedColor: 'Enum/WoolDyedColors',

    // Yarn-relaterede enums
    YarnWeightCategory: 'Enum/YarnWeightCategory',
    YarnWpiCategory: 'Enum/YarnWpiCategory',
    YarnApplicationCategory: 'Enum/YarnApplicationCategory',
    YarnConsistency: 'Enum/YarnConsistency',
    YarnTwistAmount: 'Enum/YarnTwistAmount',
    SoftnessScore: 'Enum/SoftnessScore',
    DurabilityScore: 'Enum/DurabilityScore',
} as const;

/**
 * Union type af alle enum keys
 * Giver type-safety når vi kalder GetEnumValues
 */
export type EnumType = keyof typeof ENUM_ENDPOINTS;

/**
 * Hent enum-værdier fra API med caching
 * @param enumType - Enum type at hente (fx 'Race', 'BlogCategories')
 * @returns Array af { Name, Value } objekter
 */
export async function GetEnumValues(enumType: EnumType): Promise<EnumOption[]> {
    const endpoint = ENUM_ENDPOINTS[enumType];

    try {
        const response = await fetch(getApiUrl(endpoint), {
            cache: 'no-store' // Caching håndteres af EnumContext (localStorage, 7 dage)
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