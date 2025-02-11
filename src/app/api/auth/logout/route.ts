// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json(
        { success: true },
        { status: 200 }
    );
    
    // Slet alle auth-relaterede cookies
    response.cookies.delete('accessToken');
    response.cookies.delete('userName');
    response.cookies.delete('userRole');
    response.cookies.delete('userProfileId');
    
    return response;
}