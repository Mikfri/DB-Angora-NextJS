// src/app/actions/rabbit/rabbitCrudActions.ts
'use server';

import { getAccessToken } from '@/app/actions/auth/session';
import {
  CloudinaryPhotoRegistryRequestDTO,
  CloudinaryUploadConfigDTO,
  PagedResultDTO,
  PhotoDeleteDTO,
  PhotoPrivateDTO,
  Rabbit_CreateDTO,
  Rabbit_OwnedFilterDTO,
  Rabbit_ParentValidationResultDTO,
  Rabbit_OwnedPreviewDTO,
  Rabbit_ProfileDTO,
  Rabbit_ForbreedingProfileDTO,
  PedigreeResultDTO
} from '@/api/types/AngoraDTOs';
import {
  CreateRabbit,
  GetRabbitProfile,
  EditRabbit,
  DeleteRabbit,
  GetRabbitPhotoUploadPermission,
  DeleteRabbitPhoto,
  SetRabbitProfilePhoto,
  RegisterRabbitPhoto,
  ValidateParentReference,
  GetRabbitsOwnedByUser,
  GetRabbitForbreedingProfile,
  GetRabbitPedigree
} from '@/api/endpoints/rabbitController';

// ====================== TYPES ======================

export type CreateRabbitResult =
  | { success: true; earCombId: string }
  | { success: false; error: string };

export type RegisterRabbitPhotoResult =
  | { success: true; photo: PhotoPrivateDTO }
  | { success: false; error: string; status?: number };

export type RabbitsOwnedResult =
  | { success: true; data: PagedResultDTO<Rabbit_OwnedPreviewDTO> }
  | { success: false; error: string; status?: number };

export type ProfileResult =
  | { success: true; data: Rabbit_ProfileDTO }
  | { success: false; error: string; status: number };

export type UpdateRabbitResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type DeleteRabbitResult =
  | { success: true; message: string }
  | { success: false; error: string };

  export type PedigreeResult =
  | { success: true; data: PedigreeResultDTO }
  | { success: false; error: string; status: number };


// ====================== CREATE ======================

/**
 * Server Action: Opretter en ny kanin
 * @param rabbitData Data for den nye kanin
 * @returns Resultat af oprettelsen med earCombId ved succes
 */
export async function createRabbit(rabbitData: Rabbit_CreateDTO): Promise<CreateRabbitResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }

    // Validér data på server-siden
    if (!rabbitData.rightEarId || !rabbitData.leftEarId || !rabbitData.nickName) {
      return {
        success: false,
        error: 'Manglende påkrævede felter'
      };
    }

    // Kald API endpoint
    const newRabbit = await CreateRabbit(rabbitData, accessToken);

    // Returner et success objekt med det nye ID
    return {
      success: true,
      earCombId: newRabbit.earCombId
    };
  } catch (error) {
    console.error('Failed to create rabbit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
    };
  }
}



/**
 * Server Action: Registrerer et billede fra Cloudinary for en kanin
 * @param earCombId Kaninens øremærke-id
 * @param photoData Cloudinary billede-detaljer
 * @returns Resultat med det oprettede foto eller fejlbesked
 */
export async function registerRabbitPhoto(
  earCombId: string,
  photoData: CloudinaryPhotoRegistryRequestDTO
): Promise<RegisterRabbitPhotoResult> {
  try {
    if (!earCombId || !photoData) {
      return {
        success: false,
        error: "Manglende øremærke-id eller billeddata",
        status: 400
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Authentication required",
        status: 401
      };
    }

    const photo = await RegisterRabbitPhoto(accessToken, earCombId, photoData);

    return {
      success: true,
      photo
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Uventet fejl",
      status: 500
    };
  }
}

// ====================== READ ======================
/**
 * Server Action: Henter alle kaniner ejet af en bestemt bruger, filtreret og pagineret.
 * @param userId ID på brugeren hvis kaniner ønskes
 * @param filter Filtreringsparametre (Rabbit_OwnedFilterDTO)
 * @param page Sidetal (starter fra 1)
 * @param pageSize Antal elementer per side (default 12)
 * @returns Resultat med pagineret liste af kaniner eller fejlbesked
 */
export async function getRabbitsOwnedByUser(
  userId: string,
  filter: Rabbit_OwnedFilterDTO = {},
  page: number = 1,
  pageSize: number = 12
): Promise<RabbitsOwnedResult> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind',
        status: 401
      };
    }
    const rabbits = await GetRabbitsOwnedByUser(userId, filter, accessToken, page, pageSize);
    return {
      success: true,
      data: rabbits
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Uventet fejl',
      status: 500
    };
  }
}

