// src/app/actions/blog/blogActions.ts

'use server';
import { getAccessToken } from '@/app/actions/auth/session';
import { getBlogs, getBlogBySlug } from '@/api/endpoints/blogControllser';
import type { Blog_CardFilterDTO, PagedResultDTO, Blog_CardDTO, Blog_DTO } from '@/api/types/AngoraDTOs';

// ====================== TYPES ======================

export type BlogListResult = 
  | { success: true; data: PagedResultDTO<Blog_CardDTO> }
  | { success: false; error: string };

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

// ====================== READ (BY SLUG) ======================

/**
 * Server Action: Henter et enkelt blogindlæg via slug
 * @param slug Slug for blogindlægget
 * @returns Detaljeret blog eller fejlbesked
 */
export async function fetchBlogBySlugAction(
    slug: string
): Promise<BlogResult> {
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
            data: blog
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