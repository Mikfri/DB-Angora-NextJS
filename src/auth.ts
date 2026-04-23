// src/auth.ts
/**
 * NextAuth v5 konfiguration
 * 
 * Håndterer:
 * 1. Login via Credentials provider (kalder .NET API)
 * 2. JWT session strategy med access token + refresh token
 * 3. Automatisk token refresh via JWT callback
 * 4. UserIdentity extraction fra JWT claims
 * 
 * Type augmentation: se src/types/next-auth.d.ts
 */
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { Login, RefreshAccessToken } from '@/api/endpoints/authController';
import { extractUserIdentity } from '@/utils/tokenUtils';
import type { UserIdentity } from '@/types/authTypes';
import type { JWT } from 'next-auth/jwt';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        userName: { label: 'Brugernavn', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.userName || !credentials?.password) {
          return null;
        }

        try {
          const loginResponse = await Login(
            credentials.userName as string,
            credentials.password as string
          );

          if (!loginResponse?.accessToken) {
            return null;
          }

          // Udtræk brugeridentitet fra JWT claims
          const userIdentity = extractUserIdentity(loginResponse.accessToken);
          if (!userIdentity) {
            return null;
          }

          // Brug userName fra API-response (email)
          userIdentity.username = loginResponse.userName || userIdentity.username;

          return {
            id: userIdentity.id,
            name: userIdentity.username,
            accessToken: loginResponse.accessToken,
            refreshToken: loginResponse.refreshToken,  // ← tilføj
            expiresIn: loginResponse.expiresIn,
            userIdentity,
          };
        } catch (error) {
          console.error('NextAuth authorize error:', error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
    // Session max age matcher refresh token lifetime (30 dage)
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: '/', // Redirect til forsiden (login modal)
  },

  callbacks: {
    /**
     * JWT Callback - Kører ved login, session check, og token refresh
     * Her gemmer vi access token, refresh token, og userIdentity i JWT'en
     */
    async jwt({ token, user }) {
      // Første login - gem alt fra authorize()
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          // Beregn expiry: Date.now() + (expiresIn sekunder * 1000)
          accessTokenExpires: Date.now() + (user.expiresIn * 1000),
          userIdentity: user.userIdentity,
        };
      }

      // Cast token til vores udvidede JWT type
      const t = token as JWT;

      // Token er stadig gyldigt - returner uændret
      // Giv 60 sekunders buffer for at undgå race conditions
      if (t.accessTokenExpires && Date.now() < t.accessTokenExpires - 60 * 1000) {
        return token;
      }

      // Access token er udløbet - forsøg refresh
      console.log('🔄 Access token udløbet, forsøger refresh...');
      try {
        const refreshed = await RefreshAccessToken(t.refreshToken);

        if (!refreshed) {
          console.error('❌ Token refresh fejlede');
          return { ...token, error: 'RefreshTokenError' as const };
        }

        // Udtræk ny userIdentity fra refreshed token
        const newIdentity = extractUserIdentity(refreshed.accessToken);

        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,      // ← tilføj (rotation)
          accessTokenExpires: Date.now() + (refreshed.expiresIn * 1000),
          userIdentity: newIdentity ?? t.userIdentity,
        };
      } catch (error) {
        console.error('❌ Token refresh error:', error);
        return { ...token, error: 'RefreshTokenError' as const };
      }
    },

    /**
     * Session Callback - Eksponerer JWT data til client via useSession()
     */
    async session({ session, token }) {
      const t = token as JWT;

      session.accessToken = t.accessToken;
      // session.refreshToken = t.refreshToken;  ← fjern
      session.userIdentity = t.userIdentity;
      
      if (t.error) {
        session.error = t.error;
      }

      // Sæt standard session felter
      if (t.userIdentity) {
        session.user = {
          ...session.user,
          id: t.userIdentity.id,
          name: t.userIdentity.username,
        };
      }

      return session;
    },

    /**
     * Authorized Callback - Bruges af middleware til route protection
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith('/account') || 
                                nextUrl.pathname.startsWith('/admin');

      if (isProtectedRoute && !isLoggedIn) {
        const returnUrl = encodeURIComponent(nextUrl.pathname);
        return Response.redirect(new URL(`/?returnUrl=${returnUrl}`, nextUrl));
      }

      // Hvis session har refresh error, redirect til login
      if (isProtectedRoute && auth?.error === 'RefreshTokenError') {
        const returnUrl = encodeURIComponent(nextUrl.pathname);
        return Response.redirect(new URL(`/?returnUrl=${returnUrl}`, nextUrl));
      }

      return true;
    },
  },
});
