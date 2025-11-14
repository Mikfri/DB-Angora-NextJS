// src/app/actions/blog/blogActions.ts

'use server';
import { getAccessToken } from '@/app/actions/auth/session';
import { getBlogs, getBlogBySlug, getBlogsAuthoredByUser, getBlogById, updateBlog, getBlogImageUploadConfig, registerCloudinaryBlogPhoto, deleteBlogPhoto, updateBlogFeaturedImage, createBlog, publishBlog, unpublishBlog, schedulePublishBlog, deleteBlog, getLatestBlogsByCategory } from '@/api/endpoints/blogController';
import type { Blog_CardFilterDTO, PagedResultDTO, Blog_CardDTO, Blog_DTO, Blog_UpdateDTO, BlogPublicDTO, CloudinaryUploadConfigDTO, PhotoPrivateDTO, CloudinaryPhotoRegistryRequestDTO, PhotoDeleteDTO, Blog_CreateDTO, BlogsLatestByCategoryDTO } from '@/api/types/AngoraDTOs';

// ====================== TYPES ======================
export type BlogCreateResult =
    | { success: true; data: Blog_DTO }
    | { success: false; error: string; status?: number };

export type BlogPublishResult =
    | { success: true; data: Blog_DTO }
    | { success: false; error: string; status?: number };

export type BlogSchedulePublishResult =
    | { success: true; data: Blog_DTO }
    | { success: false; error: string; status?: number };

export type BlogUnpublishResult =
    | { success: true; data: Blog_DTO }
    | { success: false; error: string; status?: number };

export type BlogPhotoRegistryResult =
    | { success: true; data: PhotoPrivateDTO }
    | { success: false; error: string; status?: number };

export type BlogLatestByCategoryResult =
    | { success: true; data: BlogsLatestByCategoryDTO }
    | { success: false; error: string; status?: number };

export type BlogListResult =
    | { success: true; data: PagedResultDTO<Blog_CardDTO> }
    | { success: false; error: string; status?: number };

export type BlogPublicResult =
    | { success: true; data: BlogPublicDTO }
    | { success: false; error: string; status?: number };

export type BlogResult =
    | { success: true; data: Blog_DTO }
    | { success: false; error: string; status?: number };

export type BlogImageUploadConfigResult =
    | { success: true; data: CloudinaryUploadConfigDTO }
    | { success: false; error: string; status?: number };

export type BlogFeaturedImageUpdateResult =
    | { success: true; data: PhotoPrivateDTO }
    | { success: false; error: string; status?: number };

export type BlogPhotoDeleteResult =
    | { success: true; message: string }
    | { success: false; error: string; status?: number };

export type BlogDeleteResult =
    | { success: true; message: string }
    | { success: false; error: string; status?: number };
// ====================== POST METHODS ======================
/**
 * Server Action: Opretter et nyt blogindlæg
 * Kræver CreateBlog claim i accessToken.
 * @param createDTO - Data til oprettelse af nyt blogindlæg
 * @returns Det oprettede blogindlæg eller fejlbesked
 */
export async function createBlogAction(
    createDTO: Blog_CreateDTO = {}
): Promise<BlogCreateResult> {
    try {
        // Fjern denne check:
        // if (!createDTO) {
        //     return {
        //         success: false,
        //         error: 'Blog data mangler',
        //         status: 400,
        //     };
        // }

        // Hent accessToken fra session/server
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                success: false,
                error: 'Du skal være logget ind for at oprette et blogindlæg',
                status: 401,
            };
        }

        const blog = await createBlog(createDTO, accessToken);

        return {
            success: true,
            data: blog,
        };
    } catch (error) {
        console.error('Failed to create blog:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500,
        };
    }
}

/**
 * Server Action: Publicerer et blogindlæg
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @returns Det publicerede blogindlæg eller fejlbesked
 */
export async function publishBlogAction(
    blogId: number
): Promise<BlogPublishResult> {
    try {
        if (!blogId || blogId <= 0) {
            return {
                success: false,
                error: 'Ugyldigt blog ID',
                status: 400,
            };
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                success: false,
                error: 'Du skal være logget ind for at publicere et blogindlæg',
                status: 401,
            };
        }

        const blog = await publishBlog(blogId, accessToken);

        return {
            success: true,
            data: blog,
        };
    } catch (error) {
        console.error('Failed to publish blog:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500,
        };
    }
}

