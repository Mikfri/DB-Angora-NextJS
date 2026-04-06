// src/api/types/BlogDTOs.ts

import { PhotoPrivateDTO, PhotoPublicDTO } from './PhotoDTOs';

/**
 * DTO til oprettelse af et nyt blogindlæg.
 */
export interface Blog_CreateDTO {
    title?: string | null;
    subtitle?: string | null;
    content?: string | null;
    visibilityLevel?: string | null;    // "Public", "PaidContent"
    category?: string | null;
    tags?: string | null;
    //metaDescription?: string | null; // Undladt ved oprettelse (metaDescription = title)
}

export interface Blog_UpdateDTO {
    title: string;
    subtitle?: string | null;
    content: string;
    visibilityLevel: string;            // "Public", "PaidContent"
    category: string;
    tags?: string | null;
    metaDescription?: string | null;
}

/**
 * DTO til filtrering af blogindlæg for autentificerede brugere.
 * Benyttes under './account/myBlogs/' sektionen.
 */
export interface BlogAuthedCardFilterDTO {
    isPublished?: boolean | null;
    visibilityLevel?: string | null;    // "Public", "PaidContent"
    searchTitlesAndContent?: string | null;
}

/**
 * DTO til at vise et blog preview som card for en blog-content creator. Benyttes under:
 * ./account/myBlogs sektionen.
 */
export interface BlogCardPreviewDTO {
    id: number;
    slug: string;
    visibilityLevel: string;
    category: string;
    title: string;
    subtitle?: string | null;
    contentSummary: string;
    authorId?: string | null;
    authorName?: string | null;
    authorPhotoUrl?: string | null;
    publishDate?: string | null;    // ISO8601 string fra backend (DateTime? i C#)
    isPublished: boolean;           // Har altid værdi, som enten true eller false
    profilePhotoUrl?: string | null;
    viewCount: number;
}

/**
 * DTO til filtrering af blogindlæg for alle besøgende af sitet.
 * Benyttes under './blogs' sektionen.
 */
export interface BlogCardPreviewFilterDTO {
    authorFullName?: string | null;
    searchTerm?: string | null;
    tagFilter?: string | null;
    categoryFilter?: string | null;
    sortBy?: string | null; // "Newest", ...
}


/**
 * 'BlogPrivateDTO' er tiltænkt den private ejer af et blogindlæg, som skal kunne se alle relevante detaljer,
 * for et blogindlæg, og hvad hører med af evt Photos mm...
 */
export interface BlogPrivateDTO {
    id: number;
    slug: string;
    title: string;
    subtitle?: string | null;
    content: string;
    visibilityLevel: string;            // "Public", "PaidContent"
    category: string;
    tags: string | null;
    authorId: string;
    authorName: string;
    authorPhotoUrl?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    publishDate?: string | null;
    isPublished: boolean;
    profilePhotoId?: number | null;
    profilePhotoUrl?: string | null;
    metaDescription?: string | null;
    viewCount: number;
    //--- DTO'er
    photos?: PhotoPrivateDTO[] | null;
}

/**
 * DTO til offentlige blogindlæg, som kan tilgås uden autentifikation.
 * Indeholder kun de felter som er nødvendige for offentlig visning, uden følsomme oplysninger.
 */
export interface BlogPublicDTO {
    id: number;                         // bør denne være med?
    slug: string;
    title: string;
    subtitle?: string | null;
    content: string;
    visibilityLevel: string;            // "Public", "PaidContent"
    tags?: string | null;               // Comma-separated tags
    //authorId: string;
    authorName: string;
    authorPhotoUrl?: string | null;
    //createdAt?: string | null;
    //updatedAt?: string | null;
    publishDate?: string | null;
    isPublished: boolean;
    profilePhotoUrl?: string | null;
    metaDescription?: string | null;
    viewCount: number;
    //--- DTO'er
    photos: PhotoPublicDTO[];
}

/**
 * DTO til at vise de seneste blogindlæg for hver kategori på forsiden af blogs-sektionen.
 */
export interface BlogsLatestByCategoryDTO {
    category: string;
    featured?: BlogCardPreviewDTO | null;
    next?: BlogCardPreviewDTO[];
}

/**
 * Representerer statusinformation om et blogindlæg, herunder om det er publiceret, og relevante datoer for publicering og opdatering.
 */
export interface BlogStatusDTO {
    id: number;
    isPublished: boolean;
    publishDate?: string | null;
    updatedAt?: string | null;
}