// src/store/rabbitStore.ts
/**
 * Rabbit Store - Zustand state management for rabbit-relateret client-side state
 * 
 * Ansvarsområder: (WIP - Benyttes pt ikke)
 * - Gemme brugerens egne kaniner lokalt for hurtigere adgang
 * - Håndtere favorit-kaniner
 * - Gemme midlertidig kanin-state (f.eks. under oprettelse)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Rabbit_OwnedPreviewDTO } from '@/api/types/AngoraDTOs';

interface RabbitState {
  // Client-side state
  myRabbits: Rabbit_OwnedPreviewDTO[];
  favorites: string[]; // Liste af earCombIds som brugeren har markeret som favoritter
  draftRabbit: Partial<Rabbit_OwnedPreviewDTO> | null; // For at gemme ufærdig kanin-information

  // Actions
  setMyRabbits: (rabbits: Rabbit_OwnedPreviewDTO[]) => void;
  addFavorite: (earCombId: string) => void;
  removeFavorite: (earCombId: string) => void;
  isFavorite: (earCombId: string) => boolean;
  setDraftRabbit: (data: Partial<Rabbit_OwnedPreviewDTO> | null) => void;
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