/**
 * Server Action: Planlægger publicering af et blogindlæg på en given dato
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @param publishDate - Dato for publicering (ISO string eller Date)
 * @returns Det planlagte blogindlæg eller fejlbesked
 */
export async function schedulePublishBlogAction(
    blogId: number,
    publishDate: Date | string
): Promise<BlogSchedulePublishResult> {
    try {
        if (!blogId || blogId <= 0) {
            return {
                success: false,
                error: 'Ugyldigt blog ID',
                status: 400,
            };
        }
        if (!publishDate) {
            return {
                success: false,
                error: 'Publiceringsdato mangler',
                status: 400,
            };
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                success: false,
                error: 'Du skal være logget ind for at planlægge publicering',
                status: 401,
            };
        }

        const blog = await schedulePublishBlog(blogId, publishDate, accessToken);

        return {
            success: true,
            data: blog,
        };
    } catch (error) {
        console.error('Failed to schedule blog publish:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500,
        };
    }
}

/**
 * Server Action: Trækker et blogindlæg tilbage fra publicering (unpublish)
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @returns Det opdaterede blogindlæg eller fejlbesked
 */
export async function unpublishBlogAction(
    blogId: number
): Promise<BlogUnpublishResult> {
    try {
        if (!blogId || blogId <= 0) {
            return {
                success: false,
                error: 'Ugyldigt blog ID',
                status: 400,
            };
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                success: false,
                error: 'Du skal være logget ind for at trække et blogindlæg tilbage',
                status: 401,
            };
        }

        const blog = await unpublishBlog(blogId, accessToken);

        return {
            success: true,
            data: blog,
        };
    } catch (error) {
        console.error('Failed to unpublish blog:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500,
        };
    }
}

/**
 * Server Action: Registrerer et billede fra Cloudinary til et blogindlæg
 * Kræver CreateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget billedet tilhører
 * @param requestDTO - Billedoplysninger fra Cloudinary
 * @returns Det oprettede private Photo DTO eller fejlbesked
 */
export async function registerCloudinaryBlogPhotoAction(
    blogId: number,
    requestDTO: CloudinaryPhotoRegistryRequestDTO
): Promise<BlogPhotoRegistryResult> {
    try {
        if (!blogId || blogId <= 0) {
            return {
                success: false,
                error: 'Ugyldigt blog ID',
                status: 400
            };
        }
        if (!requestDTO) {
            return {
                success: false,
                error: 'Billedoplysninger mangler',
                status: 400
            };
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                success: false,
                error: 'Du skal være logget ind for at registrere et billede',
                status: 401
            };
        }

        const photo = await registerCloudinaryBlogPhoto(blogId, requestDTO, accessToken);

        return {
            success: true,
            data: photo
        };
    } catch (error) {
        console.error(`Failed to register Cloudinary photo for blog ${blogId}:`, error);

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500
        };
    }
}

// ====================== READ (FILTERED) ======================

/**
 * Server Action: Henter de seneste publicerede blogs for en given kategori
 * @param category Blogkategori (fx "PatchNotes", "Generel" osv.)
 * @returns DTO med seneste blogs for kategorien eller fejlbesked
 */
export async function fetchLatestBlogsByCategoryAction(
    category: string
): Promise<BlogLatestByCategoryResult> {
    try {
        if (!category || category.trim() === "") {
            return {
                success: false,
                error: "Kategori skal angives",
                status: 400
            };
        }

        // Hent accessToken hvis nødvendigt (valgfrit, afhængigt af API)
        const accessToken = await getAccessToken();

        const result = await getLatestBlogsByCategory(category, accessToken ?? undefined);

        if (!result) {
            return {
                success: false,
                error: "Ingen blogs fundet for denne kategori",
                status: 404
            };
        }

        return {
            success: true,
            data: result
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Der skete en uventet fejl",
            status: 500
        };
    }
}

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
 * Server Action: Henter ALLE blogs skrevet af en bestemt bruger (inklusive kladder).
 * Looper over alle sider fra backend.
 * Kun admin, moderator og content team kan tilgå andres blogindlæg.
 * @param userId - ID på brugeren hvis blogs ønskes
 * @returns Array af alle brugerens blogs eller fejlbesked
 */
