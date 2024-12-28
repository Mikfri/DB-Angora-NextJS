// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')

  if (!token || isTokenExpired(token.value)) {
      // Instead of redirecting, let the client handle showing login modal
      return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export const config = {
  matcher: [
    '/rabbits/own/:path*',
    //'/rabbits/profile/:path*',
    '/rabbits/create/:path*',
    '/rabbits/for-breeding/:path*'
  ]
}

/*
Funktioner og Fordele:
- Forhindrer adgang til /rabbits/* routes uden valid token
- Automatisk redirect til login ved expired token
- Bedre UX: Ingen flash af protected content
- Sparer unødige API kald med ugyldige tokens
- Central auth check fremfor spredt i komponenter

graph TD
    A[middleware.ts] --> B[/auth/login route]
    A --> C[JWT Token i Cookie]
    B --> D[cookieLogin/route.ts]
    D --> E[AngoraDbService.ts:Login]
*/