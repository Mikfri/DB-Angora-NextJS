// src/api/endpoints/rabbitController.ts
import { parseApiError } from "../client/errorHandlers";
import { getApiUrl } from "../config/apiConfig";
import {
    Rabbit_CreateDTO, Rabbit_ProfileDTO,
    Rabbits_ForbreedingPreviewList, Rabbit_UpdateDTO, Rabbit_OwnedPreviewDTO,
    Rabbit_CreateSaleDetailsDTO, Rabbit_UpdateSaleDetailsDTO,
    CloudinaryUploadConfigDTO,
    SaleDetailsProfileDTO,
    PhotoPrivateDTO,
    PhotoDeleteDTO,
    CloudinaryPhotoRegistryRequestDTO,
    Rabbit_ParentValidationResultDTO,
    ResultPagedDTO,
    Rabbit_OwnedFilterDTO,
    Rabbit_ForbreedingProfileDTO,
    PedigreeResultDTO,
    COIContributorDTO,
    Rabbit_PedigreeDTO,
} from "../types/AngoraDTOs";


//-------------------- CREATE
/**
 * Opretter en ny kanin for en specifik bruger (targetedUserId).
 * Almene brugere af endpointet isender deres eget bruger-id som targetedUserId fra siden: "../myRabbits/create/page.tsx"
 * Mods og admins kan isende andre bruger-id'er via fremtidig side "../myRabbits/create/[targetedUserId]/page.tsx."
 * @param targetedUserId Bruger-id for den bruger kaninen skal oprettes for
 * @param rabbitData Data for den kanin der skal oprettes
 * @param accessToken Brugerens JWT token
 * @returns 
 */
export async function CreateRabbit(
    targetedUserId: string,
    rabbitData: Rabbit_CreateDTO,
    accessToken: string
): Promise<Rabbit_ProfileDTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!targetedUserId || targetedUserId.trim() === "") {
        throw new Error("targetedUserId er påkrævet.");
    }

    const response = await fetch(getApiUrl(`Rabbit/CreateForUser/${encodeURIComponent(targetedUserId)}`), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(rabbitData)
    });

    if (response.status === 201) {
        return response.json();
    }

    throw await parseApiError(response);
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
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!earCombId || earCombId.trim() === "") {
        throw new Error("earCombId er påkrævet.");
    }

    const response = await fetch(getApiUrl(`Rabbit/CreateSaleDetails/${earCombId}`), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(saleDetails)
    });

    if (response.status === 201) {
        return response.json();
    }

    throw await parseApiError(response, 'Fejl ved oprettelse af salgsdetaljer');
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
    throw await parseApiError(response);
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
        throw await parseApiError(response);
    }

    return response.json();
}

/**
 * Validerer om en kanin eksisterer og har det forventede køn (forældrevalidering).
 * @param accessToken JWT token for bruger
 * @param parentId Øremærke på den potentielle forældrekanin
 * @param expectedGender Forventet køn ('Han' for far, 'Hun' for mor)
 * @returns Valideringsresultat med evt. kanindetaljer
 */
export async function ValidateParentReference(
  accessToken: string,
  parentId: string,
  expectedGender: string
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
    throw await parseApiError(response);
  }

  return response.json();
}


