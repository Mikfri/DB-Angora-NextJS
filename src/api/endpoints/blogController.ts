// src/api/endpoints/blogController.ts
import { getApiUrl } from "../config/apiConfig";
import type {
    Blog_CardFilterDTO, PagedResultDTO, Blog_CardDTO, Blog_DTO, Blog_UpdateDTO, BlogPublicDTO,
    CloudinaryUploadConfigDTO, PhotoPrivateDTO, CloudinaryPhotoRegistryRequestDTO,
    PhotoDeleteDTO,
    Blog_CreateDTO,
    BlogAuthedCardFilterDTO
} from '@/api/types/AngoraDTOs';

//---------------- POST METHODS -----------------
/**
 * Opretter et nyt blogindlæg som kladde.
 * Du kan sende et tomt objekt som createDTO.
 * @param createDTO - Data til oprettelse af nyt blogindlæg (kan være tomt)
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Det oprettede blogindlæg (Blog_DTO)
 */
export async function createBlog(
    createDTO: Blog_CreateDTO = {},
    accessToken: string
): Promise<Blog_DTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    // createDTO kan nu være tomt, så ingen check her

    const url = getApiUrl('Blog');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(createDTO)
    });

    if (res.status === 401) {
        throw new Error("Du er ikke logget ind.");
    }
    if (res.status === 403) {
        throw new Error("Du har ikke rettigheder til at oprette blogs.");
    }
    if (res.status === 400) {
        let message = "Ugyldige data.";
        const errorBody = await res.text();
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {
            // Ignorer JSON parse fejl
        }
        throw new Error(message);
    }
    if (!res.ok && res.status !== 201) {
        let errorMessage = `${res.status} ${res.statusText}`;
        const errorBody = await res.text();
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) errorMessage = errorData.message;
        } catch {
            // Ignorer JSON parse fejl
        }
        throw new Error(`Fejl ved oprettelse af blog: ${errorMessage}`);
    }

    const data: unknown = await res.json();
    // Forventet: { message: string, blog: Blog_DTO }
    if (
        typeof data === "object" &&
        data !== null &&
        "blog" in data &&
        typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: Blog_DTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

/**
 * Publicerer et blogindlæg direkte, hvis brugeren har rettigheder.
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Det publicerede blogindlæg (Blog_DTO)
 */
export async function publishBlog(
    blogId: number,
    accessToken: string
): Promise<Blog_DTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }

    const url = getApiUrl(`Blog/publish/${blogId}`);

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'POST',
        headers
    });

    // 401 Unauthorized
    if (res.status === 401) {
        const errorBody = await res.text();
        let message = "Ikke autoriseret.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 403 Forbidden
    if (res.status === 403) {
        const errorBody = await res.text();
        let message = "Adgang nægtet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 404 Not Found
    if (res.status === 404) {
        const errorBody = await res.text();
        let message = "Blogindlægget blev ikke fundet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // Andre fejl
    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) errorMessage = errorData.message;
        } catch {}
        throw new Error(`Fejl ved publicering af blog: ${errorMessage}`);
    }

    // 200 OK
    const data: unknown = await res.json();
    // Forventet: { message: string, blog: Blog_DTO }
    if (
        typeof data === "object" &&
        data !== null &&
        "blog" in data &&
        typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: Blog_DTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

/**
 * Planlægger publicering af et blogindlæg på en given dato.
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @param publishDate - Dato for publicering (ISO string eller Date)
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Det planlagte blogindlæg (Blog_DTO)
 */
export async function schedulePublishBlog(
    blogId: number,
    publishDate: Date | string,
    accessToken: string
): Promise<Blog_DTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }
    // Konverter publishDate til ISO string hvis det er en Date
    const publishDateIso = typeof publishDate === "string" ? publishDate : publishDate.toISOString();

    // Tjek at publishDate er i fremtiden
    if (new Date(publishDateIso) <= new Date()) {
        throw new Error("Publiceringstidspunktet skal være i fremtiden");
    }

    const url = getApiUrl(`Blog/schedule/${blogId}`);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(publishDateIso)
    });

    // 401 Unauthorized
    if (res.status === 401) {
        const errorBody = await res.text();
        let message = "Ikke autoriseret.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 403 Forbidden
    if (res.status === 403) {
        const errorBody = await res.text();
        let message = "Adgang nægtet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 404 Not Found
    if (res.status === 404) {
        const errorBody = await res.text();
        let message = "Blogindlægget blev ikke fundet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 400 Bad Request
    if (res.status === 400) {
        const errorBody = await res.text();
        let message = "Publiceringstidspunktet skal være i fremtiden";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // Andre fejl
    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) errorMessage = errorData.message;
        } catch {}
        throw new Error(`Fejl ved planlægning af publicering: ${errorMessage}`);
    }

    // 200 OK
    const data: unknown = await res.json();
    // Forventet: { message: string, blog: Blog_DTO }
    if (
        typeof data === "object" &&
        data !== null &&
        "blog" in data &&
        typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: Blog_DTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

/**
 * Trækker et blogindlæg tilbage fra publicering (unpublish).
 * Sætter IsPublished = false og PublishDate = null.
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Det opdaterede blogindlæg (Blog_DTO)
 */
export async function unpublishBlog(
    blogId: number,
    accessToken: string
): Promise<Blog_DTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }

    const url = getApiUrl(`Blog/unpublish/${blogId}`);

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'POST',
        headers
    });

    // 401 Unauthorized
    if (res.status === 401) {
        const errorBody = await res.text();
        let message = "Ikke autoriseret.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 403 Forbidden
    if (res.status === 403) {
        const errorBody = await res.text();
        let message = "Adgang nægtet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 404 Not Found
    if (res.status === 404) {
        const errorBody = await res.text();
        let message = "Blogindlægget blev ikke fundet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // Andre fejl
    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) errorMessage = errorData.message;
        } catch {}
        throw new Error(`Fejl ved tilbagetrækning af blog: ${errorMessage}`);
    }

    // 200 OK
    const data: unknown = await res.json();
    // Forventet: { message: string, blog: Blog_DTO }
    if (
        typeof data === "object" &&
        data !== null &&
        "blog" in data &&
        typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: Blog_DTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

/**
 * Registrerer et billede fra Cloudinary til et blogindlæg.
 * Kræver CreateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget billedet tilhører
 * @param requestDTO - Billedoplysninger fra Cloudinary
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Det oprettede private Photo DTO
 */
export async function registerCloudinaryBlogPhoto(
    blogId: number,
    requestDTO: CloudinaryPhotoRegistryRequestDTO,
    accessToken: string
): Promise<PhotoPrivateDTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }
    if (!requestDTO) {
        throw new Error("Cloudinary photo registry request is required.");
    }

    const url = getApiUrl(`Blog/register-photo/${blogId}`);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestDTO)
    });

    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            if (errorBody) {
                const errorData = JSON.parse(errorBody);
                errorMessage = errorData.message || errorMessage;
            }
        } catch { }
        throw new Error(`Fejl ved registrering af blogfoto: ${errorMessage}`);
    }

    const data = await res.json();
    return data as PhotoPrivateDTO;
}

