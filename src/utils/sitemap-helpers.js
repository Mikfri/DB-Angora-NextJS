// src/utils/sitemap-helpers.js

// JavaScript wrapper til brug i sitemap-generering

/**
 * Henter kanin-salgsopslag til sitemap via korrekte API-kald
 */
export async function getRabbitSaleItemsForSitemap() {
    try {
        console.log('🐰 Fetching rabbit sales via API...');
        
        // Brug GET med query parameters (ikke POST med body)
        const url = new URL('https://api.db-angora.dk/Sale/Rabbits');
        url.searchParams.append('Page', '1');
        url.searchParams.append('PageSize', '100');
        
        const response = await fetch(url.toString(), {
            method: 'GET',  // Ret til GET!
            headers: {
                'accept': 'application/json'  // Fjern Content-Type
            }
            // Ingen body for GET requests
        });

        console.log('🐰 API response status:', response.status);

        if (response.ok) {
            const result = await response.json();
            console.log('🐰 API response structure:', { 
                hasData: !!result.data, 
                dataLength: result.data?.length,
                totalCount: result.totalCount,
                keys: Object.keys(result)
            });
            
            // Test forskellige strukturer
            const data = result.data || result.items || result;
            
            if (Array.isArray(data) && data.length > 0) {
                return data.map(rabbit => ({
                    slug: rabbit.slug || rabbit.earCombId || `rabbit-${rabbit.id}`,
                    lastModified: new Date().toISOString()
                }));
            }
        } else {
            const errorText = await response.text();
            console.error('🐰 API error:', response.status, errorText);
        }
        
        return [];
    } catch (error) {
        console.error('❌ Failed to fetch rabbits for sitemap:', error);
        return [];
    }
}

/**
 * Henter blog-indlæg til sitemap - prøv uden autorisation først
 */
export async function getBlogsForSitemap() {
    try {
        console.log('📝 Fetching blogs via API...');
        
        // Prøv GET først (public blogs)
        const getUrl = new URL('https://api.db-angora.dk/Blog');
        getUrl.searchParams.append('Page', '1');
        getUrl.searchParams.append('PageSize', '100');
        
        let response = await fetch(getUrl.toString(), {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        console.log('📝 GET API response status:', response.status);
       

        if (response.ok) {
            const result = await response.json();
            console.log('📝 API response structure:', { 
                hasData: !!result.data, 
                dataLength: result.data?.length,
                totalCount: result.totalCount,
                keys: Object.keys(result)
            });
            
            // Test forskellige strukturer
            const data = result.data || result.items || result;
            
            if (Array.isArray(data) && data.length > 0) {
                return data.map(blog => ({
                    slug: blog.slug,
                    lastModified: new Date().toISOString()
                }));
            }
        } else {
            const errorText = await response.text();
            console.error('📝 API error:', response.status, errorText);
        }
        
        return [];
    } catch (error) {
        console.error('❌ Failed to fetch blogs for sitemap:', error);
        return [];
    }
}