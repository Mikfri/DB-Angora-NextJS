// src/store/authStore.ts
/**
 * Auth Store - TIL BRUG I CLIENT COMPONENTS
 * Håndterer bruger-autentifikation, session-styring og token caching.
 * For server components, brug getUserIdentity() fra session.ts.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginAction } from '@/app/actions/auth/login';
import { logout as logoutAction } from '@/app/actions/auth/logout';
import { getSessionStatus, getAccessToken as getTokenAction } from '@/app/actions/auth/session';
import { getTokenExpiry, getTokenTimeRemaining, hasClaim, isTokenExpired } from '@/utils/tokenUtils';
import { UserIdentity, UserRole, hasRole, hasAnyRole, roleGroups } from '@/types/authTypes';

interface TokenCache {
  lastChecked: number;
  expiresIn: number;
  accessToken: string | null;
  tokenExpiry: number | null;
}

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  userRole: string;
  userIdentity: UserIdentity | null;
  isLoading: boolean;
  tokenCache: TokenCache;
  // Rolle-hjælpefunktioner
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  isBreeder: () => boolean;
  isPremiumUser: () => boolean;
  hasClaim: (claim: string, value?: unknown) => boolean; // <-- NYT
  // Funktioner til at hente/opdatere auth status
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
      userIdentity: null,
      isLoading: true,
      tokenCache: {
        lastChecked: 0,
        expiresIn: AUTH_CACHE_DURATION,
        accessToken: null,
        tokenExpiry: null
      },

      // Rolle-hjælpefunktioner
      hasRole: (role: UserRole) => hasRole(get().userIdentity, role),
      hasAnyRole: (roles: UserRole[]) => hasAnyRole(get().userIdentity, roles),
      isAdmin: () => hasRole(get().userIdentity, 'Admin'),
      isModerator: () => get().isAdmin() || hasAnyRole(get().userIdentity, roleGroups.moderators),
      isBreeder: () => hasAnyRole(get().userIdentity, roleGroups.breeders),
      isPremiumUser: () => hasAnyRole(get().userIdentity, roleGroups.premiumUsers),
      hasClaim: (claim: string, value?: unknown) => hasClaim(get().userIdentity, claim, value),

      // Access token hentning med cache
      getAccessToken: async () => {
        try {
          const now = Date.now();
          const { lastChecked, expiresIn, accessToken, tokenExpiry } = get().tokenCache;

          // Tjek om token er udløbet
          if (accessToken && tokenExpiry && isTokenExpired(accessToken, tokenExpiry.toString())) {
            console.log('⏰ Token expired at:', new Date(tokenExpiry).toLocaleString());

            // Token er udløbet - hent et nyt
            const newToken = await getTokenAction();

            if (!newToken) {
              // Hvis vi ikke kan få et nyt token, nulstil cache
              set(state => ({
                ...state,
                tokenCache: {
                  ...state.tokenCache,
                  accessToken: null,
                  tokenExpiry: null
                }
              }));
              return null;
            }

            // Brug getTokenExpiry utility til at udtrække udløbstidspunkt
            const newExpiry = getTokenExpiry(newToken);

            set(state => ({
              ...state,
              tokenCache: {
                lastChecked: now,
                expiresIn: AUTH_CACHE_DURATION,
                accessToken: newToken,
                tokenExpiry: newExpiry
              }
            }));

            return newToken;
          }

          // Returner cached token hvis gyldig
          if (accessToken && now - lastChecked < expiresIn &&
            (!tokenExpiry || !isTokenExpired(accessToken, tokenExpiry.toString()))) {

            // Brug getTokenTimeRemaining til bedre logging
            const timeRemaining = accessToken ? getTokenTimeRemaining(accessToken) : null;
            const minutesLeft = timeRemaining ? Math.floor(timeRemaining / 60000) : '?';

            console.log(`🔑 Using cached token (expires in ~${minutesLeft} minutes)`);
            return accessToken;
          }

          console.log('🔄 Fetching fresh token');
          const newToken = await getTokenAction();

          if (!newToken) {
            // Hvis vi ikke kan få et token, nulstil cache
            set(state => ({
              ...state,
              tokenCache: {
                ...state.tokenCache,
                accessToken: null,
                tokenExpiry: null
              }
            }));
            return null;
          }

          // Brug getTokenExpiry utility til at udtrække udløbstidspunkt
          const newExpiry = getTokenExpiry(newToken);

          set(state => ({
            ...state,
            tokenCache: {
              lastChecked: now,
              expiresIn: AUTH_CACHE_DURATION,
              accessToken: newToken,
              tokenExpiry: newExpiry
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
          const { lastChecked, expiresIn, tokenExpiry } = get().tokenCache;
      
          // Brug cache hvis gyldig
          const tokenValid = tokenExpiry ? now < tokenExpiry : true;
          const cacheValid = now - lastChecked < expiresIn;
          
          if (cacheValid && tokenValid) {
            console.log('🔒 Using cached auth status (valid)');
            return get().isLoggedIn;
          }
      
          console.log('🔄 Refreshing auth status');
          set({ isLoading: true });
          
          // Brug Server Action til at tjekke session
          const session = await getSessionStatus();
      
          set({
            isLoggedIn: session.isAuthenticated,
            userName: session.userName || '',
            userRole: session.userRole || '',
            userIdentity: session.userIdentity || null,
            isLoading: false,
            tokenCache: {
              ...get().tokenCache,
              lastChecked: now,
              expiresIn: AUTH_CACHE_DURATION,
              tokenExpiry: session.tokenExpiry || null
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

          const result = await loginAction(username, password);

          if (!result.success) {
            set({ isLoading: false });
            return false;
          }

          // Efter login, opdater state med brugeridentitet
          set({
            isLoggedIn: true,
            userName: result.userName,
            userRole: result.userRole,
            userIdentity: result.userIdentity,
            isLoading: false,
            tokenCache: {
              lastChecked: Date.now(),
              expiresIn: AUTH_CACHE_DURATION,
              accessToken: null, // Nulstil accessToken så det hentes friskt næste gang
              tokenExpiry: result.tokenExpiry // Gem token udløbstidspunkt
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
              userIdentity: null,
              isLoading: false,
              tokenCache: {
                lastChecked: Date.now(),
                expiresIn: AUTH_CACHE_DURATION,
                accessToken: null,
                tokenExpiry: null
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
        userRole: state.userRole,
        userIdentity: state.userIdentity
      }),
      skipHydration: true
    }
  )
);