//----------------- GET METHODS -----------------
// Modtag accessToken som parameter (best practice)

/**
 * Henter en liste af blogindlæg baseret på filterkriterier.
 * Metoden kræver ikke nødvendigvis et accessToken, da alleme brugere kan tilgå public blogs.
 * Nogen blogs kan dog være paidContent som kræver login og rettigheder.
 * @param filter - Filterkriterier for blogindlæg
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns En pagineret liste af blogindlæg eller null ved fejl
 */
export async function getBlogs(
    filter: Blog_CardFilterDTO,
    accessToken?: string
): Promise<PagedResultDTO<Blog_CardDTO> | null> {
    const params = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
    });

    const url = getApiUrl(`Blog?${params.toString()}`);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {
        method: 'GET',
        headers
    });

    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            if (errorBody) errorMessage = errorBody;
        } catch {
            // ignore
        }
        throw new Error(`Fejl ved hentning af blogs: ${errorMessage}`);
    }

    const data = await res.json();
    return data as PagedResultDTO<Blog_CardDTO>;
}

/**
 * Henter alle en brugers blogindlæg (inklusive kladder) med adgangskontrol.
 * Kun admin, moderator og content team kan tilgå andres blogindlæg.
 * @param targetedUserId - ID på brugeren hvis blogs ønskes
 * @param filterDTO - Filtreringsparametre (BlogAuthedCardFilterDTO) - UDEN page/pageSize!
 * @param page - Side
 * @param pageSize - Antal pr. side
 * @param accessToken - JWT token til adgangskontrol (optional)
 * @returns Pagineret liste af blogkort eller null ved fejl
 */
export async function getBlogsAuthoredByUser(
    targetedUserId: string,
    filterDTO: Omit<BlogAuthedCardFilterDTO, 'page' | 'pageSize'>,
    page: number,
    pageSize: number,
    accessToken: string // <-- ikke optional!
): Promise<PagedResultDTO<Blog_CardDTO> | null> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }

    const params = new URLSearchParams();

    // Tilføj filterDTO properties som query params
    Object.entries(filterDTO).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
    });

    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const url = getApiUrl(`Blog/authored-by/${encodeURIComponent(targetedUserId)}?${params.toString()}`);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {
        method: 'GET',
        headers
    });

    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            if (errorBody) errorMessage = errorBody;
        } catch {
            // ignore
        }
        throw new Error(`Fejl ved hentning af brugerens blogs: ${errorMessage}`);
    }

    const data = await res.json();
    return data as PagedResultDTO<Blog_CardDTO>;
}

