// src/utils/cookieStore.ts
import { cookies } from 'next/headers';

// Definer typen for cookie options separat så den kan genbruges
type CookieOptions = {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
};

interface AsyncCookieStore {
  get: (name: string) => Promise<{ name: string; value: string } | undefined>;
  getAll: () => Promise<Array<{ name: string; value: string }>>;
  set: (
    name: string,
    value: string,
    options?: CookieOptions
  ) => Promise<void>;
  delete: (name: string) => Promise<void>;
}

/**
 * Returnerer en asynkron typesikker cookie store til brug i Server Actions
 */
export function getCookieStore(): AsyncCookieStore {
  return {
    get: async (name: string) => {
      const cookieStore = await cookies();
      return cookieStore.get(name);
    },
    getAll: async () => {
      const cookieStore = await cookies();
      return cookieStore.getAll();
    },
    set: async (name: string, value: string, options?: CookieOptions) => {
      const cookieStore = await cookies();
      cookieStore.set(name, value, options);
    },
    delete: async (name: string) => {
      const cookieStore = await cookies();
      cookieStore.delete(name);
    }
  };
}