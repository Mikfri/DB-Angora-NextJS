// src/store/rabbitStore.ts
/**
 * Rabbit Store - Zustand state management for rabbit-relateret client-side state
 * 
 * Ansvarsområder:
 * - Gemme brugerens egne kaniner lokalt for hurtigere adgang
 * - Håndtere favorit-kaniner
 * - Gemme midlertidig kanin-state (f.eks. under oprettelse)
 * 
 * Dette adskiller sig fra SWR ved at:
 * - SWR håndterer server-data fetching og caching
 * - Zustand håndterer client-side state som ikke direkte kommer fra serveren
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';

interface RabbitState {
  // Client-side state
  myRabbits: Rabbit_PreviewDTO[];
  favorites: string[]; // Liste af earCombIds som brugeren har markeret som favoritter
  draftRabbit: Partial<Rabbit_PreviewDTO> | null; // For at gemme ufærdig kanin-information

  // Actions
  setMyRabbits: (rabbits: Rabbit_PreviewDTO[]) => void;
  addFavorite: (earCombId: string) => void;
  removeFavorite: (earCombId: string) => void;
  isFavorite: (earCombId: string) => boolean;
  setDraftRabbit: (data: Partial<Rabbit_PreviewDTO> | null) => void;
}

export const useRabbitStore = create<RabbitState>()(
  persist(
    (set, get) => ({
      myRabbits: [],
      favorites: [],
      draftRabbit: null,
      
      setMyRabbits: (rabbits) => set({ myRabbits: rabbits }),
      
      addFavorite: (earCombId) => set((state) => ({
        favorites: [...state.favorites, earCombId]
      })),
      
      removeFavorite: (earCombId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== earCombId)
      })),
      
      isFavorite: (earCombId) => {
        return get().favorites.includes(earCombId);
      },

      setDraftRabbit: (data) => set({ draftRabbit: data })
    }),
    {
      name: 'rabbit-storage', // Navn til localStorage
      partialize: (state) => ({
        // Kun gem disse værdier i localStorage
        favorites: state.favorites,
        // Vi gemmer ikke myRabbits eller draftRabbit i localStorage
      })
    }
  )
);