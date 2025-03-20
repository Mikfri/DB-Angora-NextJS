import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.db-angora.dk',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/db-angora/**',
            },
        ],
    }
};

export default nextConfig;