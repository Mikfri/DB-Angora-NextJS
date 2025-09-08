// src/app/actions/blog/blogActions.ts

'use server';
import { getAccessToken } from '@/app/actions/auth/session';
import { getBlogs, getBlogBySlug, getBlogsAuthoredByUser, getBlogById, updateBlog } from '@/api/endpoints/blogController';
import type { Blog_CardFilterDTO, PagedResultDTO, Blog_CardDTO, Blog_DTO, Blog_UpdateDTO, BlogPublicDTO } from '@/api/types/AngoraDTOs';

// ====================== TYPES ======================

export type BlogListResult =
    | { success: true; data: PagedResultDTO<Blog_CardDTO> }
    | { success: false; error: string };

export type BlogPublicResult =
    | { success: true; data: BlogPublicDTO }
    | { success: false; error: string; status?: number };

export type BlogResult =
    | { success: true; data: Blog_DTO }
    | { success: false; error: string; status?: number };

// ====================== READ (FILTERED) ======================

/**
 * Server Action: Henter filtrerede blogs
 * @param filter Filtreringsparametre for blogs
 * @returns Pagineret liste af blogs
 */
export async function fetchBlogsAction(
    filter?: Blog_CardFilterDTO
): Promise<BlogListResult> {
    try {
        // Initialiser filter hvis det ikke er angivet
        if (!filter) {
            filter = {
                authorFullName: null,
                searchTerm: null,
                tagFilter: null,
                blogSortOption: null,
                page: 1,
                pageSize: 12
            };
        }

        // Sikrer at page og pageSize er gyldige
        if (!filter.page || filter.page < 1) {
            filter.page = 1;
        }

        if (!filter.pageSize || filter.pageSize < 1) {
            filter.pageSize = 12;
        }

        const accessToken = await getAccessToken();
        const blogs = await getBlogs(filter, accessToken ?? undefined);

        if (!blogs) {
            return {
                success: false,
                error: 'Kunne ikke hente blogs'
            };
        }

        return {
            success: true,
            data: blogs
        };
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl'
        };
    }
}

/**
 * Server Action: Henter alle blogs skrevet af en bestemt bruger (inklusive kladder, hvis adgang)
 * Kun admin, moderator og content team kan tilgå andres blogindlæg.
 * @param userId - ID på brugeren hvis blogs ønskes
 * @param searchTerm - Søgeord til filtrering (optional)
 * @param page - Side (default 1)
 * @param pageSize - Antal pr. side (default 12)
 * @returns Pagineret liste af blogs eller fejlbesked
 */
export async function fetchBlogsAuthoredByUserAction(
    userId: string,
    searchTerm?: string,
    page: number = 1,
    pageSize: number = 12
): Promise<BlogListResult> {
    try {
        if (!userId || userId.trim() === "") {
            return {
                success: false,
                error: "User ID is required."
            };
        }

        const accessToken = await getAccessToken();
        const blogs = await getBlogsAuthoredByUser(
            userId,
            searchTerm,
            page,
            pageSize,
            accessToken ?? undefined
        );

        if (!blogs) {
            return {
                success: false,
                error: "Kunne ikke hente brugerens blogs"
            };
        }

        return {
            success: true,
            data: blogs
        };
    } catch (error) {
        console.error("Failed to fetch blogs authored by user:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Der skete en uventet fejl"
        };
    }
}

// ---------------------- READ (BY SLUG)

/**
 * Server Action: Henter et enkelt blogindlæg via slug
 * @param slug Slug for blogindlægget
 * @returns Detaljeret blog eller fejlbesked
 */
export async function fetchBlogBySlugAction(
    slug: string
): Promise<BlogPublicResult> { // <-- RET HER
    try {
        if (!slug) {
            return {
                success: false,
                error: 'Manglende blog slug',
                status: 400
            };
        }

        const accessToken = await getAccessToken();
        const blog = await getBlogBySlug(slug, accessToken ?? undefined);

        if (!blog) {
            return {
                success: false,
                error: `Blog med slug '${slug}' blev ikke fundet.`,
                status: 404
            };
        }

        return {
            success: true,
            data: blog // <-- BlogPublicDTO
        };
    } catch (error) {
        console.error(`Failed to fetch blog with slug ${slug}:`, error);

        if (error instanceof Error && error.message.includes('blev ikke fundet')) {
            return {
                success: false,
                error: `Blog med slug '${slug}' blev ikke fundet.`,
                status: 404
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500
        };
    }
}

// ====================== READ (BY BLOGID) ======================
/**
 * Server Action: Henter et enkelt blogindlæg via ID (for blog-content teamet)
 * Kræver Blog:Read claim i accessToken.
 * @param blogId ID for blogindlægget (integer)
 * @returns Detaljeret blog eller fejlbesked
 */
export async function fetchBlogByIdAction(
    blogId: number
): Promise<BlogResult> {
    try {
        if (!blogId || blogId <= 0) {
            return {
                success: false,
                error: 'Ugyldigt blog ID',
                status: 400
            };
        }

        const accessToken = await getAccessToken();

        if (!accessToken) {
            return {
                success: false,
                error: 'Du skal være logget ind for at tilgå dette indhold',
                status: 401
            };
        }

        const blog = await getBlogById(blogId, accessToken);

        if (!blog) {
            return {
                success: false,
                error: `Blog med ID '${blogId}' blev ikke fundet.`,
                status: 404
            };
        }

        return {
            success: true,
            data: blog
        };
    } catch (error) {
        console.error(`Failed to fetch blog with ID ${blogId}:`, error);

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500
        };
    }
}

// ====================== PUT (UPDATE) ======================

/**
 * Server Action: Opdaterer et eksisterende blogindlæg
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget (integer)
 * @param updateDTO - Data til opdatering af blogindlægget
 * @returns Det opdaterede blogindlæg eller fejlbesked
 */
export async function updateBlogAction(
    blogId: number,
    updateDTO: Blog_UpdateDTO
): Promise<BlogResult> {
    try {
        if (!blogId || blogId <= 0) {
            return {
                success: false,
                error: 'Ugyldigt blog ID',
                status: 400
            };
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                success: false,
                error: 'Du skal være logget ind for at opdatere et blogindlæg',
                status: 401
            };
        }

        const updatedBlog = await updateBlog(blogId, updateDTO, accessToken);

        return {
            success: true,
            data: updatedBlog
        };
    } catch (error) {
        console.error(`Failed to update blog with ID ${blogId}:`, error);

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500
        };
    }
}