/**
 * Server Action: Henter en kanin profil baseret på øremærke
 * @param earCombId Kaninens øremærke-id
 * @returns Kaninens profil data eller fejlbesked
 */
export async function getRabbitProfile(earCombId: string): Promise<ProfileResult> {
  try {
    if (!earCombId) {
      return {
        success: false,
        error: "Missing earCombId parameter",
        status: 400
      };
    }

    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: "Authentication required",
        status: 401
      };
    }

    const rabbit = await GetRabbitProfile(accessToken, earCombId);

    if (!rabbit) {
      return {
        success: false,
        error: "Rabbit not found",
        status: 404
      };
    }

    return {
      success: true,
      data: rabbit
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch rabbit profile",
      status: 500
    };
  }
}

export type ForbreedingProfileResult =
  | { success: true; data: Rabbit_ForbreedingProfileDTO }
  | { success: false; error: string; status: number };

/**
 * Server Action: Henter en kanins avls-profil, hvis kaninen er markeret til avl og brugeren har de rette rettigheder.
 * @param earCombId Kaninens øremærke-id
 * @returns Resultat med avlsprofil eller fejlbesked
 */
export async function getRabbitForbreedingProfile(
  earCombId: string
): Promise<ForbreedingProfileResult> {
  try {
    if (!earCombId) {
      return {
        success: false,
        error: "Missing earCombId parameter",
        status: 400
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Authentication required",
        status: 401
      };
    }

    const profile = await GetRabbitForbreedingProfile(accessToken, earCombId);

    if (!profile) {
      return {
        success: false,
        error: "Forbreeding profile not found",
        status: 404
      };
    }

    return {
      success: true,
      data: profile
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch forbreeding profile",
      status: 500
    };
  }
}

export type PhotoUploadPermissionResult =
  | { success: true; config: CloudinaryUploadConfigDTO }
  | { success: false; error: string; status?: number };

/**
 * Server Action: Henter Cloudinary upload-konfiguration for en kanin
 * @param earCombId Kaninens øremærke-id
 * @returns Resultat med config eller fejlbesked
 */
export async function getRabbitPhotoUploadPermission(
  earCombId: string
): Promise<PhotoUploadPermissionResult> {
  try {
    if (!earCombId) {
      return {
        success: false,
        error: "Missing earCombId parameter",
        status: 400
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Authentication required",
        status: 401
      };
    }

    const config = await GetRabbitPhotoUploadPermission(accessToken, earCombId);

    return {
      success: true,
      config
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Uventet fejl",
      status: 500
    };
  }
}

export type ParentValidationResult =
  | { success: true; result: Rabbit_ParentValidationResultDTO }
  | { success: false; error: string };

/**
 * Server Action: Validerer om en kanin eksisterer og har det forventede køn (forældrevalidering)
 * @param parentId Øremærke på den potentielle forældrekanin
 * @param expectedGender Forventet køn ('Buck' for far, 'Doe' for mor)
 * @returns Resultat med valideringsresultat eller fejlbesked
 */
export async function validateParentReference(
  parentId: string,
  expectedGender: string
): Promise<ParentValidationResult> {
  try {
    if (!parentId || !expectedGender) {
      return {
        success: false,
        error: "Mangler parentId eller expectedGender"
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    const result = await ValidateParentReference(accessToken, parentId, expectedGender);

    // API returnerer altid 200 OK, så vi tjekker IsValid i resultatet
    if (result && typeof result.isValid === "boolean") {
      return { success: true, result };
    } else {
      return { success: false, error: result?.message || "Ukendt valideringsfejl" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Uventet fejl"
    };
  }
}

// ====================== UPDATE ======================

/**
 * Server Action: Opdaterer en eksisterende kanin
 * @param earCombId Kaninens øremærke-id
 * @param updatedData De opdaterede data for kaninen
 * @returns Resultat af opdateringen
 */
export async function updateRabbit(
  earCombId: string,
  updatedData: Rabbit_ProfileDTO
): Promise<UpdateRabbitResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }

    if (!earCombId) {
      return {
        success: false,
        error: 'Manglende øremærke-id'
      };
    }

    if (!updatedData.nickName || updatedData.nickName.trim() === '') {
      return {
        success: false,
        error: 'Navn er påkrævet'
      };
    }

    // Valider datoer
    if (updatedData.dateOfBirth) {
      const birthDate = new Date(updatedData.dateOfBirth);
      if (isNaN(birthDate.getTime())) {
        return {
          success: false,
          error: 'Ugyldig fødselsdato'
        };
      }

      // Fremtidige fødselsdatoer er ikke tilladt
      if (birthDate > new Date()) {
        return {
          success: false,
          error: 'Fødselsdato kan ikke være i fremtiden'
        };
      }
    }

    if (updatedData.dateOfDeath) {
      const deathDate = new Date(updatedData.dateOfDeath);
      if (isNaN(deathDate.getTime())) {
        return {
          success: false,
          error: 'Ugyldig dødsdato'
        };
      }

      // Hvis både fødsel og død er angivet, skal død være efter fødsel
      if (updatedData.dateOfBirth) {
        const birthDate = new Date(updatedData.dateOfBirth);
        if (deathDate < birthDate) {
          return {
            success: false,
            error: 'Dødsdato kan ikke være før fødselsdato'
          };
        }
      }
    }

    // Kald API endpoint
    await EditRabbit(earCombId, updatedData, accessToken);

    // Returner et success objekt
    return {
      success: true,
      message: 'Kaninen blev opdateret'
    };
  } catch (error) {
    console.error('Failed to update rabbit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl ved opdatering af kaninen'
    };
  }
}

