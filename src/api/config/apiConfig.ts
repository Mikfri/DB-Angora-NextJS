// src/api/config/apiConfig.ts
interface ApiConfig {
  baseUrl: string;
  env: string;
}

export const apiConfig: ApiConfig = {
  env: process.env.NEXT_PUBLIC_API_ENV || 'production',
  get baseUrl() {
      const url = process.env.NEXT_PUBLIC_API_BASE_URL; // vercel.db-angora/settings/environments
      if (!url) {
          console.warn('Missing NEXT_PUBLIC_API_BASE_URL, using fallback');
          return 'https://api.db-angora.dk';  // Update fallback URL
      }
      return url;
  }
};

export const getApiUrl = (endpoint: string): string => {
  const base = apiConfig.baseUrl.replace(/\/$/, ''); // fjerner trailing slash
  const path = endpoint.replace(/^\//, '');          // fjerner leading slash
  return `${base}/${path}`;
};