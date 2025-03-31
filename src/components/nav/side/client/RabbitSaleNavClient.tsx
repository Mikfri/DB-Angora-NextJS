'use client';
import { Input, Button, Divider } from "@heroui/react";
import { ForSaleFilters } from "@/api/types/filterTypes";
import { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { MdFilterList, MdCalendarMonth, MdOutlineLocationOn } from "react-icons/md";
import { LuRabbit } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RiGenderlessLine } from "react-icons/ri";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useEnums, RabbitEnum } from '@/contexts/EnumContext';
import { useRabbitSearch } from "@/hooks/rabbits/useRabbitForsaleFilter";

interface RabbitSaleNavClientProps {
    activeFilters?: Partial<ForSaleFilters>;
    onFilterChange?: (filters: ForSaleFilters) => void;
}

// De enum typer der bruges i denne komponent
const REQUIRED_ENUMS: RabbitEnum[] = ['Race', 'Color', 'Gender'];

// Konstanter til sektioner
const FILTER_SECTIONS = {
    BASIC: 'Grundfiltre',
    LOCATION: 'Placering',
    ADVANCED: 'Avanceret'
} as const;

export function RabbitSaleNavClient({
    activeFilters = {},
    onFilterChange
}: RabbitSaleNavClientProps) {
    const { 
        filters, 
        updateFilter, 
        clearFilter, 
        search 
    } = useRabbitSearch({ 
        initialFilters: activeFilters, 
        onFilterChange 
    });

    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);

    // Load enums når komponenten mounter
    useEffect(() => {
        if (!enumsLoaded) {
            getMultipleEnumValues(REQUIRED_ENUMS)
                .then(() => setEnumsLoaded(true))
                .catch(error => console.error('Error loading ForSaleNav enums:', error));
        }
    }, [getMultipleEnumValues, enumsLoaded]);

    return (
        <div className="w-full p-2 space-y-6">
            {/* Grundfiltre sektion */}
            <div>
                <h3 className="text-xs font-semibold text-zinc-300 mb-3 border-b border-zinc-700/50 pb-1 uppercase tracking-wider">
                    {FILTER_SECTIONS.BASIC}
                </h3>

                <div className="space-y-3">
                    {/* ID filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <MdFilterList className="text-lg text-default-500" />
                            <span className="text-xs font-medium">ID</span>
                        </div>
                        <div className="w-2/3">
                            <Input
                                size="sm"
                                placeholder="ID"
                                value={filters.RightEarId ?? ''}
                                onChange={(e) => updateFilter('RightEarId', e.target.value || null)}
                                endContent={filters.RightEarId && (
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => clearFilter('RightEarId')}
                                    >
                                        <IoMdClose />
                                    </Button>
                                )}
                                classNames={{
                                    inputWrapper: "h-7 min-h-unit-7 cursor-text",
                                    input: "text-sm cursor-text"
                                }}
                            />
                        </div>
                    </div>

                    {/* Race filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <LuRabbit className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Race</span>
                        </div>
                        <div className="w-2/3">
                            <EnumAutocomplete
                                enumType="Race"
                                value={filters.Race ?? null}
                                onChange={(value) => updateFilter('Race', value || null)}
                                label="Race"
                            />
                        </div>
                    </div>

                    {/* Farve filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <IoColorPaletteOutline className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Farve</span>
                        </div>
                        <div className="w-2/3">
                            <EnumAutocomplete
                                enumType="Color"
                                value={filters.Color ?? null}
                                onChange={(value) => updateFilter('Color', value || null)}
                                label="Farve"
                            />
                        </div>
                    </div>

                    {/* Køn filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <RiGenderlessLine className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Køn</span>
                        </div>
                        <div className="w-2/3">
                            <EnumAutocomplete
                                enumType="Gender"
                                value={filters.Gender ?? null}
                                onChange={(value) => updateFilter('Gender', value || null)}
                                label="Køn"
                            />
                        </div>
                    </div>

                    {/* Alder filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <MdCalendarMonth className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Født efter</span>
                        </div>
                        <div className="w-2/3">
                            <Input
                                size="sm"
                                type="date"
                                value={filters.BornAfter ?? ''}
                                onChange={(e) => updateFilter('BornAfter', e.target.value || null)}
                                endContent={filters.BornAfter && (
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => clearFilter('BornAfter')}
                                    >
                                        <IoMdClose />
                                    </Button>
                                )}
                                classNames={{
                                    inputWrapper: "h-7 min-h-unit-7",
                                    input: "text-sm"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Divider className="bg-zinc-700/50 my-1" />

            {/* Lokation sektion */}
            <div>
                <h3 className="text-xs font-semibold text-zinc-300 mb-3 border-b border-zinc-700/50 pb-1 uppercase tracking-wider">
                    {FILTER_SECTIONS.LOCATION}
                </h3>

                {/* ZipCode felter på samme linje */}
                <div className="flex items-center gap-2">
                    {/* Min postnummer */}
                    <div className="flex-1">
                        <div className="mb-1 flex items-center gap-1">
                            <MdOutlineLocationOn className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Min postnr</span>
                        </div>
                        <Input
                            size="sm"
                            placeholder="Min postnr"
                            type="number"
                            value={filters.MinZipCode?.toString() ?? ''}
                            onChange={(e) => updateFilter('MinZipCode', 
                                e.target.value ? parseInt(e.target.value) : null)}
                            endContent={filters.MinZipCode && (
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => clearFilter('MinZipCode')}
                                >
                                    <IoMdClose />
                                </Button>
                            )}
                            classNames={{
                                inputWrapper: "h-7 min-h-unit-7",
                                input: "text-sm"
                            }}
                        />
                    </div>

                    {/* Max postnummer */}
                    <div className="flex-1">
                        <div className="mb-1 flex items-center gap-1">
                            <MdOutlineLocationOn className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Max postnr</span>
                        </div>
                        <Input
                            size="sm"
                            placeholder="Max postnr"
                            type="number"
                            value={filters.MaxZipCode?.toString() ?? ''}
                            onChange={(e) => updateFilter('MaxZipCode', 
                                e.target.value ? parseInt(e.target.value) : null)}
                            endContent={filters.MaxZipCode && (
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => clearFilter('MaxZipCode')}
                                >
                                    <IoMdClose />
                                </Button>
                            )}
                            classNames={{
                                inputWrapper: "h-7 min-h-unit-7",
                                input: "text-sm"
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Søgeknap */}
            <Button
                color="primary"
                fullWidth
                onPress={search}
            >
                Søg
            </Button>
        </div>
    );
}