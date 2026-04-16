// src/api/endpoints/authController.ts
import { getApiUrl } from "../config/apiConfig";
import { LoginResponseDTO, TokenResponseDTO } from "../types/AngoraDTOs";

/**
 * Login via .NET API
 * API'en returnerer accessToken + expiresIn i JSON body
 * og sætter refreshToken som HttpOnly cookie i Set-Cookie header
 */
export async function Login(userName: string, password: string): Promise<LoginResult> {
    const response = await fetch(getApiUrl('Auth/Login'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
        credentials: 'include', // Vigtigt: inkluderer cookies fra API response
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();

    // Udtræk refreshToken fra Set-Cookie header (server-side)
    const setCookieHeader = response.headers.get('set-cookie');
    let refreshToken = '';
    if (setCookieHeader) {
        const match = setCookieHeader.match(/refreshToken=([^;]+)/);
        if (match) {
            refreshToken = match[1];
        }
    }

    return {
        ...data,
        refreshToken,  // nu typed korrekt
    };
}

/**
 * Refresh access token via .NET API
 * Sender refresh token som cookie, modtager nyt accessToken
 */
export async function RefreshAccessToken(refreshToken: string): Promise<TokenResult | null> {
    try {
        const response = await fetch(getApiUrl('Auth/Refresh'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `refreshToken=${refreshToken}`,
            },
        });

        if (!response.ok) {
            console.error('Token refresh failed:', response.status);
            return null;
        }

        const data = await response.json();

        const setCookieHeader = response.headers.get('set-cookie');
        let newRefreshToken = refreshToken; // fallback til eksisterende
        if (setCookieHeader) {
            const match = setCookieHeader.match(/refreshToken=([^;]+)/);
            if (match) newRefreshToken = match[1];
        }

        return {
            accessToken: data.accessToken,
            expiresIn: data.expiresIn ?? 900,
            refreshToken: newRefreshToken,  // nu typed korrekt
        };
    } catch (error) {
        console.error('Token refresh error:', error);
        return null;
    }
}

/**
 * Logout via .NET API - kræver Authorization header
 */
export async function Logout(accessToken: string): Promise<boolean> {
    try {
        const response = await fetch(getApiUrl('Auth/Logout'), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
}

// Lokale typer — afspejler at refresh token er udtrukket fra Set-Cookie header
type LoginResult = LoginResponseDTO & { refreshToken: string };
type TokenResult = TokenResponseDTO & { refreshToken: string };
