// src/api/endpoints/blogController.ts
import { getApiUrl } from "../config/apiConfig";
import { parseApiError } from "../client/errorHandlers";
import type {
    BlogCardPreviewFilterDTO, ResultPagedDTO, BlogCardPreviewDTO, Blog_UpdateDTO, BlogPublicDTO,
    CloudinaryUploadConfigDTO, PhotoPrivateDTO, CloudinaryPhotoRegistryRequestDTO,
    Blog_CreateDTO, BlogAuthedCardFilterDTO, BlogsLatestByCategoryDTO, BlogPrivateDTO
} from '@/api/types/AngoraDTOs';

//---------------- POST METHODS -----------------

export async function createBlog(
    createDTO: Blog_CreateDTO = {},
    accessToken: string
): Promise<BlogPrivateDTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }

    const url = getApiUrl('Blog');

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(createDTO)
    });

    if (!res.ok && res.status !== 201) {
        throw await parseApiError(res, 'Fejl ved oprettelse af blog');
    }

    const data: unknown = await res.json();
    if (
        typeof data === "object" && data !== null &&
        "blog" in data && typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: BlogPrivateDTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

export async function publishBlog(
    blogId: number,
    accessToken: string
): Promise<BlogPrivateDTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }

    const res = await fetch(getApiUrl(`Blog/${blogId}/publish`), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved publicering af blog');
    }

    const data: unknown = await res.json();
    if (
        typeof data === "object" && data !== null &&
        "blog" in data && typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: BlogPrivateDTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

export async function unpublishBlog(
    blogId: number,
    accessToken: string
): Promise<BlogPrivateDTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }

    const res = await fetch(getApiUrl(`Blog/${blogId}/unpublish`), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved tilbagetrækning af blog');
    }

    const data: unknown = await res.json();
    if (
        typeof data === "object" && data !== null &&
        "blog" in data && typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: BlogPrivateDTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

export async function schedulePublishBlog(
    blogId: number,
    publishDate: Date | string,
    accessToken: string
): Promise<BlogPrivateDTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }

    const publishDateIso = typeof publishDate === "string" ? publishDate : publishDate.toISOString();

    if (new Date(publishDateIso) <= new Date()) {
        throw new Error("Publiceringstidspunktet skal være i fremtiden");
    }

    const res = await fetch(getApiUrl(`Blog/${blogId}/schedule`), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(publishDateIso)
    });

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved planlægning af publicering');
    }

    const data: unknown = await res.json();
    if (
        typeof data === "object" && data !== null &&
        "blog" in data && typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: BlogPrivateDTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

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

    const res = await fetch(getApiUrl(`Blog/${blogId}/photos`), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestDTO)
    });

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved registrering af blogfoto');
    }

    const data: unknown = await res.json();
    if (
        typeof data === "object" && data !== null &&
        "photo" in data && typeof (data as { photo: unknown }).photo === "object"
    ) {
        return (data as { photo: PhotoPrivateDTO }).photo;
    }
    throw new Error("API svarede ikke med foto-data.");
}

//----------------- GET METHODS -----------------

export async function getLatestBlogsByCategory(
    category: string,
    accessToken?: string
): Promise<BlogsLatestByCategoryDTO | null> {
    const url = getApiUrl(`Blog/latest-by-category?category=${encodeURIComponent(category)}`);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const res = await fetch(url, { method: 'GET', headers });

    if (res.status === 401 || res.status === 403 || res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved hentning af seneste blogs for kategori');
    }

    const data = await res.json();
    if (typeof data === "object" && data !== null && "data" in data) {
        return data.data as BlogsLatestByCategoryDTO;
    }
    return null;
}

export async function getBlogs(
    filter: BlogCardPreviewFilterDTO,
    page: number = 1,
    pageSize: number = 12,
    accessToken?: string
): Promise<ResultPagedDTO<BlogCardPreviewDTO> | null> {
    const params = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
    });

    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const res = await fetch(getApiUrl(`Blog?${params.toString()}`), { method: 'GET', headers });

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved hentning af blogs');
    }

    return await res.json() as ResultPagedDTO<BlogCardPreviewDTO>;
}

