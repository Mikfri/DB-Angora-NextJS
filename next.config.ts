import type { NextConfig } from "next";

// Tillad self-signed certifikat fra lokal .NET dev API (kun i development)
// SKAL IKKE fjernes fra next.config.ts — .env er ikke det rette sted (copy-paste-risiko til prod)
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('[dev] NODE_TLS_REJECT_UNAUTHORIZED=0 — accepterer self-signed certifikater fra localhost');
}

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