// src/api/endpoints/blogController.ts
import { getApiUrl } from "../config/apiConfig";
import type { Blog_CardFilterDTO, PagedResultDTO, Blog_CardDTO, Blog_DTO } from '@/api/types/AngoraDTOs';

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
        } catch (e) {
            // ignore
        }
        throw new Error(`Fejl ved hentning af blogs: ${errorMessage}`);
    }

    const data = await res.json();
    return data as PagedResultDTO<Blog_CardDTO>;
}

export async function getBlogBySlug(
    slug: string,
    accessToken?: string
): Promise<Blog_DTO | null> {
    const url = getApiUrl(`Blog/slug/${encodeURIComponent(slug)}`);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (accessToken && accessToken.trim() !== "") {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {
        method: 'GET',
        headers
    });

    if (res.status === 404) {
        return null; // Blog ikke fundet
    }
    if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
            const errorBody = await res.text();
            if (errorBody) errorMessage = errorBody;
        } catch (e) {}
        throw new Error(`Fejl ved hentning af blog: ${errorMessage}`);
    }

    const data = await res.json();
    return data as Blog_DTO;
}
//------------------ PUT METHODS -------------------
//---------------- DELETE METHODS ------------------