// src/store/authStore.ts
/**
 * Auth Store - Kompatibilitetslag mellem next-auth og eksisterende client components
 * 
 * Denne store giver en konsistent API til client components mens vi bruger
 * next-auth under motorhjelmen. Den synkroniserer state fra next-auth session.
 * 
 * For nye components: Brug useSession() direkte fra next-auth/react
 * For server components: Brug auth() fra @/auth eller getUserIdentity() fra session.ts
 */
import { create } from 'zustand';
import { login as loginAction } from '@/app/actions/auth/login';
import { logout as logoutAction } from '@/app/actions/auth/logout';
import { UserIdentity, UserRole, hasRole, hasAnyRole, roleGroups, formatRoles } from '@/types/authTypes';
import { hasClaim } from '@/utils/tokenUtils';

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  userRole: string;
  userIdentity: UserIdentity | null;
  isLoading: boolean;
  authInitialized: boolean;
  
  // Rolle-hjælpefunktioner
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  isBreeder: () => boolean;
  isPremiumUser: () => boolean;
  hasClaim: (claim: string, value?: unknown) => boolean;
  
  // Auth funktioner
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Synkronisering med next-auth session
  syncFromSession: (session: {
    isAuthenticated: boolean;
    userName?: string;
    userIdentity?: UserIdentity | null;
  }) => void;
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    isLoggedIn: false,
    userName: '',
    userRole: '',
    userIdentity: null,
    isLoading: true,
    authInitialized: false,

    // Rolle-hjælpefunktioner
    hasRole: (role: UserRole) => hasRole(get().userIdentity, role),
    hasAnyRole: (roles: UserRole[]) => hasAnyRole(get().userIdentity, roles),
    isAdmin: () => hasRole(get().userIdentity, 'Admin'),
    isModerator: () => get().isAdmin() || hasAnyRole(get().userIdentity, roleGroups.moderators),
    isBreeder: () => hasAnyRole(get().userIdentity, roleGroups.breeders),
    isPremiumUser: () => hasAnyRole(get().userIdentity, roleGroups.premiumUsers),
    hasClaim: (claim: string, value?: unknown) => hasClaim(get().userIdentity, claim, value),

    /**
     * Synkroniser state fra next-auth session
     * Kaldes af AuthSyncProvider når session ændrer sig
     */
    syncFromSession: (session) => {
      set({
        isLoggedIn: session.isAuthenticated,
        userName: session.userName || '',
        userRole: session.userIdentity ? formatRoles(session.userIdentity.roles) : '',
        userIdentity: session.userIdentity || null,
        isLoading: false,
        authInitialized: true,
      });
    },

    // Login via Server Action (kalder next-auth signIn)
    login: async (username, password) => {
      try {
        set({ isLoading: true });

        const result = await loginAction(username, password);

        if (!result.success) {
          set({ isLoading: false });
          return false;
        }

        // State opdateres automatisk via session sync
        // Men sæt isLoading til false umiddelbart
        set({ isLoading: false });
        return true;
      } catch (error) {
        console.error('❌ Login failed:', error);
        set({ isLoading: false });
        return false;
      }
    },

    // Logout via Server Action (kalder next-auth signOut + API logout)
    logout: async () => {
      try {
        await logoutAction();

        set({
          isLoggedIn: false,
          userName: '',
          userRole: '',
          userIdentity: null,
          isLoading: false,
          authInitialized: true,
        });
      } catch (error) {
        console.error('❌ Logout failed:', error);
      }
    },
  })
);
