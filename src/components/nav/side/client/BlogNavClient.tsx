// src/components/nav/side/client/BlogNavClient.tsx
'use client';

import { Button, Input } from '@heroui/react';
import { useEffect, memo } from 'react';
import { useBlogFilters } from '@/store/blogFilterStore';
import { IoMdClose } from "react-icons/io";

// Memoize component to prevent unnecessary re-renders
export const BlogNavClient = memo(function BlogNavClient() {
  // Brug Zustand store i stedet for props
  const {
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    applyFilters,
    syncFiltersWithUrl
  } = useBlogFilters();

  // Synkroniser filtre med URL ved første render - kører kun én gang
  useEffect(() => {
    syncFiltersWithUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Har filtre?
  const hasActiveFilters = Object.values(filters).some(value =>
    value !== undefined && value !== null && value !== '');

  return (
    <div className="w-full p-1 space-y-4">
      {/* Header med reset knap */}
      <div className="flex justify-between items-center">
        <h3 className="text-[13px] font-medium text-zinc-400">Filtre</h3>
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="light"
            className="h-5 text-xs text-zinc-400 hover:text-zinc-200"
            onPress={clearAllFilters}
          >
            Nulstil alle
          </Button>
        )}
      </div>

      {/* Søgeterm */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-2">Søgeterm</h3>
        <Input
          size="sm"
          placeholder="Søg i blogs..."
          value={filters.searchTerm || ''}
          onChange={(e) => updateFilter('searchTerm', e.target.value || null)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          endContent={!!filters.searchTerm && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => clearFilter('searchTerm')}
            >
              <IoMdClose />
            </Button>
          )}
        />
      </div>

      {/* Forfatter */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-2">Forfatter</h3>
        <Input
          size="sm"
          placeholder="Forfatter navn..."
          value={filters.authorFullName || ''}
          onChange={(e) => updateFilter('authorFullName', e.target.value || null)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          endContent={!!filters.authorFullName && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => clearFilter('authorFullName')}
            >
              <IoMdClose />
            </Button>
          )}
        />
      </div>

      {/* Tag Filter */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-2">Tag Filter</h3>
        <Input
          size="sm"
          placeholder="Tag (fx Avl, Pasning)..."
          value={filters.tagFilter || ''}
          onChange={(e) => updateFilter('tagFilter', e.target.value || null)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          endContent={!!filters.tagFilter && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => clearFilter('tagFilter')}
            >
              <IoMdClose />
            </Button>
          )}
        />
      </div>

      {/* Action button */}
      <div className="pt-2 border-t border-zinc-700">
        <Button
          size="sm"
          variant="solid"
          color="primary"
          className="w-full"
          onPress={applyFilters}
        >
          Anvend filtre
        </Button>
      </div>
    </div>
  );
});

export default BlogNavClient;