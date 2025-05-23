// src/api/endpoints/rabbitController.ts
import { getApiUrl } from "../config/apiConfig";
import { Rabbit_CreateDTO, Rabbit_ProfileDTO, SaleDetailsCardList, Rabbit_ForsaleProfileDTO, Rabbits_ForbreedingPreviewList, Rabbit_UpdateDTO, Rabbit_PreviewDTO, Rabbit_CreateSaleDetailsDTO, Rabbit_SaleDetailsDTO, Rabbit_UpdateSaleDetailsDTO, CloudinaryUploadConfigDTO, Rabbit_PedigreeDTO } from "../types/AngoraDTOs";
import { ForSaleFilters } from "../types/filterTypes";


//-------------------- CREATE
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

export async function CreateSaleDetails(
    saleDetails: Rabbit_CreateSaleDetailsDTO,
    accessToken: string
): Promise<Rabbit_SaleDetailsDTO> {
    const response = await fetch(getApiUrl('Rabbit/CreateSaleDetails'), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        },
        body: JSON.stringify(saleDetails)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            sentData: saleDetails
        });
        throw new Error(`Failed to create sale details: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

//-------------------- READ

/**
 * Anmoder om tilladelse til at uploade et foto til Cloudinary for en specifik kanin
 * 
 * @param accessToken - Brugerens JWT authentication token
 * @param earCombId - Kaninens øremærke-id
 * @returns Oplysninger til brug ved upload til Cloudinary
 */
export async function GetRabbitPhotoUploadPermission(
    accessToken: string,
    earCombId: string
): Promise<CloudinaryUploadConfigDTO> {
    //const response = await fetch(getApiUrl(`Rabbit/photo-upload-permission/${earCombId}`), {
    const response = await fetch(getApiUrl(`Rabbit/photo-upload-config/${earCombId}`), {

        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get photo upload permission: ${response.status} - ${errorText}`);
    }

    return response.json();
}

/**
 * Henter kaniner til salg med angivne filtre
 * @param filters Valgfrie søgefiltre
 * @returns Liste over kaniner der matcher søgekriterierne
 */
export async function GetRabbitsForSale(filters?: ForSaleFilters): Promise<SaleDetailsCardList> {
    let url = getApiUrl('Rabbit/ForSale');

    if (filters) {
        const params = new URLSearchParams();

        // Tilføj kun definerede værdier til URL
        Object.entries(filters).forEach(([key, value]) => {
            // Konverter kun værdier der faktisk findes (ikke undefined og ikke null)
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });

        const queryString = params.toString();
        if (queryString) {
            url += '?' + queryString;
        }
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'text/plain'
        }
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
    }

    return response.json();
}

export async function GetRabbitForsaleProfile(earCombId: string): Promise<Rabbit_ForsaleProfileDTO> {
    const url = getApiUrl(`Rabbit/ForsaleProfile/${earCombId}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error when fetching rabbit profile: Status ${response.status}`, errorText);
        throw new Error(`API call failed: ${response.status}`);
    }
    
    const data = await response.json();

    return data;
}

export async function GetRabbitsForBreeding(accessToken: string): Promise<Rabbits_ForbreedingPreviewList> {
    const data = await fetch(getApiUrl('Rabbit/Forbreeding'), {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const forbreedingRabbits = await data.json();
    //console.log('API Response:', forbreedingRabbits); // Debug log
    return forbreedingRabbits;
}

/**
* Henter en kaninprofil ud fra øremærke
*/
export async function GetRabbitProfile(accessToken: string, earCombId: string): Promise<Rabbit_ProfileDTO> {
    const data = await fetch(getApiUrl(`Rabbit/Profile/${earCombId}`), {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    const rabbitProfile = await data.json();
    //console.log('API Response:', rabbitProfile); // Debug log
    return rabbitProfile;
}

// PEDIGREE
/**
 * Henter stamtræet for en specifik kanin
 * 
 * @param accessToken - Brugerens JWT authentication token
 * @param earCombId - Kaninens øremærke-id
 * @returns Stamtræ for kaninen med indavlskoefficient og relationer
 */
export async function GetRabbitPedigree(
    accessToken: string,
    earCombId: string
): Promise<Rabbit_PedigreeDTO> {
    const response = await fetch(getApiUrl(`Rabbit/Pedigree/${earCombId}`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
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
        throw new Error(`Failed to fetch rabbit pedigree: ${response.status} ${response.statusText}`);
    }

    return response.json();
}



//-------------------- UPDATE

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

export async function UpdateSaleDetails(
    saleDetailsId: number,
    updateSaleDetailsDTO: Rabbit_UpdateSaleDetailsDTO,
    accessToken: string
): Promise<Rabbit_SaleDetailsDTO> {
    const response = await fetch(getApiUrl(`Rabbit/UpdateSaleDetails/${saleDetailsId}`), {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        },
        body: JSON.stringify(updateSaleDetailsDTO)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            sentData: updateSaleDetailsDTO
        });
        throw new Error(`Failed to update sale details: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

//-------------------- DELETE
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

export async function DeleteSaleDetails(
    saleDetailsId: number,
    accessToken: string
): Promise<{ message: string }> {
    const response = await fetch(getApiUrl(`Rabbit/DeleteSaleDetails/${saleDetailsId}`), {
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

        if (response.status === 404) {
            throw new Error('Sale details not found or you do not have permission to delete them.');
        }

        throw new Error(`Failed to delete sale details: ${response.status} ${response.statusText}`);
    }

    return response.json();
}