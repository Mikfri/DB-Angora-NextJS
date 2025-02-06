/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://db-angora.dk',
    generateRobotsTxt: true,
    exclude: ['/account', '/account/*', '/api/*'],
    changefreq: 'daily',
    priority: 0.7,
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' }
        ]
    },
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/account/*', '/api/*']
            }
        ],
    },
    transform: async (config, path) => {
        return {
            loc: path,
            changefreq: config.changefreq,
            priority: 
                path === '/' ? 1.0 :
                path.startsWith('/sale/rabbits/profile/') ? 0.6 :
                path.startsWith('/sale/') ? 0.8 :
                0.7,
            lastmod: new Date().toISOString()
        }
    },
    additionalPaths: async () => {
        const basePaths = [
            { 
                loc: '/',
                changefreq: 'daily',
                priority: 1.0,
                lastmod: new Date().toISOString()
            },
            { 
                loc: '/sale',  // Tilføjet parent sale side
                changefreq: 'daily',
                priority: 0.9,  // Højere prioritet da det er en hovedkategori
                lastmod: new Date().toISOString()
            },
            { 
                loc: '/sale/rabbits',
                changefreq: 'daily',
                priority: 0.8,
                lastmod: new Date().toISOString()
            },
            { 
                loc: '/sale/wool',
                changefreq: 'daily',
                priority: 0.8,
                lastmod: new Date().toISOString()
            }
        ];

        try {
            const response = await fetch('https://api.db-angora.dk/Rabbit/ForSale', {
                method: 'GET',
                headers: {
                    'accept': 'text/plain'
                }
            });
        
            if (!response.ok) {
                throw new Error(`Failed to fetch rabbits: ${response.status}`);
            }
        
            const rabbits = await response.json();
            
            const rabbitPaths = rabbits.map(rabbit => ({
                loc: `/sale/rabbits/profile/${rabbit.earCombId}`,
                changefreq: 'daily',
                priority: 0.6,
                lastmod: new Date().toISOString()
            }));
        
            return [...basePaths, ...rabbitPaths];

        } catch (error) {
            console.warn('Failed to fetch rabbit profiles:', error);
            return basePaths;
        }
    }
}