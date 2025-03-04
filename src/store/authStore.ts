// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TokenCache {
  lastChecked: number;      // Tidspunkt for sidste check
  expiresIn: number;        // Cache udløbstid i ms
  accessToken: string | null; // Cachelagret token
}

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  userRole: string;
  isLoading: boolean;
  tokenCache: TokenCache;
  checkAuth: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>; // Ny funktion
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Hvor længe vi cacher auth status og token (i ms)
const AUTH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutter

// Hjælper til at sikre at vi håndterer fetch URLs korrekt både på server og client
const getAbsoluteUrl = (path: string) => {
  // Vi er i en browser
  if (typeof window !== 'undefined') {
    return path; // Relative path works fine in browser
  }
  
  // Vi er på serveren
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userName: '',
      userRole: '',
      isLoading: true,
      tokenCache: { 
        lastChecked: 0, 
        expiresIn: AUTH_CACHE_DURATION,
        accessToken: null 
      },

      // Access token hentning med cache
      getAccessToken: async () => {
        try {
          const now = Date.now();
          const { lastChecked, expiresIn, accessToken } = get().tokenCache;
          
          // Returner cached token hvis gyldig
          if (accessToken && now - lastChecked < expiresIn) {
            console.log('🔑 Using cached token');
            return accessToken;
          }
          
          console.log('🔄 Fetching fresh token');
          // Ellers hent nyt token - FIX: Brug absolute URL
          const response = await fetch(getAbsoluteUrl('/api/auth/token'));
          if (!response.ok) return null;
          
          const data = await response.json();
          const newToken = data.accessToken;
          
          // Cache det nye token
          set(state => ({
            ...state,
            tokenCache: { 
              lastChecked: now, 
              expiresIn: AUTH_CACHE_DURATION,
              accessToken: newToken
            }
          }));
          
          return newToken;
        } catch (error) {
          console.error('❌ Token fetch failed:', error);
          return null;
        }
      },

      checkAuth: async () => {
        try {
          const now = Date.now();
          const { lastChecked, expiresIn } = get().tokenCache;
          
          // Hvis vi har tjekket for nylig, returner den cachede værdi
          if (now - lastChecked < expiresIn) {
            console.log('🔒 Using cached auth status');
            set({ isLoading: false });
            return get().isLoggedIn;
          }

          // Ellers, sæt loading state
          set({ isLoading: true });
          
          // Og foretag et nyt kald - FIX: Brug absolute URL
          const response = await fetch(getAbsoluteUrl('/api/auth/token'), {
            method: 'HEAD',
            credentials: 'include'
          });

          const isAuthenticated = response.headers.get('X-Is-Authenticated') === 'true';
          const username = response.headers.get('X-User-Name') || '';
          const role = response.headers.get('X-User-Role') || '';
          
          // Vi sætter ikke accessToken her, da vi bruger HEAD request
          // Hvis vi skal bruge token, vil getAccessToken() hente det
          
          set({
            isLoggedIn: isAuthenticated,
            userName: username,
            userRole: role,
            isLoading: false,
            tokenCache: { 
              ...get().tokenCache,
              lastChecked: now, 
              expiresIn: AUTH_CACHE_DURATION
            }
          });

          return isAuthenticated;
        } catch (error) {
          console.error('❌ Auth check failed:', error);
          set({ isLoggedIn: false, isLoading: false });
          return false;
        }
      },

      // Eksisterende funktioner med opdateret cache handling
      login: async (username, password) => {
        try {
          set({ isLoading: true });
          
          // FIX: Brug absolute URL
          const response = await fetch(getAbsoluteUrl('/api/auth/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, password })
          });

          if (!response.ok) {
            set({ isLoading: false });
            return false;
          }

          // Efter login, invalider hele token cache
          set(state => ({
            ...state,
            tokenCache: { 
              lastChecked: 0, 
              expiresIn: AUTH_CACHE_DURATION,
              accessToken: null
            }
          }));
          
          await get().checkAuth();
          return true;
        } catch (error) {
          console.error('❌ Login failed:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          // FIX: Brug absolute URL
          const response = await fetch(getAbsoluteUrl('/api/auth/logout'), {
            method: 'POST',
            credentials: 'include'
          });

          if (response.ok) {
            set({
              isLoggedIn: false,
              userName: '',
              userRole: '',
              isLoading: false,
              tokenCache: { 
                lastChecked: Date.now(), 
                expiresIn: AUTH_CACHE_DURATION,
                accessToken: null
              }
            });
          }
        } catch (error) {
          console.error('❌ Logout failed:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userName: state.userName,
        userRole: state.userRole
      }),
      skipHydration: true
    }
  )
);