/**
 * Dette endpoint er for sitets almene brugere/konsumers som vil tilgå blog-post for at læse indholdet.
 * Det kan være almene brugere UDEN LOGIN, brugerer som er registreret MED LOGIN, og med forskellige rettigheder:
 * • Almene brugere kan kun tilgå 'public' blogindlæg.
 * • Brugere som er registreret kan tilgå både 'public' og 'paidContent' blogindlæg,
 *  afhængigt af deres rettigheder.
 * @param slug 
 * @param accessToken 
 * @returns 
 */
export async function getBlogBySlug(
    slug: string,
    accessToken?: string
): Promise<BlogPublicDTO | null> {
    const url = getApiUrl(`Blog/${encodeURIComponent(slug)}`);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (accessToken && accessToken.trim() !== "") {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {
        method: 'GET',
        headers
    });

    // 401 Unauthorized
    if (res.status === 401) {
        const errorBody = await res.text();
        let message = "Ikke autoriseret.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 403 Forbidden
    if (res.status === 403) {
        const errorBody = await res.text();
        let message = "Adgang nægtet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 404 Not Found
    if (res.status === 404) {
        const errorBody = await res.text();
        let message = "Blogindlægget blev ikke fundet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        return null;
    }

    // Andre fejl
    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) errorMessage = errorData.message;
        } catch {}
        throw new Error(`Fejl ved hentning af blog: ${errorMessage}`);
    }

    // 200 OK
    const data: unknown = await res.json();
    // Forventet: { message: string, blog: BlogPublicDTO }
    if (
        typeof data === "object" &&
        data !== null &&
        "blog" in data &&
        typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: BlogPublicDTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

/**
 * Henter et blogindlæg baseret på ID med adgangskontrol.
 * Endpointet er tiltænkt blog-content teamet som skal kunne tilgå et arbejdsdokument,
 * hvorfra de via andre endpoints kan redigere og opdatere indholdet.
 * Kræver Blog:Read claim i accessToken.
 * @param blogId - ID på blogindlægget (integer)
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Blog_DTO eller null hvis ikke fundet
 */
export async function getBlogById(
    blogId: number,
    accessToken: string
): Promise<Blog_DTO | null> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }

    const url = getApiUrl(`Blog/${blogId}`);

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'GET',
        headers
    });

    // 401 Unauthorized
    if (res.status === 401) {
        const errorBody = await res.text();
        let message = "Ikke autoriseret.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 403 Forbidden
    if (res.status === 403) {
        const errorBody = await res.text();
        let message = "Adgang nægtet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 404 Not Found
    if (res.status === 404) {
        const errorBody = await res.text();
        let message = "Blogindlægget blev ikke fundet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        return null;
    }

    // 400 Bad Request eller andre fejl
    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        const errorBody = await res.text();
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) errorMessage = errorData.message;
        } catch {}
        throw new Error(`Fejl ved hentning af blog: ${errorMessage}`);
    }

    // 200 OK
    const data: unknown = await res.json();
    // Forventet: { message: string, blog: Blog_DTO }
    if (
        typeof data === "object" &&
        data !== null &&
        "blog" in data &&
        typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: Blog_DTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

/**
 * Henter konfigurationen for at uploade et billede til et blogindlæg.
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget (integer)
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Cloudinary upload konfiguration
 */
export async function getBlogImageUploadConfig(
    blogId: number,
    accessToken: string
): Promise<CloudinaryUploadConfigDTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }

    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }

    const url = getApiUrl(`Blog/upload-config/${blogId}`);

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'GET',
        headers
    });

    if (!res.ok) {
        // API'en sender strukturerede fejlbeskeder via ExceptionMiddleware
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            if (errorBody) {
                const errorData = JSON.parse(errorBody);
                errorMessage = errorData.message || errorMessage;
            }
        } catch { }
        throw new Error(`Fejl ved hentning af upload konfiguration: ${errorMessage}`);
    }

    const data = await res.json();
    return data as CloudinaryUploadConfigDTO;
}


//------------------ PUT METHODS -------------------

/**
 * Opdaterer et eksisterende blogindlæg med adgangskontrol.
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget (integer)
 * @param updateDTO - Data til opdatering af blogindlægget
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Det opdaterede blogindlæg (Blog_DTO)
 */
