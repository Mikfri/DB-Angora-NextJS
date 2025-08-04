// src/api/endpoints/rabbitController.ts
import { getApiUrl } from "../config/apiConfig";
import {
    Rabbit_CreateDTO, Rabbit_ProfileDTO, SaleDetailsCardList,
    Rabbits_ForbreedingPreviewList, Rabbit_UpdateDTO, Rabbit_PreviewDTO,
    Rabbit_CreateSaleDetailsDTO, Rabbit_UpdateSaleDetailsDTO,
    CloudinaryUploadConfigDTO, Rabbit_PedigreeDTO,
    SaleDetailsProfileDTO,
    PhotoPrivateDTO,
    PhotoDeleteDTO,
    CloudinaryPhotoRegistryRequestDTO,
    Rabbit_ParentValidationResultDTO,
} from "../types/AngoraDTOs";
import { Rabbit_ForSaleFilterDTO } from "../types/filterTypes";


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
        let apiMessage = '';
        try {
            const parsed = JSON.parse(errorText);
            apiMessage = parsed.message || errorText;
        } catch {
            apiMessage = errorText;
        }
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            sentData: rabbitData
        });
        // Send API-beskeden videre!
        throw new Error(apiMessage || `Failed to create rabbit: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Opretter salgsdetaljer for en kanin
 * @param earCombId Kaninens øremærke-id
 * @param saleDetails Data for salgsopslaget
 * @param accessToken Brugerens JWT token
 * @returns De oprettede salgsdetaljer
 */
export async function CreateSaleDetails(
    earCombId: string,
    saleDetails: Rabbit_CreateSaleDetailsDTO,
    accessToken: string
): Promise<SaleDetailsProfileDTO> {
    const response = await fetch(getApiUrl(`Rabbit/CreateSaleDetails/${earCombId}`), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json' // <-- Skift fra 'text/plain' til 'application/json'
        },
        body: JSON.stringify(saleDetails)
    });

    if (!response.ok) {
        const errorText = await response.text();
        let apiMessage = '';
        try {
            const parsed = JSON.parse(errorText);
            apiMessage = parsed.message || errorText;
        } catch {
            apiMessage = errorText;
        }
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            sentData: saleDetails
        });
        // Send API-beskeden videre!
        throw new Error(apiMessage || `Failed to create sale details: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Registrerer et billede fra Cloudinary specifikt for en kanin.
 * @param accessToken JWT token for bruger
 * @param earCombId Kaninens øremærke-id
 * @param requestDTO Billede-detaljer fra Cloudinary
 * @returns Det nye oprettede PhotoPrivateDTO
 */
export async function RegisterRabbitPhoto(
  accessToken: string,
  earCombId: string,
  requestDTO: CloudinaryPhotoRegistryRequestDTO
): Promise<PhotoPrivateDTO> {
  const response = await fetch(getApiUrl(`Rabbit/${earCombId}/register-photo`), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestDTO)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Fejl: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

//-------------------- READ

/**
 * Henter Cloudinary upload-konfiguration for en specifik kanin, hvis brugeren har rettigheder.
 * @param accessToken JWT token for bruger
 * @param earCombId Kaninens øremærke-id
 * @returns CloudinaryUploadConfigDTO
 */
export async function GetRabbitPhotoUploadPermission(
    accessToken: string,
    earCombId: string
): Promise<CloudinaryUploadConfigDTO> {
    const response = await fetch(getApiUrl(`Rabbit/${earCombId}/photo-upload-permission`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        // Fejlbeskeder fra API'en stoles på og sendes videre
        const errorText = await response.text();
        throw new Error(errorText || `Fejl: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Validerer om en kanin eksisterer og har det forventede køn (forældrevalidering).
 * @param accessToken JWT token for bruger
 * @param parentId Øremærke på den potentielle forældrekanin
 * @param expectedGender Forventet køn ('Buck' for far, 'Doe' for mor)
 * @returns Valideringsresultat med evt. kanindetaljer
 */
export async function ValidateParentReference(
  accessToken: string,
  parentId: string,
  expectedGender: string // Typisk 'Buck' eller 'Doe'
): Promise<Rabbit_ParentValidationResultDTO> {
  const url = getApiUrl(`Rabbit/Validate-parent?parentId=${encodeURIComponent(parentId)}&expectedGender=${encodeURIComponent(expectedGender)}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Fejl: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Henter kaniner til salg med angivne filtre
 * @param filters Valgfrie søgefiltre
 * @returns Liste over kaniner der matcher søgekriterierne
 */
export async function GetRabbitsForSale(filters?: Rabbit_ForSaleFilterDTO): Promise<SaleDetailsCardList> {
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



//-------------------- PUT

export async function EditRabbit(earCombId: string,
    rabbitData: Rabbit_UpdateDTO,
    accessToken: string): Promise<Rabbit_ProfileDTO> {
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

/**
 * Opdaterer salgsdetaljer for en kanin
 * @param earCombId Kaninens øremærke-id
 * @param updateSaleDetailsDTO Opdaterede salgsoplysninger
 * @param accessToken Brugerens JWT token
 * @returns Boolean som indikerer om opdateringen var succesfuld
 */
export async function UpdateSaleDetails(
    earCombId: string,
    updateSaleDetailsDTO: Rabbit_UpdateSaleDetailsDTO,
    accessToken: string
): Promise<boolean> {
    const response = await fetch(getApiUrl(`Rabbit/UpdateSaleDetails/${earCombId}`), {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        },
        body: JSON.stringify(updateSaleDetailsDTO)
    });

    if (!response.ok) {
        // Hent fejlbesked fra API'en
        const errorData = await response.json().catch(() => ({ message: `Fejl: ${response.status} ${response.statusText}` }));
        const errorMessage = errorData.message || `Kunne ikke opdatere salgsdetaljer: ${response.status} ${response.statusText}`;

        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            errorData,
            sentData: updateSaleDetailsDTO
        });

        throw new Error(errorMessage);
    }

    // Hvis response body er tom eller ikke valid JSON, returner true baseret på success status
    if (response.headers.get('content-length') === '0') {
        return true;
    }

    try {
        // Prøv at parse response som JSON
        const result = await response.json();
        return result === true || Boolean(result); // Konverter til boolean
    } catch (e) {
        // Hvis parsing fejler, antages det at operationen lykkedes
        return true;
    }
}

/**
 * Opdaterer hvilket billede der skal være profilbilledet for en kanin.
 * @param accessToken JWT token for bruger
 * @param earCombId Kaninens øremærke-id
 * @param photoId ID på billedet der skal sættes som profilbillede
 * @returns Det opdaterede foto (PhotoPrivateDTO)
 */
export async function SetRabbitProfilePhoto(
    accessToken: string,
    earCombId: string,
    photoId: number
): Promise<PhotoPrivateDTO> {
    const response = await fetch(getApiUrl(`Rabbit/${earCombId}/profile-photo/${photoId}`), {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Fejl: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

//-------------------- DELETE
/**
 * Sletter en kanin, inkl. rettighedstjek og oprydning af relationer.
 * @param earCombId Kaninens øremærke-id
 * @param accessToken JWT token for bruger
 * @returns Rabbit_PreviewDTO for den slettede kanin
 */
export async function DeleteRabbit(
  earCombId: string,
  accessToken: string
): Promise<Rabbit_PreviewDTO> {
  const response = await fetch(getApiUrl(`Rabbit/Delete/${earCombId}`), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Fejl: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function DeleteSaleDetails(
    earCombId: string,
    accessToken: string
): Promise<{ message: string }> {
    const response = await fetch(getApiUrl(`Rabbit/DeleteSaleDetails/${earCombId}`), {
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

/**
 * Sletter et billede fra en kanin, inkl. validering og autorisationskontrol.
 * @param accessToken JWT token for bruger
 * @param deletionDTO DTO med info om kanin og billede
 * @returns True hvis sletningen lykkedes
 */
export async function DeleteRabbitPhoto(
  accessToken: string,
  deletionDTO: PhotoDeleteDTO
): Promise<boolean> {
  const response = await fetch(getApiUrl('Rabbit/DeletePhoto'), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(deletionDTO)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Fejl: ${response.status} ${response.statusText}`);
  }

  // API returnerer bool i body
  return response.json();
}