export async function GetRabbitsForBreeding(accessToken: string): Promise<Rabbits_ForbreedingPreviewList> {
    const data = await fetch(getApiUrl('Rabbit/Forbreeding'), {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!data.ok) {
        throw await parseApiError(data);
    }
    
    return data.json();
}

/**
 * Henter alle kaniner ejet af en specifik bruger, filtreret og pagineret.
 * Kun admin/moderatorer med "Rabbit:Read" -> "Any" kan tilgå andres samlinger.
 * @param userId ID på brugeren hvis kaniner ønskes
 * @param filter Filtreringsparametre (Rabbit_OwnedFilterDTO)
 * @param accessToken JWT token med brugerens auth information
 * @param page Sidetal (starter fra 1)
 * @param pageSize Antal elementer per side (default 12)
 * @returns Pagineret liste af kaniner
 */
export async function GetRabbitsOwnedByUser(
  userId: string,
  filter: Rabbit_OwnedFilterDTO,
  accessToken: string,
  page: number = 1,
  pageSize: number = 12
): Promise<ResultPagedDTO<Rabbit_OwnedPreviewDTO>> {
  const params = new URLSearchParams();
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());

  const url = getApiUrl(`Rabbit/related-to/${encodeURIComponent(userId)}?${params.toString()}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return response.json();
}

/**
* Henter en kaninprofil ud fra øremærke
*/
export async function GetRabbitProfile(accessToken: string, earCombId: string): Promise<Rabbit_ProfileDTO> {
    const response = await fetch(getApiUrl(`Rabbit/Profile/${earCombId}`), {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
        throw await parseApiError(response);
    }

    return response.json();
}

/**
 * Henter en kanins avls-profil, hvis kaninen er markeret til avl og brugeren har de rette rettigheder.
 * @param accessToken JWT token for bruger
 * @param earCombId Kaninens øremærke-id
 * @returns Rabbit_ForbreedingProfileDTO eller kaster fejl med meningsfuld besked
 */
export async function GetRabbitForbreedingProfile(
  accessToken: string,
  earCombId: string
): Promise<Rabbit_ForbreedingProfileDTO> {
  const response = await fetch(getApiUrl(`Rabbit/ForbreedingProfile/${earCombId}`), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return response.json();
}

// PEDIGREE
/**
 * Henter stamtræet og indavlskoefficient for en specifik kanin
 * @param accessToken - Brugerens JWT authentication token
 * @param earCombId - Kaninens øremærke-id
 * @param maxGeneration - Maks antal generationer (default 4)
 * @returns PedigreeResultDTO med indavlskoefficient, COI-bidragydere og stamtræ
 */
export async function GetRabbitPedigree(
    accessToken: string,
    earCombId: string,
    maxGeneration: number = 4
): Promise<PedigreeResultDTO> {
    const url = getApiUrl(`Rabbit/Pedigree/${earCombId}?maxGeneration=${maxGeneration}`);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw await parseApiError(response);
    }

    const rawData: unknown = await response.json();
    
    // Type guard helper
    function unwrapArray<T>(data: unknown): T[] {
        if (data && typeof data === 'object' && '$values' in data) {
            return (data as { $values: T[] }).$values;
        }
        return Array.isArray(data) ? data : [];
    }

    const result = rawData as Record<string, unknown>;
    
    return {
        CalculatedInbreedingCoefficient: result.CalculatedInbreedingCoefficient as number,
        COIContributors: unwrapArray<COIContributorDTO>(result.COIContributors).map(c => ({
            ...c,
            AncestorPaths: unwrapArray<string>(c.AncestorPaths)
        })),
        Pedigree: result.Pedigree as Rabbit_PedigreeDTO
    };
}

/**
 * Henter test-mating pedigree for et tænkt afkom ud fra far og mor.
 * @param accessToken JWT token for bruger
 * @param fatherEarCombId Øremærke på far (Han)
 * @param motherEarCombId Øremærke på mor (Hun)
 * @param maxGeneration Maks antal generationer (default 4)
 * @returns PedigreeResultDTO med indavlskoefficient og stamtavle
 */
export async function GetTestMatingPedigree(
    accessToken: string,
    fatherEarCombId: string,
    motherEarCombId: string,
    maxGeneration: number = 4
): Promise<PedigreeResultDTO> {
    const url = getApiUrl(
        `Rabbit/TestMatingPedigree?fatherEarCombId=${encodeURIComponent(fatherEarCombId)}&motherEarCombId=${encodeURIComponent(motherEarCombId)}&maxGeneration=${maxGeneration}`
    );
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw await parseApiError(response);
    }

    const rawData: unknown = await response.json();

    function unwrapArray<T>(data: unknown): T[] {
        if (data && typeof data === 'object' && '$values' in data) {
            return (data as { $values: T[] }).$values;
        }
        return Array.isArray(data) ? data : [];
    }

    const result = rawData as Record<string, unknown>;

    return {
        CalculatedInbreedingCoefficient: result.CalculatedInbreedingCoefficient as number,
        COIContributors: unwrapArray<COIContributorDTO>(result.COIContributors).map(c => ({
            ...c,
            AncestorPaths: unwrapArray<string>(c.AncestorPaths)
        })),
        Pedigree: result.Pedigree as Rabbit_PedigreeDTO
    };
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
        throw await parseApiError(response, 'Failed to update rabbit');
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
        throw await parseApiError(response, 'Kunne ikke opdatere salgsdetaljer');
    }

    // Hvis response body er tom, returner true
    if (response.headers.get('content-length') === '0') {
        return true;
    }

    try {
        const result = await response.json();
        return result === true || Boolean(result);
    } catch {
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
        throw await parseApiError(response);
    }

    return response.json();
}

//-------------------- DELETE
/**
 * Sletter en kanin, inkl. rettighedstjek og oprydning af relationer.
 * @param earCombId Kaninens øremærke-id
 * @param accessToken JWT token for bruger
 * @returns Rabbit_OwnedPreviewDTO for den slettede kanin
 */
export async function DeleteRabbit(
  earCombId: string,
  accessToken: string
): Promise<Rabbit_OwnedPreviewDTO> {
  const response = await fetch(getApiUrl(`Rabbit/Delete/${earCombId}`), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw await parseApiError(response);
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
        throw await parseApiError(response, 'Failed to delete sale details');
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
    throw await parseApiError(response);
  }

  return response.json();
}