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
            {
                protocol: 'https',
                hostname: 'angoralunden.dk',
                port: '',
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;