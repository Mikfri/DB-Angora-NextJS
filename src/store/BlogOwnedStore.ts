// src/store/BlogOwnedStore.ts
// NY VERSION: Henter ALLE brugerens blogs én gang (loop over sider) og filtrerer derefter KUN client-side (CSR)

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { fetchBlogsAuthoredByUserAction } from '@/app/actions/blog/blogActions';
import type { BlogCardPreviewDTO } from '@/api/types/AngoraDTOs';

interface BlogOwnedFilters {
  search: string;
  isPublished: boolean | null;
  visibilityLevel: string | null;
  category: string | null;              // TILFØJET: Client-side filter
  createdAfter: string | null;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface BlogOwnedStoreState {
  userId: string | null;

  allBlogs: BlogCardPreviewDTO[];       // RAW (u-filtreret) data fra API
  blogs: BlogCardPreviewDTO[];          // Aktuel “page slice” efter client filtering + pagination
  filteredBlogs: BlogCardPreviewDTO[];  // Hele den filtrerede mængde (uden slice)

  loading: boolean;
  error: string | null;

  filters: BlogOwnedFilters;
  pagination: PaginationState;

  isAnyFilterActive: boolean;
  blogsCount: number;          // Antal efter filter

  initialized: boolean;        // Har vi allerede hentet alle blogs?

  // Actions
  setUserId: (id: string) => Promise<void>;
  reloadAll: () => Promise<void>;   // Force re-fetch
  updateFilters: (partial: Partial<BlogOwnedFilters>) => void;
  resetFilters: () => void;

  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Intern helpers
  applyFilters: () => void;
  recomputePageSlice: () => void;
}

const DEFAULT_FILTERS: BlogOwnedFilters = {
  search: '',
  isPublished: null,
  visibilityLevel: null,
  category: null,                        // TILFØJET
  createdAfter: null
};

const DEFAULT_PAGINATION: PaginationState = {
  page: 1,
  pageSize: 12,
  totalItems: 0,
  totalPages: 0
};

export const useBlogOwnedStore = create<BlogOwnedStoreState>()(
  devtools(
    (set, get) => ({
      userId: null,

      allBlogs: [],
      blogs: [],
      filteredBlogs: [],

      loading: false,
      error: null,

      filters: { ...DEFAULT_FILTERS },
      pagination: { ...DEFAULT_PAGINATION },

      isAnyFilterActive: false,
      blogsCount: 0,

      initialized: false,

      // Sæt userId og hent alle blogs første gang
      setUserId: async (id: string) => {
        if (!id || id === get().userId) return;
        set({
          userId: id,
          initialized: false,
          allBlogs: [],
          filteredBlogs: [],
          blogs: [],
          pagination: { ...DEFAULT_PAGINATION }
        });
        await get().reloadAll();
      },

      // Tving re-fetch af ALLE blogs (loop over sider indtil hasNextPage = false)
      reloadAll: async () => {
        const { userId } = get();
        if (!userId) return;

        set({ loading: true, error: null });

        try {
            const result = await fetchBlogsAuthoredByUserAction(userId);

            if (!result.success) {
                set({
                    loading: false,
                    error: result.error || 'Kunne ikke hente blogs',
                    initialized: true
                });
                return;
            }

            set({
                allBlogs: result.data, // Nu direkte array
                initialized: true,
                loading: false,
                error: null
            });

            get().applyFilters();

        } catch (e) {
            set({
                loading: false,
                error: e instanceof Error ? e.message : 'Uventet fejl',
                initialized: true
            });
        }
      },

      updateFilters: (partial) => {
        const newFilters = { ...get().filters, ...partial };
        set({
            filters: newFilters,
            // Reset til side 1 ved filterændring
            pagination: { ...get().pagination, page: 1 },
            isAnyFilterActive: computeIsAnyFilterActive(newFilters)
        });
        get().applyFilters();
      },

      resetFilters: () => {
        set({
          filters: { ...DEFAULT_FILTERS },
          pagination: { ...get().pagination, page: 1 },
          isAnyFilterActive: false
        });
        get().applyFilters();
      },

      setPage: (page) => {
        set({ pagination: { ...get().pagination, page } });
        get().recomputePageSlice();
      },

      setPageSize: (size) => {
        set({
          pagination: { ...get().pagination, pageSize: size, page: 1 }
        });
        get().recomputePageSlice();
      },

      // Anvend klient-filtre på allBlogs
      applyFilters: () => {
        const { allBlogs, filters, pagination } = get();
        const { search, isPublished, visibilityLevel, category, createdAfter } = filters;

        let filtered = allBlogs.slice();

        if (isPublished !== null) {
          filtered = filtered.filter(b => b.isPublished === isPublished);
        }

        if (visibilityLevel) {
          filtered = filtered.filter(b => b.visibilityLevel === visibilityLevel);
        }

        // TILFØJET: Filtrer på kategori
        if (category) {
          filtered = filtered.filter(b => b.blogCategory === category);
        }

        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(b =>
            (b.title && b.title.toLowerCase().includes(s)) ||
            (b.subtitle && b.subtitle.toLowerCase().includes(s)) ||
            (b.contentSummary && b.contentSummary.toLowerCase().includes(s))
          );
        }

        if (createdAfter) {
          const cmp = new Date(createdAfter);
          filtered = filtered.filter(b => {
            if (!b.publishDate) return false;
            const pd = new Date(b.publishDate);
            return pd >= cmp;
          });
        }

        // (Optional) Sortér – fx nyeste først (behold hvis ønsket)
        filtered.sort((a, b) => {
          const da = a.publishDate ? new Date(a.publishDate).getTime() : 0;
          const db = b.publishDate ? new Date(b.publishDate).getTime() : 0;
          return db - da;
        });

        const totalItems = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / pagination.pageSize));

        set({
          filteredBlogs: filtered,
          blogsCount: totalItems,
          pagination: {
            ...pagination,
            totalItems,
            totalPages,
            page: Math.min(pagination.page, totalPages)
          }
        });

        get().recomputePageSlice();
      },

      // Udregn slice for nuværende page
      recomputePageSlice: () => {
        const { filteredBlogs, pagination } = get();
        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        set({
          blogs: filteredBlogs.slice(start, end)
        });
      }
    }),
    { name: 'BlogOwnedStore' }
  )
);

// Helper - TILFØJET category check
function computeIsAnyFilterActive(f: BlogOwnedFilters): boolean {
  return Boolean(
    f.search ||
    f.isPublished !== null ||
    f.visibilityLevel ||
    f.category ||                        // TILFØJET
    f.createdAfter
  );
}