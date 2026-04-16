// src/middleware.ts
/**
 * Next-Auth v5 Middleware
 * 
 * Bruger next-auth's auth() som middleware til route protection.
 * authorized() callback i auth.ts håndterer logikken.
 * 
 * Beskytter:
 * - /account/* routes
 * - /admin/* routes
 */

export { auth as middleware } from '@/auth';

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
  ]
};

/*
Funktioner og Fordele:
- Forhindrer adgang til /account/* routes uden valid token
- To-lags validering af token udløb (cookie og JWT payload)
- Automatisk redirect til login ved expired token
- Bedre UX: Ingen flash af protected content
- Sparer unødige API kald med ugyldige tokens
- Central auth check fremfor spredt i komponenter
- Konsistent med server-side og client-side token validering
*/
