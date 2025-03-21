// src/api/endpoints/accountController.ts
import { getApiUrl } from "../config/apiConfig";
import {
    User_ProfileDTO,
    Rabbits_PreviewList, TransferRequest_ReceivedDTO, TransferRequest_ReceivedFilterDTO,
    TransferRequest_SentFilterDTO, TransferRequest_SentDTO
} from "../types/AngoraDTOs";

//-------------------- READ
//-------- User
export async function GetUserProfile(accessToken: string, userProfileId: string): Promise<User_ProfileDTO> {
    const data = await fetch(getApiUrl(`Account/UserProfile/${userProfileId}`), {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userProfile = await data.json();
    return userProfile;
}

//-------- ICollections
//---- Rabbits
/**
 * Henter alle kaniner ejet af den aktuelle bruger
 * @param accessToken 
 * @returns En liste af kaniner [Rabbits_PreviewList]
 */

export async function GetOwnRabbits(accessToken?: string | null): Promise<Rabbits_PreviewList> {
    try {
        // Tjek om token findes
        if (!accessToken) {
            console.log('No access token provided to GetOwnRabbits');
            return []; // Returner tom array hvis ingen token
        }

        const response = await fetch(getApiUrl('Account/Rabbits_Owned'), {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        // Håndter ikke-success statuskoder
        if (!response.ok) {
            console.error(`API error: ${response.status} ${response.statusText}`);
            return []; // Returner tom array ved API fejl
        }

        // Sikker JSON parsing
        const text = await response.text();
        if (!text) return [];
        
        return JSON.parse(text);
    } catch (error) {
        console.error('Error fetching own rabbits:', error);
        return []; // Returner tom array ved alle andre fejl
    }
}


//---- TransferRequests
/**
 * Hent overførselsanmodninger modtaget af den aktuelle bruger
 * @param accessToken Brugerens adgangstoken
 * @param filter Filtreringsparametre for anmodningerne
 * @returns Liste af modtagne overførselsanmodninger
 */
export async function GetReceivedTransferRequests(
    accessToken: string,
    filter?: TransferRequest_ReceivedFilterDTO
): Promise<TransferRequest_ReceivedDTO[]> {
    // Opbyg query string fra filter objektet
    const queryParams = new URLSearchParams();
    if (filter) {
        // Håndter hvert muligt filter-felt
        if (filter.status) queryParams.append('Status', filter.status);
        if (filter.rabbit_EarCombId) queryParams.append('Rabbit_EarCombId', filter.rabbit_EarCombId);
        if (filter.rabbit_NickName) queryParams.append('Rabbit_NickName', filter.rabbit_NickName);
        if (filter.issuer_BreederRegNo) queryParams.append('Issuer_BreederRegNo', filter.issuer_BreederRegNo);
        if (filter.issuer_FirstName) queryParams.append('Issuer_FirstName', filter.issuer_FirstName);
        if (filter.from_dateAccepted) queryParams.append('From_DateAccepted', filter.from_dateAccepted);
    }

    const url = `${getApiUrl('Account/TransferRequests_Received')}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Accept': 'text/plain'
        },
    });

    if (!response.ok) {
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
            const errorResponse = await response.text();
            if (errorResponse) {
                errorMessage = errorResponse;
            }
        } catch (e) {
            console.error('Kunne ikke parse fejlbesked:', e);
        }

        throw new Error(`Fejl ved hentning af modtagne overførselsanmodninger: ${errorMessage}`);
    }

    return response.json();
}

/**
 * Hent overførselsanmodninger udstedt af den aktuelle bruger
 * @param accessToken Brugerens adgangstoken
 * @param filter Filtreringsparametre for anmodningerne
 * @returns Liste af sendte overførselsanmodninger
 */
export async function GetSentTransferRequests(
    accessToken: string,
    filter?: TransferRequest_SentFilterDTO
): Promise<TransferRequest_SentDTO[]> {
    // Opbyg query string fra filter objektet
    const queryParams = new URLSearchParams();
    if (filter) {
        // Håndter hvert muligt filter-felt
        if (filter.status) queryParams.append('Status', filter.status);
        if (filter.rabbit_EarCombId) queryParams.append('Rabbit_EarCombId', filter.rabbit_EarCombId);
        if (filter.rabbit_NickName) queryParams.append('Rabbit_NickName', filter.rabbit_NickName);
        if (filter.recipent_BreederRegNo) queryParams.append('Recipent_BreederRegNo', filter.recipent_BreederRegNo);
        if (filter.recipent_FirstName) queryParams.append('Recipent_FirstName', filter.recipent_FirstName);
        if (filter.from_dateAccepted) queryParams.append('From_DateAccepted', filter.from_dateAccepted);
    }

    const url = `${getApiUrl('Account/TransferRequests_Issued')}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Accept': 'text/plain'
        },
    });

    if (!response.ok) {
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
            const errorResponse = await response.text();
            if (errorResponse) {
                errorMessage = errorResponse;
            }
        } catch (e) {
            console.error('Kunne ikke parse fejlbesked:', e);
        }

        throw new Error(`Fejl ved hentning af udstedte overførselsanmodninger: ${errorMessage}`);
    }

    return response.json();
}