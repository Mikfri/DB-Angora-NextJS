// src/components/nav/side/client/RabbitSaleNavClient.tsx
'use client';
import { Input, Button, Divider } from "@heroui/react";
import { ForSaleFilters } from "@/api/types/filterTypes";
import { useState, useEffect, memo } from 'react';
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
    LOCATION: 'Placering'
} as const;

// Memoize component to prevent unnecessary re-renders
export const RabbitSaleNavClient = memo(function RabbitSaleNavClient({
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

    return (
        <div className="w-full p-1 space-y-2"> {/* Reduceret yderligere padding og spacing */}
            {/* Grundfiltre sektion - med mindre spacing */}
            <div>
                {/* Justeret overskriftstil med mindre margin */}
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.BASIC}
                </h3>

                <div className="space-y-1.5"> {/* Reduceret spacing mellem filtre */}
                    {/* ID filter - Kompakt layout */}
                    <FilterRow
                        icon={<MdFilterList className="text-lg text-default-500" />}
                        label="ID"
                        value={filters.RightEarId ?? ''}
                        onChange={(e) => updateFilter('RightEarId', e.target.value || null)}
                        onClear={() => clearFilter('RightEarId')}
                        showClear={!!filters.RightEarId}
                        placeholder="ID"
                    />

                    {/* Race filter - Kompakt layout med EnumAutocomplete */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <LuRabbit className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Race</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Race"
                                value={filters.Race ?? null}
                                onChange={(value) => updateFilter('Race', value || null)}
                                label="Race"
                            />
                        </div>
                    </div>

                    {/* Farve filter - Kompakt layout med EnumAutocomplete */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <IoColorPaletteOutline className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Farve</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Color"
                                value={filters.Color ?? null}
                                onChange={(value) => updateFilter('Color', value || null)}
                                label="Farve"
                            />
                        </div>
                    </div>

                    {/* Køn filter - Kompakt layout med EnumAutocomplete */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <RiGenderlessLine className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Køn</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Gender"
                                value={filters.Gender ?? null}
                                onChange={(value) => updateFilter('Gender', value || null)}
                                label="Køn"
                            />
                        </div>
                    </div>

                    {/* Alder filter - Kompakt layout */}
                    <FilterRow
                        icon={<MdCalendarMonth className="text-lg text-default-500" />}
                        label="Efter"
                        value={filters.BornAfter ?? ''}
                        onChange={(e) => updateFilter('BornAfter', e.target.value || null)}
                        onClear={() => clearFilter('BornAfter')}
                        showClear={!!filters.BornAfter}
                        type="date"
                    />
                </div>
            </div>

            {/* Divider med minimal spacing */}
            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Lokation sektion - mere kompakt */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.LOCATION}
                </h3>

                {/* ZipCode felter - uden labels for mere plads til inputs */}
                <div className="flex gap-2">
                    {/* Min postnummer - uden label for mere plads */}
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
                                    value={filters.MinZipCode?.toString() ?? ''}
                                    onChange={(e) => updateFilter('MinZipCode',
                                        e.target.value ? parseInt(e.target.value) : null)}
                                    endContent={!!filters.MinZipCode && (
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
                                        inputWrapper: "h-7 min-h-unit-7 px-2", // Lidt højere for bedre synlighed
                                        input: "text-xs"
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Max postnummer - uden label for mere plads */}
                    <div className="flex-1">
                        <div className="flex items-center gap-1">
                            {/* <div className="flex items-center">
                                <MdOutlineLocationOn className="text-lg text-default-500" />
                            </div> */}
                            <div className="flex-1">
                                <Input
                                    size="sm"
                                    type="number"
                                    placeholder="Max postnr"
                                    value={filters.MaxZipCode?.toString() ?? ''}
                                    onChange={(e) => updateFilter('MaxZipCode',
                                        e.target.value ? parseInt(e.target.value) : null)}
                                    endContent={!!filters.MaxZipCode && (
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
                                        inputWrapper: "h-7 min-h-unit-7 px-2", // Lidt højere for bedre synlighed
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

            {/* Søgeknap - med minimal padding */}
            <div className="pt-0.5">
                <Button
                    color="primary"
                    fullWidth
                    size="sm" // Reduceret størrelse
                    onPress={search}
                >
                    Søg
                </Button>
            </div>
        </div>
    );
});

// Ny hjælpekomponent for at standardisere filterrækker
interface FilterRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    showClear: boolean;
    placeholder?: string;
    type?: string;
}

function FilterRow({
    icon,
    label,
    value,
    onChange,
    onClear,
    showClear,
    placeholder,
    type = "text"
}: FilterRowProps) {
    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-1.5 min-w-[70px]">
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </div>
            <div className="flex-1">
                <Input
                    size="sm"
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    endContent={showClear && (
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={onClear}
                        >
                            <IoMdClose />
                        </Button>
                    )}
                    classNames={{
                        inputWrapper: "h-6 min-h-unit-6 px-2", // Reduceret højde og padding
                        input: "text-xs" // Mindre tekststørrelse
                    }}
                />
            </div>
        </div>
    );
}