export type SetRabbitProfilePhotoResult =
  | { success: true; photo: PhotoPrivateDTO }
  | { success: false; error: string; status?: number };

/**
 * Server Action: Sætter et billede som profilbillede for en kanin
 * @param earCombId Kaninens øremærke-id
 * @param photoId ID på billedet der skal sættes som profilbillede
 * @returns Resultat med det opdaterede foto eller fejlbesked
 */
export async function setRabbitProfilePhoto(
  earCombId: string,
  photoId: number
): Promise<SetRabbitProfilePhotoResult> {
  try {
    if (!earCombId || !photoId) {
      return {
        success: false,
        error: "Manglende øremærke-id eller foto-id",
        status: 400
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Authentication required",
        status: 401
      };
    }

    const photo = await SetRabbitProfilePhoto(accessToken, earCombId, photoId);

    return {
      success: true,
      photo
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Uventet fejl",
      status: 500
    };
  }
}

// ====================== DELETE ======================

/**
 * Server Action: Sletter en kanin
 * @param earCombId Kaninens øremærke-id
 * @returns Resultat af sletningen med success flag og besked
 */
export async function deleteRabbit(earCombId: string): Promise<DeleteRabbitResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: 'Du er ikke logget ind'
      };
    }

    if (!earCombId) {
      return {
        success: false,
        error: 'Manglende øremærke-id'
      };
    }

    // Kald API endpoint og få preview af slettet kanin
    const deletedRabbit = await DeleteRabbit(earCombId, accessToken);

    return {
      success: true,
      message: `Kaninen "${deletedRabbit.nickName || earCombId}" blev slettet`
    };
  } catch (error) {
    console.error('Failed to delete rabbit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Der skete en uventet fejl ved sletning af kaninen'
    };
  }
}

export type DeleteRabbitPhotoResult =
  | { success: true }
  | { success: false; error: string; status?: number };

/**
 * Server Action: Sletter et billede fra en kanin
 * @param deletionDTO DTO med info om kanin og billede
 * @returns Resultat med success flag eller fejlbesked
 */
export async function deleteRabbitPhoto(
  deletionDTO: PhotoDeleteDTO
): Promise<DeleteRabbitPhotoResult> {
  try {
    if (!deletionDTO || !deletionDTO.entityStringId || !deletionDTO.photoId) {
      return {
        success: false,
        error: "Ugyldig eller manglende data til sletning",
        status: 400
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Authentication required",
        status: 401
      };
    }

    const result = await DeleteRabbitPhoto(accessToken, deletionDTO);

    if (result === true) {
      return { success: true };
    } else {
      return {
        success: false,
        error: "Sletning mislykkedes",
        status: 500
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Uventet fejl",
      status: 500
    };
  }
}

/**
 * Server Action: Henter stamtræet og indavlskoefficient for en specifik kanin
 * @param earCombId Kaninens øremærke-id
 * @param maxGeneration Maks antal generationer (default 4)
 * @returns Resultat med pedigree-data eller fejlbesked
 */
export async function getRabbitPedigree(
  earCombId: string,
  maxGeneration: number = 4
): Promise<PedigreeResult> {
  try {
    if (!earCombId) {
      return {
        success: false,
        error: "Missing earCombId parameter",
        status: 400
      };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: "Authentication required",
        status: 401
      };
    }

    const pedigreeResult = await GetRabbitPedigree(accessToken, earCombId, maxGeneration);

    if (!pedigreeResult) {
      return {
        success: false,
        error: "Pedigree not found",
        status: 404
      };
    }

    return {
      success: true,
      data: pedigreeResult
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch pedigree",
      status: 500
    };
  }
}