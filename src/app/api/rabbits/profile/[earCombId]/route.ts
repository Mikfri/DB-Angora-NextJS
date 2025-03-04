// src/app/api/rabbits/profile/[earCombId]/route.ts
import { GetRabbitProfile } from "@/api/endpoints/rabbitController";
import { useAuthStore } from '@/store/authStore';
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { earCombId: string } }
) {
  try {
    const { earCombId } = params;
    
    if (!earCombId) {
      return NextResponse.json(
        { error: "Missing earCombId parameter" }, 
        { status: 400 }
      );
    }
    
    // Brug authStore direkte
    const accessToken = await useAuthStore.getState().getAccessToken();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const rabbit = await GetRabbitProfile(accessToken, earCombId);
    
    if (!rabbit) {
      return NextResponse.json(
        { error: "Rabbit not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(rabbit);
  } catch (error) {
    console.error(`Error fetching rabbit profile (${params.earCombId}):`, error);
    return NextResponse.json(
      { error: "Failed to fetch rabbit profile" }, 
      { status: 500 }
    );
  }
}