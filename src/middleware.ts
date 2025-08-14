// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired } from '@/utils/tokenUtils';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const tokenExpiry = request.cookies.get('tokenExpiry');

  // Brug utility function til token validering
  if (!token || isTokenExpired(token.value, tokenExpiry?.value)) {
    const returnUrl = encodeURIComponent(request.nextUrl.pathname);
    const loginUrl = new URL(`/?returnUrl=${returnUrl}`, request.url);
    const response = NextResponse.redirect(loginUrl);
    
    // Clear all auth-related cookies
    response.cookies.delete('accessToken');
    response.cookies.delete('tokenExpiry');
    response.cookies.delete('userName');
    response.cookies.delete('userRole');
    response.cookies.delete('userProfileId');
    response.cookies.delete('userIdentity');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*'  // Protects all routes under /account
  ]
}

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