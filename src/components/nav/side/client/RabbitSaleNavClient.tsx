// src/components/nav/side/client/RabbitSaleNavClient.tsx
'use client';
import { Input, Button, Divider } from "@heroui/react";
import { useState, useEffect, memo } from 'react';
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useEnums, RabbitEnum } from '@/contexts/EnumContext';
import { useRabbitFilters } from '@/store/saleRabbitsFilterStore';
// Importer nødvendige ikoner
import { IoMdClose } from "react-icons/io";
import { MdOutlineLocationOn } from "react-icons/md";
import { LuRabbit } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RiGenderlessLine } from "react-icons/ri";


// De enum typer der bruges i denne komponent
const REQUIRED_ENUMS: RabbitEnum[] = ['Race', 'Color', 'Gender'];

// Konstanter til sektioner
const FILTER_SECTIONS = {
    BASIC: 'Grundfiltre',
    LOCATION: 'Placering'
} as const;

// Memoize component to prevent unnecessary re-renders
export const RabbitSaleNavClient = memo(function RabbitSaleNavClient() {
    // Brug Zustand store i stedet for useRabbitSearch
    const {
        filters,
        updateFilter,
        clearFilter,
        clearAllFilters,
        applyFilters,
        syncFiltersWithUrl
    } = useRabbitFilters();

    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);

    // Synkroniser filtre med URL ved første render - kører kun én gang
    useEffect(() => {
        syncFiltersWithUrl();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load enums when component mounts
    useEffect(() => {
        if (enumsLoaded) return;

        const loadEnums = async () => {
            try {
                await getMultipleEnumValues(REQUIRED_ENUMS);
                setEnumsLoaded(true);
            } catch (error) {
                console.error('Error loading ForSaleNav enums:', error);
            }
        };

        loadEnums();
    }, [getMultipleEnumValues, enumsLoaded]);

    // Har filtre?
    const hasActiveFilters = Object.values(filters).some(value =>
        value !== undefined && value !== null && value !== '');

    return (
        <div className="w-full p-1 space-y-2">
            {/* Grundfiltre sektion */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5 flex justify-between">
                    {FILTER_SECTIONS.BASIC}
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
                </h3>

                <div className="space-y-1.5">
                    {/* Race filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <LuRabbit className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Race</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Race"
                                value={filters.race ?? null}
                                onChange={(value) => updateFilter('race', value || null)}
                                label="Race"
                            />
                        </div>
                    </div>

                    {/* Farve filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <IoColorPaletteOutline className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Farve</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Color"
                                value={filters.color ?? null}
                                onChange={(value) => updateFilter('color', value || null)}
                                label="Farve"
                            />
                        </div>
                    </div>

                    {/* Køn filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <RiGenderlessLine className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Køn</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Gender"
                                value={filters.gender ?? null}
                                onChange={(value) => updateFilter('gender', value || null)}
                                label="Køn"
                            />
                        </div>
                    </div>

                    {/* Flere filtre kan tilføjes her */}
                </div>
            </div>

            {/* Divider med minimal spacing */}
            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Lokation sektion */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.LOCATION}
                </h3>

                <div className="flex gap-2">
                    {/* Min postnummer */}
                    <div className="flex-1">
                        <div className="flex items-center gap-1">
                            <div className="flex items-center">
                                <MdOutlineLocationOn className="text-lg text-default-500" />
                            </div>
                            <div className="flex-1">
                                <Input
                                    size="sm"
                                    type="number"
                                    placeholder="Min postnr"
                                    value={filters.minZipCode?.toString() ?? ''}
                                    onChange={(e) => updateFilter('minZipCode',
                                        e.target.value ? parseInt(e.target.value) : null)}
                                    endContent={!!filters.minZipCode && (
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            onPress={() => clearFilter('minZipCode')}
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
                    </div>

                    {/* Max postnummer */}
                    <div className="flex-1">
                        <div className="flex items-center gap-1">
                            <div className="flex-1">
                                <Input
                                    size="sm"
                                    type="number"
                                    placeholder="Max postnr"
                                    value={filters.maxZipCode?.toString() ?? ''}
                                    onChange={(e) => updateFilter('maxZipCode',
                                        e.target.value ? parseInt(e.target.value) : null)}
                                    endContent={!!filters.maxZipCode && (
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            onPress={() => clearFilter('maxZipCode')}
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
                    </div>
                </div>
            </div>

            {/* Divider med minimal spacing */}
            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Søgeknap */}
            <div className="pt-0.5">
                <Button
                    color="primary"
                    fullWidth
                    size="sm"
                    onPress={applyFilters}
                >
                    Søg
                </Button>
            </div>
        </div>
    );
});