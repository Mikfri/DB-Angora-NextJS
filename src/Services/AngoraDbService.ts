// src/services/AngoraDbService.ts
import { Rabbit_UpdateDTO, Rabbit_ProfileDTO, Rabbits_ForsalePreviewList, Rabbit_CreateDTO, LoginResponse, Rabbits_PreviewList, Rabbit_PreviewDTO, Rabbit_ForsaleProfileDTO, User_ProfileDTO } from "@/Types/backendTypes";
import { ForSaleFilters } from "@/Types/filterTypes";
import { getApiUrl } from '@/config/apiConfig';

export async function CreateRabbit(rabbitData: Rabbit_CreateDTO, accessToken: string): Promise<Rabbit_ProfileDTO> {
    const response = await fetch(getApiUrl('Rabbit/Create'), {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'accept': 'text/plain'
        },
        body: JSON.stringify(rabbitData)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            sentData: rabbitData
        });
        throw new Error(`Failed to create rabbit: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

export async function GetRabbitsForSale(filters?: ForSaleFilters): Promise<Rabbits_ForsalePreviewList> {
    const params = new URLSearchParams();
    
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value != null) {
                params.append(key, value.toString());
            }
        });
    }

    const url = `${getApiUrl('Rabbit/Forsale')}${params.toString() ? `?${params}` : ''}`;
    //console.log('Fetching URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
    }

    return response.json();
}

export async function GetRabbitForsaleProfile(earCombId: string): Promise<Rabbit_ForsaleProfileDTO> {
    const response = await fetch(getApiUrl(`Rabbit/ForsaleProfile/${earCombId}`));
    if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
    }
    return response.json();
}

export async function GetRabbitsForBreeding(): Promise<Rabbits_ForsalePreviewList> {
    const data = await fetch(getApiUrl('Rabbit/Forbreeding'));
    return data.json();
}

export async function GetOwnRabbits(accessToken: string): Promise<Rabbits_PreviewList> {
    const data = await fetch(getApiUrl('Account/Rabbits_Owned'), {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const ownRabbits = await data.json();
    //console.log('API Response:', ownRabbits); // Debug log
    return ownRabbits;
}

export async function GetRabbitProfile(accessToken: string, earCombId: string): Promise<Rabbit_ProfileDTO> {
    const data = await fetch(getApiUrl(`Rabbit/Profile/${earCombId}`), {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    const rabbitProfile = await data.json();
    //console.log('API Response:', rabbitProfile); // Debug log
    return rabbitProfile;
}

export async function EditRabbit(earCombId: string, rabbitData: Rabbit_UpdateDTO, accessToken: string): Promise<Rabbit_ProfileDTO> {
    const formattedData = {
        ...rabbitData,
        dateOfBirth: rabbitData.dateOfBirth,
        dateOfDeath: rabbitData.dateOfDeath || null
    };

    const response = await fetch(getApiUrl(`Rabbit/Update/${earCombId}`), {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'accept': 'text/plain'
        },
        body: JSON.stringify(formattedData)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            sentData: formattedData
        });
        throw new Error(`Failed to update rabbit: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
}

export async function DeleteRabbit(earCombId: string, accessToken: string): Promise<Rabbit_PreviewDTO> {
    const response = await fetch(getApiUrl(`Rabbit/Delete/${earCombId}`), {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'accept': 'text/plain'
        }
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
        });
        throw new Error(`Failed to delete rabbit: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

export async function Login(userName: string, password: string): Promise<LoginResponse> {
    const response = await fetch(getApiUrl('Auth/Login'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password, rememberMe: false })
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
    }

    return response.json();
}

export type RabbitEnum = 'Race' | 'Color' | 'Gender' | 'IsPublic';

const ENUM_ENDPOINTS = {
    Race: 'Enum/Races',
    Color: 'Enum/Colors',
    Gender: 'Enum/Genders',
    IsPublic: 'Enum/IsPublic'
} as const;

export async function GetEnumValues(enumType: RabbitEnum): Promise<string[]> {
    const endpoint = ENUM_ENDPOINTS[enumType];
    const response = await fetch(getApiUrl(endpoint));
    
    if (!response.ok) {
        throw new Error(`Failed to fetch ${enumType} enum values: ${response.status}`);
    }
    return response.json();
}
export async function GetUserProfile(accessToken: string, userProfileId: string): Promise<User_ProfileDTO> {
    const data = await fetch(getApiUrl(`Account/UserProfile/${userProfileId}`), {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userProfile = await data.json();
    return userProfile;
}