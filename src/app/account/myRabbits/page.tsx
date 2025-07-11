// src/app/account/myRabbits/page.tsx
'use client';

/**
 * VIGTIG NOTE OM RENDERING:
 * ========================
 * Denne side bruger bevidst Client-Side Rendering (CSR) af følgende grunde:
 * 
 * 1. Siden er beskyttet bag login, så SEO er ikke relevant
 * 2. CSR løser problemer med cookies i statisk build proces
 * 3. Siden behøver ikke server-rendering for at fungere effektivt
 * 
 * Derfor skal denne implementering IKKE ændres tilbage til SSR uden
 * at tage højde for disse komplikationer.
 */

import { useEffect, useState, useCallback } from 'react';
import { Spinner } from "@heroui/react";
import RabbitOwnList from './rabbitOwnList';
import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';
import { getMyRabbits } from '@/app/actions/rabbit/myRabbits';

export default function RabbitsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState<number | null>(null);
  const [rabbits, setRabbits] = useState<Rabbit_PreviewDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  // Gør funktionen tilgængelig for hele komponenten så den kan genbruges ved side-skift
  const loadRabbits = useCallback(async (page: number = 1) => {
    try {
      console.log(`🔄 Loading rabbits page ${page}`);
      setIsLoading(true);
      setLoadingPage(page); // Tracking which page is loading
      
      // Brug server action til at håndtere auth og data hentning med pagination
      const result = await getMyRabbits(page, pagination.pageSize);
      
      // Nu EFTER vi har result, kan vi logge det
      if (result.data) {
        console.log(`API Response for page ${page} received with ${result.data.data?.length} rabbits`);
        // Log første kanin for at verificere data
        if (result.data.data && result.data.data.length > 0) {
          console.log(`First rabbit on page ${page}:`, result.data.data[0].earCombId);
        }
      }
      
      if (!result.success) {
        setError(result.error || "Der opstod en fejl ved indlæsning af dine kaniner.");
        return;
      }
      
      // VIGTIGT: Log data som modtages til hjælp ved debugging
      console.log(`📦 Received ${result.data?.data?.length} rabbits for page ${result.data?.page}`);
      
      // Tilgå data-arrayet fra PagedResultDTO
      setRabbits(result.data?.data || []);
      
      // Gem pagination-information
      if (result.data) {
        setPagination({
          page: result.data.page,
          pageSize: result.data.pageSize,
          totalPages: result.data.totalPages,
          totalCount: result.data.totalCount,
          hasNextPage: result.data.hasNextPage,
          hasPreviousPage: result.data.hasPreviousPage
        });
        console.log(`📄 Updated pagination: Page ${result.data.page}/${result.data.totalPages}`);
      }
    } catch (err) {
      console.error("Error loading my rabbits:", err);
      setError("Der opstod en fejl ved indlæsning af dine kaniner.");
    } finally {
      setIsLoading(false);
      setLoadingPage(null);
    }
  }, [pagination.pageSize]); // Afhængig af pageSize
  
  // Kald loadRabbits når komponenten monteres
  useEffect(() => {
    loadRabbits(1);
  }, [loadRabbits]);

  // Funktion til at skifte side - brugt af vores egne knapper
  const changePage = (newPage: number) => {
    console.log(`⚡ Manually changing to page ${newPage}`);
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      loadRabbits(newPage);
    }
  };

  // Vis loading state med mere information
  if (isLoading && rabbits.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-zinc-300">Indlæser dine kaniner...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (rabbits.length === 0) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center py-16">
        <h2 className="text-2xl font-bold text-zinc-300 mb-2">
          Ingen kaniner fundet
        </h2>
        <p className="text-zinc-400">
          Du har endnu ikke registreret nogen kaniner i systemet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overlay for page loading */}
      {loadingPage !== null && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-800 rounded-lg p-6 flex flex-col items-center gap-4 shadow-xl">
            <Spinner size="lg" color="primary" />
            <p className="text-zinc-300">Indlæser side {loadingPage}...</p>
          </div>
        </div>
      )}
      
      {/* Debug info */}
      {/* <div className="bg-zinc-800/50 rounded px-4 py-2 text-xs text-zinc-400">
        <p>Nuværende side: {pagination.page}</p>
        <p>Antal kaniner: {rabbits.length}</p>
        <details>
          <summary className="cursor-pointer">Vis første kanin</summary>
          {rabbits.length > 0 && (
            <pre className="overflow-auto max-h-40 mt-2 text-[10px]">
              ID: {rabbits[0].earCombId}, Navn: {rabbits[0].nickName}
            </pre>
          )}
        </details>
      </div> */}
      
      <RabbitOwnList 
        rabbits={rabbits} 
        isPaginated={true}
        currentPage={pagination.page}
        overrideFilters={false}
      />
      
      {pagination.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          {/* Paginerings-information */}
          <p className="text-zinc-400">
            Viser side {pagination.page} af {pagination.totalPages} 
            ({pagination.totalCount} kaniner i alt)
          </p>
          
          {/* Custom navigation knapper der garanteret virker */}
          <div className="flex gap-2">
            <button
              onClick={() => changePage(1)}
              disabled={!pagination.hasPreviousPage || isLoading}
              className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50"
            >
              «
            </button>
            <button
              onClick={() => changePage(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage || isLoading}
              className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50"
            >
              ‹
            </button>
            
            {/* Vis sidenumre */}
            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(pageNum => 
                  pageNum === 1 || 
                  pageNum === pagination.totalPages || 
                  Math.abs(pageNum - pagination.page) <= 1
                )
                .map((pageNum, index, arr) => {
                  // Vis ellipsis når der er huller i sekvensen
                  const showEllipsisBefore = index > 0 && arr[index - 1] !== pageNum - 1;
                  
                  return (
                    <div key={pageNum} className="flex">
                      {showEllipsisBefore && <span className="px-3 py-1">...</span>}
                      <button
                        onClick={() => changePage(pageNum)}
                        disabled={isLoading}
                        className={`px-3 py-1 rounded min-w-[2.5rem] ${
                          pageNum === pagination.page
                            ? "bg-primary text-white"
                            : "bg-zinc-700 hover:bg-zinc-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    </div>
                  );
                })}
            </div>
            
            <button
              onClick={() => changePage(pagination.page + 1)}
              disabled={!pagination.hasNextPage || isLoading}
              className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50"
            >
              ›
            </button>
            <button
              onClick={() => changePage(pagination.totalPages)}
              disabled={!pagination.hasNextPage || isLoading}
              className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}