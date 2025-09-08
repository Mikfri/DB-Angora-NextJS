// src/api/endpoints/blogController.ts
import { getApiUrl } from "../config/apiConfig";
import type { Blog_CardFilterDTO, PagedResultDTO, Blog_CardDTO, Blog_DTO, Blog_UpdateDTO, BlogPublicDTO } from '@/api/types/AngoraDTOs';

//---------------- POST METHODS -----------------
//----------------- GET METHODS -----------------
// Modtag accessToken som parameter (best practice)
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
 * @param userId - ID på brugeren hvis blogs ønskes
 * @param searchTerm - Søgeord til filtrering (optional)
 * @param page - Side (default 1)
 * @param pageSize - Antal pr. side (default 12)
 * @param accessToken - JWT token til adgangskontrol (optional)
 * @returns Pagineret liste af blogkort eller null ved fejl
 */
export async function getBlogsAuthoredByUser(
    userId: string,
    searchTerm?: string,
    page: number = 1,
    pageSize: number = 12,
    accessToken?: string
): Promise<PagedResultDTO<Blog_CardDTO> | null> {
    if (!userId || userId.trim() === "") {
        throw new Error("User ID is required.");
    }

    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const url = getApiUrl(`Blog/authored-by/${encodeURIComponent(userId)}?${params.toString()}`);

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
 * • Brugere som er registreret kan tilgå både 'public' ogz 'paidContent' blogindlæg,
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

    if (res.status === 404) {
        return null;
    }
    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            if (errorBody) errorMessage = errorBody;
        } catch {}
        throw new Error(`Fejl ved hentning af blog: ${errorMessage}`);
    }

    const data = await res.json();
    return data as BlogPublicDTO;
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

    if (res.status === 404) {
        return null; // Blog ikke fundet
    }
    
    if (!res.ok) {
        // API'en sender strukturerede fejlbeskeder via ExceptionMiddleware
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            if (errorBody) {
                const errorData = JSON.parse(errorBody);
                errorMessage = errorData.message || errorMessage;
            }
        } catch {}
        throw new Error(`Fejl ved hentning af blog: ${errorMessage}`);
    }

    const data = await res.json();
    return data as Blog_DTO;
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

    if (!res.ok) {
        // API'en sender strukturerede fejlbeskeder via ExceptionMiddleware
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            if (errorBody) {
                const errorData = JSON.parse(errorBody);
                errorMessage = errorData.message || errorMessage;
            }
        } catch {}
        throw new Error(`Fejl ved opdatering af blog: ${errorMessage}`);
    }

    const data = await res.json();
    return data as Blog_DTO;
}


//---------------- DELETE METHODS ------------------