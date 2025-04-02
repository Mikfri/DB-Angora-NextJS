'use server';

import { GetRabbitsForSale } from "@/api/endpoints/rabbitController";
import { ForSaleFilters } from "@/api/types/filterTypes";
import { Rabbit_SaleDetailsPreviewDTO } from "@/api/types/AngoraDTOs";
import { cache } from 'react';

export type ForSaleParams = Record<string, string | number | null | undefined>;

export type RabbitsForSaleResult = 
  | { success: true; data: Rabbit_SaleDetailsPreviewDTO[] }
  | { success: false; error: string; status: number };

/**
 * Konverterer searchParams objekt til ForSaleFilters
 */
function parseSearchParamsToFilters(params: ForSaleParams): ForSaleFilters {
  return {
    Race: params.Race?.toString() || null,
    Color: params.Color?.toString() || null,
    Gender: params.Gender?.toString() || null,
    RightEarId: params.RightEarId?.toString() || null,
    BornAfter: params.BornAfter?.toString() || null,
    MinZipCode: params.MinZipCode ? Number(params.MinZipCode) : null,
    MaxZipCode: params.MaxZipCode ? Number(params.MaxZipCode) : null,
    //raceColorApproval: params.raceColorApproval?.toString() || null,
  };
}


// Cache the rabbits fetch function to prevent duplicate API calls
export const getRabbitsForSale = cache(async function(
  searchParams: ForSaleParams
): Promise<RabbitsForSaleResult> {
  try {
    // Performance measurement
    const startTime = performance.now();
    
    // Konverter searchParams til filters med vores egen funktion
    const filters = parseSearchParamsToFilters(searchParams);
    
    // Get data from API
    const rabbits = await GetRabbitsForSale(filters);
    
    // Log performance
    const endTime = performance.now();
    console.log(`Fetched ${rabbits.length} rabbits in ${Math.round(endTime - startTime)}ms`);
    
    return {
      success: true,
      data: rabbits
    };
  } catch (error) {
    console.error("Error fetching rabbits for sale:", error);
    return {
      success: false,
      error: "Failed to fetch rabbits for sale",
      status: 500
    };
  }
});