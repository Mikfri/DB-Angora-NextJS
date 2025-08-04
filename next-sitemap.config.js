/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://db-angora.dk',
    generateRobotsTxt: true,
    exclude: ['/account', '/account/*', '/api/*', '/admin/*'],
    changefreq: 'daily',
    priority: 0.7,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/account/*', '/api/*', '/admin/*']
            }
        ],
    },
    transform: async (config, path) => {
        return {
            loc: path,
            changefreq: config.changefreq,
            priority: 
                path === '/' ? 1.0 :
                path.startsWith('/annoncer/kaniner/') && path.split('/').length > 3 ? 0.6 : // Dynamiske kanin-sider
                path.startsWith('/blogs/') && path.split('/').length > 2 ? 0.6 : // Dynamiske blog-sider
                path.startsWith('/annoncer') ? 0.8 :
                path.startsWith('/blogs') ? 0.7 :
                0.6,
            lastmod: new Date().toISOString()
        }
    },
    additionalPaths: async () => {
        // Import JavaScript wrapper-funktioner
        const { getRabbitSaleItemsForSitemap, getBlogsForSitemap } = await import('./src/utils/sitemap-helpers.js');

        console.log('🔍 Starting additionalPaths generation...');

        const basePaths = [
            { 
                loc: '/',
                changefreq: 'daily',
                priority: 1.0,
                lastmod: new Date().toISOString()
            },
            { 
                loc: '/annoncer',
                changefreq: 'daily',
                priority: 0.9,
                lastmod: new Date().toISOString()
            },
            { 
                loc: '/annoncer/kaniner',
                changefreq: 'daily',
                priority: 0.8,
                lastmod: new Date().toISOString()
            },
            { 
                loc: '/blogs',
                changefreq: 'daily',
                priority: 0.7,
                lastmod: new Date().toISOString()
            }
        ];

        const dynamicPaths = [];

        // Hent kanin-sider via wrapper
        try {
            console.log('🐰 Fetching rabbit sales via sitemap helpers...');
            const rabbits = await getRabbitSaleItemsForSitemap();
            
            if (rabbits.length > 0) {
                const rabbitPaths = rabbits.map(rabbit => ({
                    loc: `/annoncer/kaniner/${rabbit.slug}`,
                    changefreq: 'weekly',
                    priority: 0.6,
                    lastmod: rabbit.lastModified
                }));
                dynamicPaths.push(...rabbitPaths);
                console.log('🐰 Added', rabbitPaths.length, 'rabbit paths');
            } else {
                console.warn('🐰 No rabbit data returned');
            }
        } catch (error) {
            console.error('❌ Failed to fetch rabbit sales:', error);
        }

        // Hent blog-sider via wrapper
        try {
            console.log('📝 Fetching blogs via sitemap helpers...');
            const blogs = await getBlogsForSitemap();
            
            if (blogs.length > 0) {
                const blogPaths = blogs.map(blog => ({
                    loc: `/blogs/${blog.slug}`,
                    changefreq: 'weekly',
                    priority: 0.6,
                    lastmod: blog.lastModified
                }));
                dynamicPaths.push(...blogPaths);
                console.log('📝 Added', blogPaths.length, 'blog paths');
            } else {
                console.warn('📝 No blog data returned');
            }
        } catch (error) {
            console.error('❌ Failed to fetch blogs:', error);
        }

        console.log('✅ Total paths:', basePaths.length + dynamicPaths.length);
        return [...basePaths, ...dynamicPaths];
    }
}