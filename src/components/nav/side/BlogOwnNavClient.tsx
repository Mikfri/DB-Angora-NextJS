// src/components/nav/side/BlogOwnNavClient.tsx
'use client';

import { useState, useCallback, useEffect, useTransition } from 'react';
import { Input, Button, Separator, Tooltip, Chip } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { useBlogOwnedStore } from '@/store/BlogOwnedStore';
import { createBlogAction } from "@/app/actions/blog/blogActions";
import { useEnums } from '@/contexts/EnumContext';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';

import {
  RiAddCircleLine,
  RiSearchLine,
  RiCloseLine,
  RiEyeLine,
  RiEyeOffLine
} from 'react-icons/ri';
import { TbFilterSearch } from 'react-icons/tb';
import { MdCalendarMonth } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';
import { FaCoins } from 'react-icons/fa';
import { HiOutlineSelector } from 'react-icons/hi';

const SECTION = {
  ACTIONS: 'Handlinger',
  FILTERS: 'Filtre',
  PUBLISHING: 'Publicering',
  VISIBILITY: 'Synlighed'
} as const;

export function BlogOwnNavClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { isLoading } = useEnums();

  const {
    filters,
    updateFilters,
    isAnyFilterActive,
    blogsCount,
    loading
  } = useBlogOwnedStore();

  // Lokal søge-udkast (manuel anvend)
  const [searchDraft, setSearchDraft] = useState(filters.search);

  useEffect(() => {
    setSearchDraft(filters.search);
  }, [filters.search]);

  const applySearch = useCallback(() => {
    if (searchDraft !== filters.search) {
      updateFilters({ search: searchDraft });
    }
  }, [searchDraft, filters.search, updateFilters]);

  const clearSearch = useCallback(() => {
    setSearchDraft('');
    if (filters.search !== '') updateFilters({ search: '' });
  }, [filters.search, updateFilters]);

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') applySearch();
    if (e.key === 'Escape') clearSearch();
  };

  const setPublishedFilter = (val: boolean | null) => updateFilters({ isPublished: val });
  const setVisibility = (val: string | null) => updateFilters({ visibilityLevel: val });

  const hasDate = Boolean(filters.createdAfter);

  const handleCreateBlog = () => {
    startTransition(async () => {
      const result = await createBlogAction({});
      if (result.success) {
        router.push(`/account/myBlogs/blogWorkspace/${result.data.id}`);
      } else {
        alert(result.error || "Kunne ikke oprette blog.");
      }
    });
  };

  return (
    <div className="w-full p-1 space-y-2">
      {/* Handlinger */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTION.ACTIONS}</h3>
        <Button
          variant="ghost"
          fullWidth
          size="sm"
          className="justify-start"
          onPress={handleCreateBlog}
          isPending={isPending}
        >
          <RiAddCircleLine className="text-lg" />
          Ny blog-kladde
        </Button>
      </div>

      <Separator className="bg-zinc-200/5 my-0.5" />

      {/* Søg + dato */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTION.FILTERS}</h3>

        {/* Søg */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1.5 min-w-[68px]">
            <TbFilterSearch className="text-lg text-foreground/70" />
            <span className="text-xs font-medium">Søg</span>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <Input
              placeholder="Titel, undertitel, indhold"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={onSearchKey}
            />
            {searchDraft && (
              <Button
                size="sm"
                variant="ghost"
                isIconOnly
                aria-label="Ryd søgning"
                onPress={clearSearch}
              >
                <RiCloseLine className="text-sm" />
              </Button>
            )}
            <Button
              size="sm"
              variant={searchDraft === filters.search ? "secondary" : "primary"}
              isIconOnly
              aria-label="Udfør søgning"
              onPress={applySearch}
              isDisabled={loading || searchDraft === filters.search}
            >
              <RiSearchLine className="text-sm" />
            </Button>
          </div>
        </div>

        {/* Oprettet efter */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center gap-1.5 min-w-[68px]">
            <MdCalendarMonth className="text-lg text-foreground/70" />
            <span className="text-xs font-medium">Efter</span>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <Input
              type="date"
              value={filters.createdAfter || ''}
              onChange={(e) => updateFilters({ createdAfter: e.target.value || null })}
            />
            {hasDate && (
              <Button
                size="sm"
                variant="ghost"
                isIconOnly
                aria-label="Ryd dato"
                onPress={() => updateFilters({ createdAfter: null })}
              >
                <RiCloseLine className="text-sm" />
              </Button>
            )}
          </div>
        </div>

        {/* Kategori filter */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center gap-1.5 min-w-[68px]">
            <MdCalendarMonth className="text-lg text-foreground/70" />
            <span className="text-xs font-medium">Kategori</span>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <EnumAutocomplete
              enumType="BlogCategories"
              value={filters.category}
              onChange={val => updateFilters({ category: val })}
              label="Kategori"
              placeholder={isLoading('BlogCategories') ? "Indlæser..." : "Vælg kategori"}
            />
          </div>
        </div>
      </div>

      <Separator className="bg-zinc-200/5 my-0.5" />

      {/* Publicering */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTION.PUBLISHING}</h3>
        <div className="flex gap-2">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                size="sm"
                variant={filters.isPublished === null ? "primary" : "secondary"}
                onPress={() => setPublishedFilter(null)}
                isIconOnly
                aria-label="Alle"
              >
                <HiOutlineSelector className="text-base" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Alle</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                size="sm"
                variant={filters.isPublished === true ? "primary" : "secondary"}
                onPress={() => setPublishedFilter(true)}
                isIconOnly
                aria-label="Publicerede"
              >
                <RiEyeLine className="text-base" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Publicerede</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                size="sm"
                variant={filters.isPublished === false ? "primary" : "secondary"}
                onPress={() => setPublishedFilter(false)}
                isIconOnly
                aria-label="Kladder"
              >
                <RiEyeOffLine className="text-base" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Kladder</Tooltip.Content>
          </Tooltip.Root>
        </div>
      </div>

      <Separator className="bg-zinc-200/5 my-0.5" />

      {/* Synlighed */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTION.VISIBILITY}</h3>
        <div className="flex gap-2">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                size="sm"
                variant={filters.visibilityLevel === null ? "primary" : "secondary"}
                onPress={() => setVisibility(null)}
                isIconOnly
                aria-label="Alle synligheder"
              >
                <HiOutlineSelector className="text-base" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Alle</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                size="sm"
                variant={filters.visibilityLevel === 'Public' ? "primary" : "secondary"}
                onPress={() => setVisibility('Public')}
                isIconOnly
                aria-label="Offentlig"
              >
                <BiWorld className="text-base" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Offentlig</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                size="sm"
                variant={filters.visibilityLevel === 'PaidContent' ? "primary" : "secondary"}
                onPress={() => setVisibility('PaidContent')}
                isIconOnly
                aria-label="Betalt indhold"
              >
                <FaCoins className="text-sm" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Betalt indhold</Tooltip.Content>
          </Tooltip.Root>
        </div>
      </div>

      {isAnyFilterActive && (
        <div className="text-center mt-2">
          <Chip size="sm" variant="soft">
            {blogsCount} fundet
          </Chip>
        </div>
      )}
    </div>
  );
}
