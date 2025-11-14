// src/components/nav/side/client/BlogNavClient.tsx
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

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Søgeterm */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <TbFilterSearch className="text-lg text-default-500" />
          <span className="text-xs font-medium">Søgeterm</span>
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
                onPress={() => clearFilter('searchTerm')}
              >
                <IoMdClose />
              </Button>
            )}
            classNames={{
              inputWrapper: "h-7 min-h-unit-7 px-2",
              input: "text-xs"
            }}
          />
        </div>
      </div>

      {/* Kategori Filter */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <MdCategory className="text-lg text-default-500" />
          <span className="text-xs font-medium">Kategori</span>
        </div>
        <div className="flex-1">
          <EnumAutocomplete
            enumType="BlogCategories"
            value={filters.categoryFilter ?? ""}
            onChange={val => updateFilter('categoryFilter', val ?? null)}
            label="Kategori"
            placeholder={isLoading('BlogCategories') ? "Indlæser..." : "Vælg kategori"}
          />
        </div>
      </div>

      {/* Forfatter */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <MdPerson className="text-lg text-default-500" />
          <span className="text-xs font-medium">Forfatter</span>
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
                onPress={() => clearFilter('authorFullName')}
              >
                <IoMdClose />
              </Button>
            )}
            classNames={{
              inputWrapper: "h-7 min-h-unit-7 px-2",
              input: "text-xs"
            }}
          />
        </div>
      </div>

      {/* Tag Filter */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <MdTag className="text-lg text-default-500" />
          <span className="text-xs font-medium">Tag</span>
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
                onPress={() => clearFilter('tagFilter')}
              >
                <IoMdClose />
              </Button>
            )}
            classNames={{
              inputWrapper: "h-7 min-h-unit-7 px-2",
              input: "text-xs"
            }}
          />
        </div>
      </div>

      {/* Sortering */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <MdSort className="text-lg text-default-500" />
          <span className="text-xs font-medium">Sortér efter</span>
        </div>
        <div className="flex-1">
          <Select
            size="sm"
            placeholder={isLoading('BlogSortOptions') ? "Indlæser..." : "Vælg sortering..."}
            selectedKeys={filters.blogSortOption ? [filters.blogSortOption] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string | undefined;
              updateFilter('blogSortOption', selected || null);
            }}
            isDisabled={isLoading('BlogSortOptions')}
            classNames={{
              trigger: "h-7 min-h-unit-7 px-2",
              value: "text-xs"
            }}
          >
            {blogSortOptions.map((option) => (
              <SelectItem key={option}>
                {SORT_OPTION_LABELS[option] || option}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Action button */}
      <div className="pt-2">
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