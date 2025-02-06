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
    additionalPaths: async () => {
        return [
            { 
                loc: '/sale/rabbits',
                changefreq: 'daily',
                priority: 0.8
            },
            { 
                loc: '/sale/wool',
                changefreq: 'daily',
                priority: 0.8
            }
        ]
    }
}