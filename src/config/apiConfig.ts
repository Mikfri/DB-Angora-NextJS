// src/config/apiConfig.ts
interface ApiConfig {
  baseUrl: string;
  env: string;
}

export const apiConfig: ApiConfig = {
  env: process.env.NEXT_PUBLIC_API_ENV || 'production',
  get baseUrl() {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      throw new Error('API_BASE_URL must be defined in environment variables');
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
};

export const getApiUrl = (endpoint: string): string => {
  return `${apiConfig.baseUrl}/${endpoint.replace(/^\//, '')}`;
};