export async function updateBlog(
    blogId: number,
    updateDTO: Blog_UpdateDTO,
    accessToken: string
): Promise<Blog_DTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }

    const url = getApiUrl(`Blog/${blogId}`);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateDTO)
    });

    // 401 Unauthorized
    if (res.status === 401) {
        const errorBody = await res.text();
        let message = "Ikke autoriseret.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 403 Forbidden
    if (res.status === 403) {
        const errorBody = await res.text();
        let message = "Adgang nægtet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 404 Not Found
    if (res.status === 404) {
        const errorBody = await res.text();
        let message = "Blogindlægget blev ikke fundet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 400 Bad Request
    if (res.status === 400) {
        const errorBody = await res.text();
        let message = "Ugyldig opdateringsdata.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // Andre fejl
    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) errorMessage = errorData.message;
        } catch {}
        throw new Error(`Fejl ved opdatering af blog: ${errorMessage}`);
    }

    // 200 OK
    const data: unknown = await res.json();
    // Forventet: { message: string, blog: Blog_DTO }
    if (
        typeof data === "object" &&
        data !== null &&
        "blog" in data &&
        typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: Blog_DTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

/**
 * Opdaterer hvilket billede der skal være featured image for et blogindlæg.
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @param photoId - ID på billedet der skal sættes som featured image
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Det opdaterede foto
 */
export async function updateBlogFeaturedImage(
    blogId: number,
    photoId: number,
    accessToken: string
): Promise<PhotoPrivateDTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }
    if (!photoId || photoId <= 0) {
        throw new Error("Valid photo ID is required.");
    }

    const url = getApiUrl(`Blog/${blogId}/featured-image/${photoId}`);

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'PUT',
        headers
    });

    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            if (errorBody) {
                const errorData = JSON.parse(errorBody);
                errorMessage = errorData.message || errorMessage;
            }
        } catch { }
        throw new Error(`Fejl ved opdatering af featured image: ${errorMessage}`);
    }

    const data = await res.json();
    return data as PhotoPrivateDTO;
}

//---------------- DELETE METHODS ------------------

/**
 * Sletter et blogindlæg og alle relaterede fotos.
 * Kræver DeleteBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Bekræftelse på sletning (object med message)
 */
export async function deleteBlog(
    blogId: number,
    accessToken: string
): Promise<{ message: string; deleted?: unknown }> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }

    const url = getApiUrl(`Blog/${blogId}`);

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'DELETE',
        headers
    });

    // 401 Unauthorized
    if (res.status === 401) {
        const errorBody = await res.text();
        let message = "Ikke autoriseret.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 403 Forbidden
    if (res.status === 403) {
        const errorBody = await res.text();
        let message = "Adgang nægtet.";
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // 404 Not Found
    if (res.status === 404) {
        const errorBody = await res.text();
        let message = `Blogindlægget blev ikke fundet.`;
        try {
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) message = errorData.message;
        } catch {}
        throw new Error(message);
    }

    // Andre fejl
    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            const errorData = JSON.parse(errorBody) as { message?: string };
            if (errorData.message) errorMessage = errorData.message;
        } catch {}
        throw new Error(`Fejl ved sletning af blog: ${errorMessage}`);
    }

    // 200 OK
    const data: unknown = await res.json();
    // Forventet: { message: string, deleted?: unknown }
    if (
        typeof data === "object" &&
        data !== null &&
        "message" in data
    ) {
        return data as { message: string; deleted?: unknown };
    }
    throw new Error("API svarede ikke med sletnings-data.");
}

/**
 * Sletter et billede fra et blogindlæg.
 * Kræver UpdateBlog claim i accessToken.
 * @param deletionDTO - DTO med PhotoId og BlogId
 * @param accessToken - JWT token til adgangskontrol (påkrævet)
 * @returns Bekræftelse på sletning (object med message)
 */
export async function deleteBlogPhoto(
    deletionDTO: PhotoDeleteDTO,
    accessToken: string
): Promise<{ message: string }> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!deletionDTO || !deletionDTO.photoId || !deletionDTO.entityIntId) {
        throw new Error("PhotoDeleteDTO med PhotoId og BlogId er påkrævet.");
    }

    const url = getApiUrl(`Blog/delete-photo`);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(url, {
        method: 'DELETE',
        headers,
        body: JSON.stringify(deletionDTO)
    });

    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            if (errorBody) {
                const errorData = JSON.parse(errorBody);
                errorMessage = errorData.message || errorMessage;
            }
        } catch { }
        throw new Error(`Fejl ved sletning af blogfoto: ${errorMessage}`);
    }

    const data = await res.json();
    return data as { message: string };
}