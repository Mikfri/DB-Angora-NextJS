// src/app/api/rabbits/forsale/route.ts

import { GetRabbitsForSale } from "@/api/endpoints/rabbitController";
import { ForSaleFilters } from "@/api/types/filterTypes";
import { parseFilters } from "@/lib/utils/filterParser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    console.log("Received query params:", Object.fromEntries(url.searchParams.entries()));
    
    // Brug filterParser til at automatisk håndtere alle parametre
    const filters = parseFilters<ForSaleFilters>(url.searchParams, {
      numericFields: ['MinZipCode', 'MaxZipCode'],
      dateFields: ['BornAfter']
    });
    
    console.log("Parsed filters:", filters);
    
    const rabbits = await GetRabbitsForSale(filters);
    return NextResponse.json(rabbits);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}