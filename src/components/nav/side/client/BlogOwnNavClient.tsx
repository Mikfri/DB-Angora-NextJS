// src/components/nav/side/client/BlogOwnNavClient.tsx

'use client';

import { Input, Button, Divider, Tooltip, Chip } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { MdCalendarMonth } from "react-icons/md";
import { RiAddCircleLine } from "react-icons/ri";
import { TbFilterSearch } from "react-icons/tb";

import { useBlogOwnedStore } from '@/store/BlogOwnedStore';
import { ROUTES } from "@/constants/navigationConstants";

const FILTER_SECTIONS = {
    ACTIONS: 'Handlinger',
    STATUS: 'Status',
    BASIC: 'Filtre'
} as const;

export function BlogOwnNavClient() {
    const router = useRouter();

    const {
        filters,
        updateFilters,
        isAnyFilterActive,
        blogsCount
    } = useBlogOwnedStore();

    return (
        <div className="w-full p-1 space-y-2">
            {/* Handlinger sektion */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.ACTIONS}
                </h3>

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

            {/* Status sektion */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.STATUS}
                </h3>

                {/* Søgefelt */}
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1.5 min-w-[70px]">
                        <TbFilterSearch className="text-lg text-default-500" />
                        <span className="text-xs font-medium">Søg</span>
                    </div>
                    <div className="flex-1">
                        <Input
                            size="sm"
                            placeholder="Titel eller undertitel"
                            value={filters.search}
                            onChange={(e) => updateFilters({ search: e.target.value })}
                            classNames={{
                                inputWrapper: "h-7 min-h-unit-7 px-2",
                                input: "text-xs"
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 dark mt-2">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium">Publicering</span>
                    </div>

                    <div className="flex gap-2">
                        <Tooltip
                            content="Vis alle blogs"
                            showArrow={true}
                            placement="bottom"
                            className="dark"
                        >
                            <Button
                                size="sm"
                                variant={filters.isPublished === null ? "solid" : "flat"}
                                color={filters.isPublished === null ? "primary" : "default"}
                                onPress={() => updateFilters({ isPublished: null })}
                                isIconOnly
                                aria-label="Vis alle blogs"
                            />
                        </Tooltip>

                        <Tooltip
                            content="Kun publicerede"
                            showArrow={true}
                            placement="bottom"
                            className="dark"
                        >
                            <Button
                                size="sm"
                                variant={filters.isPublished === true ? "solid" : "flat"}
                                color={filters.isPublished === true ? "success" : "default"}
                                onPress={() => updateFilters({ isPublished: true })}
                                isIconOnly
                                aria-label="Kun publicerede"
                            />
                        </Tooltip>

                        <Tooltip
                            content="Kun kladder"
                            showArrow={true}
                            placement="bottom"
                            className="dark"
                        >
                            <Button
                                size="sm"
                                variant={filters.isPublished === false ? "solid" : "flat"}
                                color={filters.isPublished === false ? "warning" : "default"}
                                onPress={() => updateFilters({ isPublished: false })}
                                isIconOnly
                                aria-label="Kun kladder"
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>

            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Grundfiltre sektion */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.BASIC}
                </h3>

                <div className="space-y-1.5">
                    {/* Oprettet efter filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <MdCalendarMonth className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Efter</span>
                        </div>
                        <div className="flex-1">
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Vis antal blogs hvis filtre er aktive */}
            {isAnyFilterActive && (
                <div className="text-center mt-2">
                    <Chip size="sm" color="primary" variant="flat">
                        {blogsCount} blogs fundet
                    </Chip>
                </div>
            )}
        </div>
    );
}