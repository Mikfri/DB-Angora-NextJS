'use client';

import { memo, useEffect, useState, useCallback } from 'react';
import { Input, Divider } from "@heroui/react";
import { MdFilterList, MdOutlineLocationOn } from "react-icons/md";
import { LuRabbit } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FaVenusMars } from "react-icons/fa";
import { BreedingFilters } from "@/api/types/filterTypes";
import { useEnums, EnumType } from '@/contexts/EnumContext';
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';

interface RabbitBreedingNavClientProps {
    activeFilters?: Partial<BreedingFilters>;
    onFilterChange?: (filters: BreedingFilters) => void;
}

// De enum typer der bruges i denne komponent
const REQUIRED_ENUMS: EnumType[] = ['Race', 'Color', 'Gender'];

// Konstanter til sektioner - FJERNET ACTIONS herfra!
const FILTER_SECTIONS = {
    BASIC: 'Grundfiltre',
    LOCATION: 'Placering'
} as const;

// Memoize component to prevent unnecessary re-renders
export const RabbitBreedingNavClient = memo(function RabbitBreedingNavClient({
    activeFilters = {},
    onFilterChange
}: RabbitBreedingNavClientProps) {
    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);

    // Load enums when component mounts
    useEffect(() => {
        if (!enumsLoaded) {
            getMultipleEnumValues(REQUIRED_ENUMS)
                .then(() => setEnumsLoaded(true))
                .catch(error => console.error('Error loading BreedingNav enums:', error));
        }
    }, [getMultipleEnumValues, enumsLoaded]);

    // Typestærk handler til filteropdateringer
    const handleFilterChange = useCallback((updates: Partial<BreedingFilters>) => {
        console.log("RabbitBreedingNavClient - Sending filter update:", updates);
        
        if (onFilterChange) {
            // Sikrer os at vi har alle eksisterende filtre samt opdateringer
            const mergedFilters = {...activeFilters, ...updates};
            onFilterChange(mergedFilters as BreedingFilters);
        }
    }, [onFilterChange, activeFilters]);

    // Sikre værdier fra activeFilters
    const filters = {
        search: activeFilters?.search || '',
        Gender: activeFilters?.Gender || '',
        Race: activeFilters?.Race || '',
        Color: activeFilters?.Color || '',
        raceColorApproval: activeFilters?.raceColorApproval || '',
        minZipCode: activeFilters?.minZipCode || undefined,
        maxZipCode: activeFilters?.maxZipCode || undefined,
        bornAfterDate: activeFilters?.bornAfterDate || null
    };

    return (
        <div className="w-full p-1 space-y-2">
            {/* Grundfiltre sektion - direkte øverst uden Handlinger sektion */}
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
                                onChange={(e) => handleFilterChange({ search: e.target.value })}
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
                                value={filters.Race ?? ""}
                                onChange={value => handleFilterChange({ Race: value ?? undefined })}
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
                                value={filters.Color ?? ""}
                                onChange={value => handleFilterChange({ Color: value ?? undefined })}
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
                                value={filters.Gender ?? ""}
                                onChange={value => handleFilterChange({ Gender: value ?? undefined })}
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
                                    handleFilterChange({ minZipCode: numValue });
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
                                    handleFilterChange({ maxZipCode: numValue });
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