// src/app/api/auth/token/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function HEAD() {  // Denne del er til for at kunne vise om man er logged in
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const userName = cookieStore.get('userName');
    const userRole = cookieStore.get('userRole');

    
    const response = NextResponse.json({});
    response.headers.set('X-Is-Authenticated', accessToken ? 'true' : 'false');
    response.headers.set('X-User-Name', userName ? userName.value : '');
    response.headers.set('X-User-Role', userRole ? userRole.value : '');
    
    return response;
}

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
        return NextResponse.json(
            { error: 'No access token found' }, 
            { status: 401 }
        );
    }

    return NextResponse.json({ accessToken: accessToken.value });
}

/*
WHY THIS FILE IS NEEDED:
1. Auth Status Check:
   - HEAD request returnerer altid 200 med X-Is-Authenticated header
   - Bruges til UI state (vis/skjul login knap, beskyttede routes)
   - Undgår unødvendige 401 fejl i konsollen

2. Token Access:
   - GET request til actual token hentning
   - Returnerer 401 hvis ingen token
   - Bruges når vi skal lave authenticated API kald

3. Flow:
   - UI checker auth status via HEAD
   - Protected routes henter token via GET
   - Sikker håndtering af HttpOnly cookies

4. Security:
   - HEAD afslører kun login status, ikke token
   - GET beskytter token bag 401
   - Adskiller auth check fra token access
*/