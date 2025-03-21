import { getApiUrl } from "../config/apiConfig";

export type RabbitEnum = 'Race' | 'Color' | 'Gender' | 'RabbitHomeEnvironment';

const ENUM_ENDPOINTS = {
    Race: 'Enum/Races',
    Color: 'Enum/Colors',
    Gender: 'Enum/Genders',
    RabbitHomeEnvironment: 'Enum/RabbitHomeEnvironments'  // Tilføj den nye enum endpoint
} as const;

export async function GetEnumValues(enumType: RabbitEnum): Promise<string[]> {
    const endpoint = ENUM_ENDPOINTS[enumType];
    const response = await fetch(getApiUrl(endpoint));
    
    if (!response.ok) {
        throw new Error(`Failed to fetch ${enumType} enum values: ${response.status}`);
    }
    return response.json();
}