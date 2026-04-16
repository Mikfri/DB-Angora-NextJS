// src/api/endpoints/rabbitController.ts
import { parseApiError } from "../client/errorHandlers";
import { getApiUrl } from "../config/apiConfig";
import {
    Rabbit_CreateDTO,
    Rabbit_ProfileDTO,
    Rabbit_UpdateDTO,
    Rabbit_OwnedPreviewDTO,
    Rabbit_OwnedFilterDTO,
    Rabbit_ForbreedingPreviewDTO,
    Rabbit_ForbreedingFilterDTO,
    Rabbit_ForbreedingProfileDTO,
    Rabbit_ParentValidationResultDTO,
    CloudinaryUploadConfigDTO,
    CloudinaryPhotoRegistryRequestDTO,
    PhotoPrivateDTO,
    ResultPagedDTO,
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
    const response = await fetch(getApiUrl(`Rabbit/${encodeURIComponent(targetedUserId)}`), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(rabbitData)
    });

    if (!response.ok) throw await parseApiError(response, 'Fejl ved oprettelse af kanin');
    return response.json();
}

/**
 * Registrerer Cloudinary-billede for en kanin.
 * @param accessToken JWT token
 * @param earCombId Kaninens øremærke-id
 * @param requestDTO Cloudinary upload info
 * @returns PhotoPrivateDTO
 */
export async function AddRabbitPhoto(
  accessToken: string,
  earCombId: string,
  requestDTO: CloudinaryPhotoRegistryRequestDTO
): Promise<PhotoPrivateDTO> {
  const response = await fetch(getApiUrl(`Rabbit/${encodeURIComponent(earCombId)}/photos`), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(requestDTO),
  });

  if (!response.ok) throw await parseApiError(response, "Kunne ikke registrere rabbit foto");
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
    const response = await fetch(getApiUrl(`Rabbit/${encodeURIComponent(earCombId)}/photos/upload-config`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) throw await parseApiError(response, 'Fejl ved hentning af upload-konfiguration');
    const data = await response.json();
    return data.data ?? data;
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
  const url = getApiUrl(`Rabbit/validate-parent?parentId=${encodeURIComponent(parentId)}&expectedGender=${encodeURIComponent(expectedGender)}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) throw await parseApiError(response, 'Fejl ved validering af forældre-reference');
  return response.json();
}


export async function GetRabbitsForBreeding(
    accessToken: string,
    filter?: Rabbit_ForbreedingFilterDTO,
    page: number = 1,
    pageSize: number = 12
): Promise<ResultPagedDTO<Rabbit_ForbreedingPreviewDTO>> {
    const params = new URLSearchParams();
    if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined && value !== null) params.append(key, String(value));
        });
    }
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await fetch(getApiUrl(`Rabbit/for-breeding?${params.toString()}`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) throw await parseApiError(response, 'Fejl ved hentning af avlskaniner');
    return response.json();
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
export async function GetRabbitsOwnedOrLinkedByUser(
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
    const response = await fetch(getApiUrl(`Rabbit/${encodeURIComponent(earCombId)}/profile`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) throw await parseApiError(response, 'Fejl ved hentning af kaninprofil');
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
  const response = await fetch(getApiUrl(`Rabbit/${encodeURIComponent(earCombId)}/for-breeding`), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) throw await parseApiError(response, 'Fejl ved hentning af avls-profil');
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
    const url = getApiUrl(`Rabbit/${encodeURIComponent(earCombId)}/pedigree?maxGeneration=${maxGeneration}`);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) throw await parseApiError(response, 'Fejl ved hentning af stamtavle');

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
        `Rabbit/test-mating-pedigree?fatherEarCombId=${encodeURIComponent(fatherEarCombId)}&motherEarCombId=${encodeURIComponent(motherEarCombId)}&maxGeneration=${maxGeneration}`
    );
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) throw await parseApiError(response, 'Fejl ved beregning af test-parings stamtavle');

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

export async function EditRabbit(
    earCombId: string,
    rabbitData: Rabbit_UpdateDTO,
    accessToken: string
): Promise<Rabbit_ProfileDTO> {
    const response = await fetch(getApiUrl(`Rabbit/${encodeURIComponent(earCombId)}`), {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(rabbitData)
    });

    if (!response.ok) throw await parseApiError(response, 'Fejl ved opdatering af kanin');
    const data = await response.json();
    return data.rabbit ?? data;
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
    const response = await fetch(getApiUrl(`Rabbit/${encodeURIComponent(earCombId)}/photos/${photoId}`), {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) throw await parseApiError(response, 'Fejl ved opdatering af profilbillede');
    const data = await response.json();
    return data.photo ?? data;
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
): Promise<{ message: string }> {
  const response = await fetch(getApiUrl(`Rabbit/${encodeURIComponent(earCombId)}`), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) throw await parseApiError(response, 'Fejl ved sletning af kanin');
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
  earCombId: string,
  photoId: number
): Promise<boolean> {
  const response = await fetch(getApiUrl(`Rabbit/${encodeURIComponent(earCombId)}/photos/${photoId}`), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) throw await parseApiError(response, 'Fejl ved sletning af kanin-billede');
  return true;
}
