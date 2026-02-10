// src/components/nav/side/BlogNavClient.tsx
'use client';

import { Button, Input, Select, SelectItem, Divider } from '@heroui/react';
import { useEffect, memo, useState } from 'react';
import { useBlogFilters } from '@/store/blogFilterStore';
import { useEnums } from '@/contexts/EnumContext';
import { IoMdClose } from "react-icons/io";
import { MdCategory, MdPerson, MdTag, MdSort } from "react-icons/md";
import { TbFilterSearch } from "react-icons/tb";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';

// Mapper sorteringsmuligheder til brugervenlige labels
const SORT_OPTION_LABELS: Record<string, string> = {
  'Newest': 'Nyeste først',
  'Oldest': 'Ældste først',
  'MostViewed': 'Mest læste',
};

// Memoize component to prevent unnecessary re-renders
export const BlogNavClient = memo(function BlogNavClient() {
  const { getEnumValues, isLoading } = useEnums();
  const [blogSortOptions, setBlogSortOptions] = useState<string[]>([]);

  // Brug Zustand store i stedet for props
  const {
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    applyFilters,
    syncFiltersWithUrl
  } = useBlogFilters();

  // Hent enums ved mount
  useEffect(() => {
    getEnumValues('BlogSortOptions')
      .then(setBlogSortOptions)
      .catch(() => setBlogSortOptions([]));
  }, [getEnumValues]);

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
        <h3 className="text-label">Filtre</h3>
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="light"
            className="h-5 text-xs text-muted hover:text-foreground"
            onPress={() => {
              clearAllFilters();
              applyFilters();
            }}
          >
            Nulstil alle
          </Button>
        )}
      </div>

      <Divider className="divider my-0.5" />

      {/* Søgeterm */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <TbFilterSearch className="text-lg text-muted" />
          <span className="text-label">Søgeterm</span>
        </div>
        <div className="flex-1 flex items-center gap-1">
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
                className="text-muted"
                onPress={() => clearFilter('searchTerm')}
              >
                <IoMdClose />
              </Button>
            )}
            classNames={{
              inputWrapper: "h-7 min-h-unit-7 px-2",
              input: "text-xs text-body"
            }}
          />
        </div>
      </div>

      {/* Kategori Filter */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <MdCategory className="text-lg text-muted" />
          <span className="text-label">Kategori</span>
        </div>
        <div className="flex-1">
          <EnumAutocomplete
            enumType="BlogCategories"
            value={filters.categoryFilter ?? ""}
            onChange={val => {
              updateFilter('categoryFilter', val ?? null);
              applyFilters({ categoryFilter: val ?? null });
            }}
            label="Kategori"
            placeholder={isLoading('BlogCategories') ? "Indlæser..." : "Vælg kategori"}
          />
        </div>
      </div>

      {/* Forfatter */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <MdPerson className="text-lg text-muted" />
          <span className="text-label">Forfatter</span>
        </div>
        <div className="flex-1 flex items-center gap-1">
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
                className="text-muted"
                onPress={() => clearFilter('authorFullName')}
              >
                <IoMdClose />
              </Button>
            )}
            classNames={{
              inputWrapper: "h-7 min-h-unit-7 px-2",
              input: "text-xs text-body"
            }}
          />
        </div>
      </div>

      {/* Tag Filter */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <MdTag className="text-lg text-muted" />
          <span className="text-label">Tag</span>
        </div>
        <div className="flex-1 flex items-center gap-1">
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
                className="text-muted"
                onPress={() => clearFilter('tagFilter')}
              >
                <IoMdClose />
              </Button>
            )}
            classNames={{
              inputWrapper: "h-7 min-h-unit-7 px-2",
              input: "text-xs text-body"
            }}
          />
        </div>
      </div>

      {/* Sortering */}
      {/* <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <MdSort className="text-lg text-muted" />
          <span className="text-label">Sortér efter</span>
        </div>
        <div className="flex-1">
          <Select
            size="sm"
            //isClearable  // 👈 Tilføj denne for at få clear-knap // virker ikke!
            placeholder={isLoading('BlogSortOptions') ? "Indlæser..." : "Vælg sortering..."}
            selectedKeys={filters.blogSortOption ? [filters.blogSortOption] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string | undefined;
              updateFilter('blogSortOption', selected || null);
              applyFilters({ blogSortOption: selected || null });
            }}
          >
            {blogSortOptions.map((option) => (
              <SelectItem key={option}>
                {SORT_OPTION_LABELS[option] || option}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div> */}

      <Divider className="divider my-0.5" />

      {/* Action button - FJERN DENNE SEKTION */}
      {/* Dropdowns søger nu automatisk, så knappen er ikke længere nødvendig */}
      {/* Tekstfelter søger stadig ved Enter */}
    </div>
  );
});

export default BlogNavClient;