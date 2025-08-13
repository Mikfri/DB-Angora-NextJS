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

import { useEffect } from 'react';
import { Spinner } from "@heroui/react";
import RabbitOwnList from './rabbitOwnList';
import { useRabbitsOwnedStore } from '@/store/rabbitsOwnedStore';

export default function RabbitsPage() {
  // Hent tilstand og handlinger direkte fra store
  const {
    rabbits,
    isLoading,
    error,
    pagination,
    fetchRabbits,
    changePage
  } = useRabbitsOwnedStore();
  
  // Indlæs data ved komponentens montering
  useEffect(() => {
    fetchRabbits(1);
  }, [fetchRabbits]);

  // Vis loading state
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
      {isLoading && rabbits.length > 0 && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-800 rounded-lg p-6 flex flex-col items-center gap-4 shadow-xl">
            <Spinner size="lg" color="primary" />
            <p className="text-zinc-300">Indlæser side {pagination.page}...</p>
          </div>
        </div>
      )}
      
      <RabbitOwnList />
      
      {pagination.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          {/* Paginerings-information */}
          <p className="text-zinc-400">
            Viser side {pagination.page} af {pagination.totalPages} 
            ({pagination.totalCount} kaniner i alt)
          </p>
          
          {/* Custom navigation knapper */}
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