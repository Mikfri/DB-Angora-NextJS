// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Login } from '@/Services/AngoraDbService';

export async function POST(request: NextRequest) {
    try {
        const { userName, password } = await request.json();
        const loginResponse = await Login(userName, password);

        if (!loginResponse?.accessToken) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const response = NextResponse.json({ success: true });

        console.log('Setting userName cookie:', userName);

        response.cookies.set('accessToken', loginResponse.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        response.cookies.set('userName', userName, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        // AccessToken er encoded / krypteret med base64 
        // Henter accessToken og splitter på punktum (vi vil have anden del, hvor identity claim / userProfileId gemmer sig)
        const Base64EncodedAccessTokenFragment = loginResponse.accessToken.split('.')[1]
        // Decoder base64 med atob funktion
        const DecodedBase64AccessTokenFragment = atob(Base64EncodedAccessTokenFragment)
        // Parser AccessTokenFragment som json 
        const AccessTokenFragmentAsJSON = JSON.parse(DecodedBase64AccessTokenFragment)
        // Her kalder vi på nameidentifier for at få userProfileId 
        const userProfileId = AccessTokenFragmentAsJSON["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]

        response.cookies.set('userProfileId', userProfileId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Fejl i brugernavn eller password..'}, { status: 500 });
    }
}