export async function fetchBlogsAuthoredByUserAction(
    userId: string
): Promise<{ success: true; data: Blog_CardDTO[] } | { success: false; error: string; status?: number }> {
    try {
        if (!userId || userId.trim() === "") {
            return {
                success: false,
                error: "User ID is required."
            };
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                success: false,
                error: "Du skal være logget ind for at tilgå brugerens blogs.",
                status: 401
            };
        }

        // Loop over alle sider
        const allBlogs: Blog_CardDTO[] = [];
        let page = 1;
        const pageSize = 50; // Intern page size til loop (ikke eksponeret til klient)

        while (true) {
            const paged = await getBlogsAuthoredByUser(
                userId,
                {}, // Ingen filters
                page,
                pageSize,
                accessToken
            );

            if (!paged) {
                return {
                    success: false,
                    error: "Kunne ikke hente brugerens blogs"
                };
            }

            allBlogs.push(...paged.data);

            if (!paged.hasNextPage) {
                break;
            }
            page++;
        }

        return {
            success: true,
            data: allBlogs
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

/**
 * Server Action: Henter Cloudinary upload konfiguration for et blogindlæg
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @returns CloudinaryUploadConfigDTO eller fejlbesked
 */
export async function fetchBlogImageUploadConfigAction(
    blogId: number
): Promise<BlogImageUploadConfigResult> {
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
                error: 'Du skal være logget ind for at få upload konfiguration',
                status: 401
            };
        }

        const config = await getBlogImageUploadConfig(blogId, accessToken);

        return {
            success: true,
            data: config
        };
    } catch (error) {
        console.error(`Failed to fetch image upload config for blog ${blogId}:`, error);

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

/**
 * Server Action: Opdaterer hvilket billede der skal være featured image for et blogindlæg
 * Kræver UpdateBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @param photoId - ID på billedet der skal sættes som featured image
 * @returns Det opdaterede foto eller fejlbesked
 */
export async function updateBlogFeaturedImageAction(
    blogId: number,
    photoId: number
): Promise<BlogFeaturedImageUpdateResult> {
    try {
        if (!blogId || blogId <= 0) {
            return {
                success: false,
                error: 'Ugyldigt blog ID',
                status: 400
            };
        }
        if (!photoId || photoId <= 0) {
            return {
                success: false,
                error: 'Ugyldigt billede ID',
                status: 400
            };
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                success: false,
                error: 'Du skal være logget ind for at opdatere featured image',
                status: 401
            };
        }

        const updatedPhoto = await updateBlogFeaturedImage(blogId, photoId, accessToken);

        return {
            success: true,
            data: updatedPhoto
        };
    } catch (error) {
        console.error(`Failed to update featured image for blog ${blogId}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500
        };
    }
}

// ====================== DELETE ======================

/**
 * Server Action: Sletter et blogindlæg og alle relaterede fotos
 * Kræver DeleteBlog claim i accessToken.
 * @param blogId - ID på blogindlægget
 * @returns Bekræftelse på sletning eller fejlbesked
 */
export async function deleteBlogAction(
    blogId: number
): Promise<BlogDeleteResult> {
    try {
        if (!blogId || blogId <= 0) {
            return {
                success: false,
                error: 'Ugyldigt blog ID',
                status: 400,
            };
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                success: false,
                error: 'Du skal være logget ind for at slette et blogindlæg',
                status: 401,
            };
        }

        const result = await deleteBlog(blogId, accessToken);

        return {
            success: true,
            message: result.message,
        };
    } catch (error) {
        console.error('Failed to delete blog:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500,
        };
    }
}

/**
 * Server Action: Sletter et billede fra et blogindlæg
 * Kræver UpdateBlog claim i accessToken.
 * @param deletionDTO - DTO med PhotoId og BlogId
 * @returns Bekræftelse på sletning eller fejlbesked
 */
export async function deleteBlogPhotoAction(
    deletionDTO: PhotoDeleteDTO
): Promise<BlogPhotoDeleteResult> {
    try {
        if (!deletionDTO || !deletionDTO.photoId || !deletionDTO.entityIntId) {
            return {
                success: false,
                error: 'PhotoId og BlogId skal angives',
                status: 400
            };
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            return {
                success: false,
                error: 'Du skal være logget ind for at slette et billede',
                status: 401
            };
        }

        const result = await deleteBlogPhoto(deletionDTO, accessToken);

        return {
            success: true,
            message: result.message
        };
    } catch (error) {
        console.error('Failed to delete blog photo:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Der skete en uventet fejl',
            status: 500
        };
    }
}