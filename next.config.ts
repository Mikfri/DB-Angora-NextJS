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
        ],
    }
};

export default nextConfig;