// src/components/nav/side/client/BlogOwnNavClient.tsx

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Input, Button, Divider, Tooltip, Chip } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { useBlogOwnedStore } from '@/store/BlogOwnedStore';
import { ROUTES } from "@/constants/navigationConstants";

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

  return (
    <div className="w-full p-1 space-y-2">
      {/* Handlinger */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTION.ACTIONS}</h3>
        <Button
          color="primary"
          variant="ghost"
          fullWidth
          size="sm"
          className="justify-start"
          startContent={<RiAddCircleLine className="text-lg" />}
          onPress={() => router.push(ROUTES.ACCOUNT.CREATE_BLOG)}
        >
          Opret ny blog
        </Button>
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Søg + dato */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTION.FILTERS}</h3>

        {/* Søg */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1.5 min-w-[68px]">
            <TbFilterSearch className="text-lg text-default-500" />
            <span className="text-xs font-medium">Søg</span>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <Input
              size="sm"
              placeholder="Titel, undertitel, indhold"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={onSearchKey}
              classNames={{
                inputWrapper: "h-7 min-h-unit-7 px-2",
                input: "text-xs"
              }}
            />
            {searchDraft && (
              <Button
                size="sm"
                variant="light"
                isIconOnly
                aria-label="Ryd søgning"
                onPress={clearSearch}
              >
                <RiCloseLine className="text-sm" />
              </Button>
            )}
            <Button
              size="sm"
              color="primary"
              variant={searchDraft === filters.search ? "flat" : "solid"}
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
              <MdCalendarMonth className="text-lg text-default-500" />
              <span className="text-xs font-medium">Efter</span>
            </div>
            <div className="flex-1 flex items-center gap-1">
              <Input
                size="sm"
                type="date"
                value={filters.createdAfter || ''}
                onChange={(e) => updateFilters({ createdAfter: e.target.value || null })}
                classNames={{
                  inputWrapper: "h-7 min-h-unit-7 px-2",
                  input: "text-xs"
                }}
              />
              {hasDate && (
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  aria-label="Ryd dato"
                  onPress={() => updateFilters({ createdAfter: null })}
                >
                  <RiCloseLine className="text-sm" />
                </Button>
              )}
            </div>
        </div>
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Publicering */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTION.PUBLISHING}</h3>
        <div className="flex gap-2">
          <Tooltip content="Alle" className="dark" showArrow placement="bottom">
            <Button
              size="sm"
              variant={filters.isPublished === null ? "solid" : "flat"}
              color={filters.isPublished === null ? "primary" : "default"}
              onPress={() => setPublishedFilter(null)}
              isIconOnly
              aria-label="Alle"
            >
              <HiOutlineSelector className="text-base" />
            </Button>
          </Tooltip>
          <Tooltip content="Publicerede" className="dark" showArrow placement="bottom">
            <Button
              size="sm"
              variant={filters.isPublished === true ? "solid" : "flat"}
              color={filters.isPublished === true ? "success" : "default"}
              onPress={() => setPublishedFilter(true)}
              isIconOnly
              aria-label="Publicerede"
            >
              <RiEyeLine className="text-base" />
            </Button>
          </Tooltip>
          <Tooltip content="Kladder" className="dark" showArrow placement="bottom">
            <Button
              size="sm"
              variant={filters.isPublished === false ? "solid" : "flat"}
              color={filters.isPublished === false ? "warning" : "default"}
              onPress={() => setPublishedFilter(false)}
              isIconOnly
              aria-label="Kladder"
            >
              <RiEyeOffLine className="text-base" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Synlighed */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTION.VISIBILITY}</h3>
        <div className="flex gap-2">
          <Tooltip content="Alle" className="dark" placement="bottom" showArrow>
            <Button
              size="sm"
              variant={filters.visibilityLevel === null ? "solid" : "flat"}
              color={filters.visibilityLevel === null ? "primary" : "default"}
              onPress={() => setVisibility(null)}
              isIconOnly
              aria-label="Alle synligheder"
            >
              <HiOutlineSelector className="text-base" />
            </Button>
          </Tooltip>
          <Tooltip content="Offentlig" className="dark" placement="bottom" showArrow>
            <Button
              size="sm"
              variant={filters.visibilityLevel === 'Public' ? "solid" : "flat"}
              color={filters.visibilityLevel === 'Public' ? "success" : "default"}
              onPress={() => setVisibility('Public')}
              isIconOnly
              aria-label="Offentlig"
            >
              <BiWorld className="text-base" />
            </Button>
          </Tooltip>
          <Tooltip content="Betalt indhold" className="dark" placement="bottom" showArrow>
            <Button
              size="sm"
              variant={filters.visibilityLevel === 'PaidContent' ? "solid" : "flat"}
              color={filters.visibilityLevel === 'PaidContent' ? "warning" : "default"}
              onPress={() => setVisibility('PaidContent')}
              isIconOnly
              aria-label="Betalt indhold"
            >
              <FaCoins className="text-sm" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {isAnyFilterActive && (
        <div className="text-center mt-2">
          <Chip size="sm" color="primary" variant="flat">
            {blogsCount} fundet
          </Chip>
        </div>
      )}
    </div>
  );
}