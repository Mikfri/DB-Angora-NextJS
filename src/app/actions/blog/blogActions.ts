// src/app/actions/blog/blogActions.ts
import { getAccessToken } from '@/app/actions/auth/session';
import { getBlogs, getBlogBySlug } from '@/api/endpoints/blogControllser';
import type { Blog_CardFilterDTO, PagedResultDTO, Blog_CardDTO, Blog_DTO } from '@/api/types/AngoraDTOs';

// Server action til at hente blogs med/uden auth
export async function fetchBlogsAction(
    filter: Blog_CardFilterDTO
): Promise<PagedResultDTO<Blog_CardDTO> | null> {
    const accessToken = await getAccessToken();
    return await getBlogs(filter, accessToken ?? undefined);
}

// Server action til at hente et enkelt blogindlæg via slug
export async function fetchBlogBySlugAction(
    slug: string
): Promise<Blog_DTO | null> {
    const accessToken = await getAccessToken();
    return await getBlogBySlug(slug, accessToken ?? undefined);
}