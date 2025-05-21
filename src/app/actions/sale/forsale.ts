'use server';

import { SaleDetailsCardList } from '@/api/types/AngoraDTOs';
import { getApiUrl } from "@/api/config/apiConfig";

// Params til forsale filtrering
export interface ForSaleParams {
  EntityType?: string;
  Race?: string;
  Color?: string; 
  Gender?: string;
  MinPrice?: number;
  MaxPrice?: number;
  MinZipCode?: number;
  MaxZipCode?: number;
  RightEarId?: string;
  BornAfter?: string;
}

// Resultat type til at bære data og status
export type ForSaleResult = 
  | { success: true; data: SaleDetailsCardList }
  | { success: false; error: string; status: number };

// Server Action til at hente salgsprodukter
export async function getItemsForSale(params?: ForSaleParams): Promise<ForSaleResult> {
  try {
    // Start med at måle performance
    const startTime = performance.now();
    
    // Brug det korrekte endpoint - Rabbit/ForSale, som vi ved virker
    let url = getApiUrl('Rabbit/ForSale');
    
    if (params) {
      const searchParams = new URLSearchParams();
      
      // Tilføj alle definerede parametre
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += '?' + queryString;
      }
    }

    console.log(`Calling API: ${url}`);
    
    const response = await fetch(url, { 
      method: 'GET',
      headers: {
        'accept': 'text/plain'
      },
      next: { revalidate: 60 } // Cache i 60 sekunder
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Log performance
    const endTime = performance.now();
    console.log(`Fetched ${data.length} items in ${Math.round(endTime - startTime)}ms`);
    
    return { 
      success: true, 
      data 
    };
  } catch (error) {
    console.error('Error fetching items for sale:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Ukendt fejl ved hentning af salgsprodukter',
      status: 500
    };
  }
}