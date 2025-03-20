// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginAction } from '@/app/actions/auth/login';
import { logout as logoutAction } from '@/app/actions/auth/logout';
import { getSessionStatus, getAccessToken as getTokenAction } from '@/app/actions/auth/session';

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
  getAccessToken: () => Promise<string | null>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Hvor længe vi cacher auth status og token (i ms)
const AUTH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutter

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
          // Brug Server Action i stedet for fetch
          const newToken = await getTokenAction();

          if (!newToken) return null;

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

          // Brug Server Action i stedet for fetch
          const session = await getSessionStatus();

          set({
            isLoggedIn: session.isAuthenticated,
            userName: session.userName || '',
            userRole: session.userRole || '',
            isLoading: false,
            tokenCache: {
              ...get().tokenCache,
              lastChecked: now,
              expiresIn: AUTH_CACHE_DURATION
            }
          });

          return session.isAuthenticated;
        } catch (error) {
          console.error('❌ Auth check failed:', error);
          set({ isLoggedIn: false, isLoading: false });
          return false;
        }
      },

      // Login med Server Action
      login: async (username, password) => {
        try {
          set({ isLoading: true });

          // Brug Server Action i stedet for fetch
          const result = await loginAction(username, password);

          if (!result.success) {
            set({ isLoading: false });
            return false;
          }

          // Efter login, invalider hele token cache
          set({
            isLoggedIn: true,
            userName: result.userName,
            userRole: result.userRole,
            isLoading: false,
            tokenCache: {
              lastChecked: Date.now(),
              expiresIn: AUTH_CACHE_DURATION,
              accessToken: null // Nulstil accessToken så det hentes friskt næste gang
            }
          });

          return true;
        } catch (error) {
          console.error('❌ Login failed:', error);
          set({ isLoading: false });
          return false;
        }
      },

      // Logout med Server Action
      logout: async () => {
        try {
          const result = await logoutAction();

          if (result.success) {
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

            // Redirect til forsiden
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
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