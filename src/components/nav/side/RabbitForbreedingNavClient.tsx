// src/components/nav/side/RabbitForbreedingNavClient.tsx
'use client';

import { memo, useEffect, useState } from 'react';
import { Input, Divider } from "@heroui/react";
import { MdFilterList, MdOutlineLocationOn } from "react-icons/md";
import { LuRabbit } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FaVenusMars } from "react-icons/fa";
import { useEnums, EnumType } from '@/contexts/EnumContext';
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useRabbitsForbreedingStore } from '@/store/rabbitsForbreedingStore';  // ← RETTET

// De enum typer der bruges i denne komponent
const REQUIRED_ENUMS: EnumType[] = ['Race', 'Color', 'Gender'];

// Konstanter til sektioner
const FILTER_SECTIONS = {
    BASIC: 'Grundfiltre',
    LOCATION: 'Placering'
} as const;

// Memoize component to prevent unnecessary re-renders
export const RabbitForbreedingNavClient = memo(function RabbitForbreedingNavClient() {  // ← RETTET funktionsnavn
    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);

    // Hent fra store
    const { filters, updateFilters } = useRabbitsForbreedingStore();  // ← RETTET

    // Load enums when component mounts
    useEffect(() => {
        if (!enumsLoaded) {
            getMultipleEnumValues(REQUIRED_ENUMS)
                .then(() => setEnumsLoaded(true))
                .catch(error => console.error('Error loading BreedingNav enums:', error));
        }
    }, [getMultipleEnumValues, enumsLoaded]);

    return (
        <div className="w-full p-1 space-y-2">
            {/* Grundfiltre sektion */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.BASIC}
                </h3>

                <div className="space-y-1.5">
                    {/* Søgefelt */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <MdFilterList className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Søg</span>
                        </div>
                        <div className="flex-1">
                            <Input
                                size="sm"
                                placeholder="Race, farve eller ID"
                                value={filters.search}
                                onChange={(e) => updateFilters({ search: e.target.value })}
                                classNames={{
                                    inputWrapper: "h-7 min-h-unit-7 px-2",
                                    input: "text-xs"
                                }}
                            />
                        </div>
                    </div>

                    {/* Race filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <LuRabbit className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Race</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Race"
                                value={filters.Race}
                                onChange={value => updateFilters({ Race: value ?? '' })}
                                label="Race"
                            />
                        </div>
                    </div>

                    {/* Color filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <IoColorPaletteOutline className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Farve</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Color"
                                value={filters.Color}
                                onChange={value => updateFilters({ Color: value ?? '' })}
                                label="Farve"
                            />
                        </div>
                    </div>

                    {/* Gender filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <FaVenusMars className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Køn</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Gender"
                                value={filters.Gender}
                                onChange={value => updateFilters({ Gender: value ?? '' })}
                                label="Køn"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Lokationsfiltre */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.LOCATION}
                </h3>
                
                <div className="space-y-1.5">
                    {/* Min ZipCode filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <MdOutlineLocationOn className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Fra</span>
                        </div>
                        <div className="flex-1">
                            <Input
                                size="sm"
                                type="number"
                                placeholder="Minimum postnr"
                                value={filters.minZipCode?.toString() || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const numValue = value ? parseInt(value) : undefined;
                                    updateFilters({ minZipCode: numValue });
                                }}
                                classNames={{
                                    inputWrapper: "h-7 min-h-unit-7 px-2",
                                    input: "text-xs"
                                }}
                            />
                        </div>
                    </div>
                    
                    {/* Max ZipCode filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <MdOutlineLocationOn className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Til</span>
                        </div>
                        <div className="flex-1">
                            <Input
                                size="sm"
                                type="number"
                                placeholder="Maximum postnr"
                                value={filters.maxZipCode?.toString() || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const numValue = value ? parseInt(value) : undefined;
                                    updateFilters({ maxZipCode: numValue });
                                }}
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
    );
});