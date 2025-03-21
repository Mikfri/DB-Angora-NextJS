// src/app/actions/rabbit/profile.ts
'use server';

import { GetRabbitProfile } from "@/api/endpoints/rabbitController";
import { getAccessToken } from "@/app/actions/auth/session";
import { Rabbit_ProfileDTO } from "@/api/types/AngoraDTOs";

type ProfileResult = 
  | { success: true; data: Rabbit_ProfileDTO }
  | { success: false; error: string; status: number };

export async function getRabbitProfile(earCombId: string): Promise<ProfileResult> {
  try {
    if (!earCombId) {
      return {
        success: false,
        error: "Missing earCombId parameter",
        status: 400
      };
    }
    
    // Brug getAccessToken i stedet for cookies
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return {
        success: false,
        error: "Authentication required",
        status: 401
      };
    }
    
    const rabbit = await GetRabbitProfile(accessToken, earCombId);
    
    if (!rabbit) {
      return {
        success: false,
        error: "Rabbit not found",
        status: 404
      };
    }
    
    return {
      success: true,
      data: rabbit
    };
  } catch (error) {
    console.error(`Error fetching rabbit profile:`, error);
    return {
      success: false,
      error: "Failed to fetch rabbit profile",
      status: 500
    };
  }
}