export async function getBlogsAuthoredByUser(
    targetedUserId: string,
    filterDTO: Omit<BlogAuthedCardFilterDTO, 'page' | 'pageSize'>,
    page: number,
    pageSize: number,
    accessToken: string
): Promise<ResultPagedDTO<BlogCardPreviewDTO> | null> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }

    const params = new URLSearchParams();

    Object.entries(filterDTO).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
    });

    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const res = await fetch(
        getApiUrl(`Blog/authored-by/${encodeURIComponent(targetedUserId)}?${params.toString()}`),
        { method: 'GET', headers }
    );

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved hentning af brugerens blogs');
    }

    return await res.json() as ResultPagedDTO<BlogCardPreviewDTO>;
}

export async function getBlogBySlug(
    slug: string,
    accessToken?: string
): Promise<BlogPublicDTO | null> {
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (accessToken && accessToken.trim() !== "") {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await fetch(getApiUrl(`Blog/${encodeURIComponent(slug)}`), { method: 'GET', headers });

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved hentning af blog');
    }

    const data: unknown = await res.json();
    if (
        typeof data === "object" && data !== null &&
        "blog" in data && typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: BlogPublicDTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

export async function getBlogById(
    blogId: number,
    accessToken: string
): Promise<BlogPrivateDTO | null> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }

    const res = await fetch(getApiUrl(`Blog/${blogId}`), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved hentning af blog');
    }

    const data: unknown = await res.json();
    if (
        typeof data === "object" && data !== null &&
        "blog" in data && typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: BlogPrivateDTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

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

    const res = await fetch(getApiUrl(`Blog/${blogId}/photos/upload-config`), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved hentning af upload konfiguration');
    }

    const data: unknown = await res.json();
    if (
        typeof data === "object" && data !== null &&
        "data" in data && typeof (data as { data: unknown }).data === "object"
    ) {
        return (data as { data: CloudinaryUploadConfigDTO }).data;
    }
    throw new Error("API svarede ikke med upload-konfiguration.");
}

//------------------ PUT METHODS -------------------

export async function updateBlog(
    blogId: number,
    updateDTO: Blog_UpdateDTO,
    accessToken: string
): Promise<BlogPrivateDTO> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }

    const res = await fetch(getApiUrl(`Blog/${blogId}`), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updateDTO)
    });

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved opdatering af blog');
    }

    const data: unknown = await res.json();
    if (
        typeof data === "object" && data !== null &&
        "blog" in data && typeof (data as { blog: unknown }).blog === "object"
    ) {
        return (data as { blog: BlogPrivateDTO }).blog;
    }
    throw new Error("API svarede ikke med blog-data.");
}

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

    const res = await fetch(getApiUrl(`Blog/${blogId}/photo/${photoId}`), {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved opdatering af featured image');
    }

    const data: unknown = await res.json();
    if (
        typeof data === "object" && data !== null &&
        "photo" in data && typeof (data as { photo: unknown }).photo === "object"
    ) {
        return (data as { photo: PhotoPrivateDTO }).photo;
    }
    throw new Error("API svarede ikke med foto-data.");
}

//---------------- DELETE METHODS ------------------

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

    const res = await fetch(getApiUrl(`Blog/${blogId}`), {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved sletning af blog');
    }

    const data: unknown = await res.json();
    if (typeof data === "object" && data !== null && "message" in data) {
        return data as { message: string; deleted?: unknown };
    }
    throw new Error("API svarede ikke med sletnings-data.");
}

export async function deleteBlogPhoto(
    blogId: number,
    photoId: number,
    accessToken: string
): Promise<{ message: string; deleted?: unknown }> {
    if (!accessToken || accessToken.trim() === "") {
        throw new Error("Access token is required for this endpoint.");
    }
    if (!blogId || blogId <= 0) {
        throw new Error("Valid blog ID is required.");
    }
    if (!photoId || photoId <= 0) {
        throw new Error("Valid photo ID is required.");
    }

    const res = await fetch(getApiUrl(`Blog/${blogId}/photos/${photoId}`), {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        throw await parseApiError(res, 'Fejl ved sletning af blogfoto');
    }

    const data: unknown = await res.json();
    if (typeof data === "object" && data !== null && "message" in data) {
        return data as { message: string; deleted?: unknown };
    }
    throw new Error("API svarede ikke med sletnings-data.");
}
