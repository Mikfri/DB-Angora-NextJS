// src/app/api/account/myRabbits/route.ts
import { NextResponse } from "next/server";
import { GetOwnRabbits } from '@/api/endpoints/accountController';
import { useAuthStore } from '@/store/authStore';

// Fjern request parameteren hvis den ikke bruges
export async function GET() {
  try {
    // Hent token via authStore
    const accessToken = await useAuthStore.getState().getAccessToken();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    
    // Hent alle kaniner uden filtrering (filtrering sker client-side)
    const rabbits = await GetOwnRabbits(accessToken);
    
    return NextResponse.json(rabbits);
  } catch (error) {
    console.error("Error fetching rabbits:", error);
    return NextResponse.json(
      { error: "Failed to fetch rabbits" }, 
      { status: 500 }
    );
  }
}