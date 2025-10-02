// src/store/BlogOwnedStore.ts
import { create } from 'zustand';
import { Blog_CardDTO } from '@/api/types/AngoraDTOs';
import { fetchBlogsAuthoredByUserAction } from '@/app/actions/blog/blogActions';
import { useAuthStore } from './authStore';

interface BlogFilters {
  search: string;
  isPublished: boolean | null;
  createdAfter: string | null;
}

interface BlogOwnedStore {
  blogs: Blog_CardDTO[];
  filters: BlogFilters;
  isAnyFilterActive: boolean;
  blogsCount: number;
  isLoading: boolean;
  error: string | null;
  fetchBlogs: () => Promise<void>;
  updateFilters: (newFilters: Partial<BlogFilters>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: BlogFilters = {
  search: '',
  isPublished: null,
  createdAfter: null,
};

const filterBlogs = (blogs: Blog_CardDTO[], filters: BlogFilters): Blog_CardDTO[] => {
  return blogs.filter(blog => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch = !searchLower || 
      blog.title?.toLowerCase().includes(searchLower) || 
      blog.subtitle?.toLowerCase().includes(searchLower);
    
    // Brug publishDate som proxy for isPublished: hvis publishDate er sat, er bloggen publiceret
    const isPublished = blog.publishDate !== null;
    const matchesPublished = filters.isPublished === null || isPublished === filters.isPublished;
    
    // Brug publishDate som proxy for createdAt (da Blog_CardDTO ikke har createdAt)
    const matchesCreatedAfter = !filters.createdAfter || 
      (blog.publishDate && new Date(blog.publishDate) >= new Date(filters.createdAfter!));
    
    return matchesSearch && matchesPublished && matchesCreatedAfter;
  });
};

export const useBlogOwnedStore = create<BlogOwnedStore>((set, get) => ({
  blogs: [],
  filters: DEFAULT_FILTERS,
  isAnyFilterActive: false,
  blogsCount: 0,
  isLoading: false,
  error: null,

  fetchBlogs: async () => {
    const userId = useAuthStore.getState().userIdentity?.id;
    if (!userId) {
      set({ error: 'Bruger-ID mangler' });
      return;
    }
    set({ isLoading: true, error: null });
    const result = await fetchBlogsAuthoredByUserAction(userId, undefined, 1, 100);
    if (result.success) {
      const filtered = filterBlogs(result.data.data, get().filters);
      set({ 
        blogs: result.data.data, 
        blogsCount: filtered.length, 
        isLoading: false 
      });
    } else {
      set({ error: result.error, isLoading: false });
    }
  },

  updateFilters: (newFilters) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filtered = filterBlogs(state.blogs, updatedFilters);
      const isActive = updatedFilters.search !== '' || updatedFilters.isPublished !== null || updatedFilters.createdAfter !== null;
      return {
        filters: updatedFilters,
        blogsCount: filtered.length,
        isAnyFilterActive: isActive,
      };
    });
  },

  resetFilters: () => {
    const currentState = get();
    return {
      filters: DEFAULT_FILTERS,
      blogsCount: currentState.blogs.length,
      isAnyFilterActive: false,
    };
  },
}));