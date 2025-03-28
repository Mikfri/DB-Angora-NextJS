// src/components/sectionNav/variants/rabbitSaleNav.tsx
'use client';
import { Listbox, ListboxItem, ListboxSection, Input, Button } from "@heroui/react";
import { ForSaleFilters } from "@/api/types/filterTypes";
import SectionNav from '../base/baseSideNav';
import { useCallback, useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { MdFilterList, MdCalendarMonth, MdOutlineLocationOn } from "react-icons/md";
import { LuRabbit } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RiGenderlessLine } from "react-icons/ri";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useEnums, RabbitEnum } from '@/contexts/EnumContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Props {
    activeFilters?: Partial<ForSaleFilters>;
    onFilterChange?: (filters: ForSaleFilters) => void;
}

type FilterValue = string | number | undefined | null;

// De enum typer der bruges i denne komponent
const REQUIRED_ENUMS: RabbitEnum[] = ['Race', 'Color', 'Gender'];

// Item styling configuration - matcher MyNav
const itemStyles = {
    base: "px-1 py-0",
    mainLink: "font-semibold",
    subLink: "pl-4",
    active: "text-primary",
    divider: "bg-zinc-700/50 my-1",
    icon: "text-xl text-default-500",
    disabledText: "ml-2 text-xs text-default-400"
} as const;

// Konstanter til sektioner
const FILTER_SECTIONS = {
    BASIC: 'Grundfiltre',
    LOCATION: 'Placering',
    ADVANCED: 'Avanceret'
} as const;

// Default filter værdier
const DEFAULT_FILTERS: ForSaleFilters = {
    Race: null,
    Color: null,
    Gender: null,
    RightEarId: null,
    BornAfter: null,
    MinZipCode: null,
    MaxZipCode: null
};

export default function ForSaleNav({
    activeFilters = {},
    onFilterChange
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Direkte initializer med ESNext features (destucturing + spread + nullish coalescing)
    // Fjernet det ubrugte _ og bruger bare activeFilters direkte
    const [localFilters, setLocalFilters] = useState<ForSaleFilters>(() => ({
        ...DEFAULT_FILTERS,
        ...activeFilters,
        ...extractFiltersFromUrl(searchParams)
    }));
    
    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);

    // Modern async IIFE i useEffect
    useEffect(() => {
        (async () => {
            if (!enumsLoaded) {
                try {
                    await getMultipleEnumValues(REQUIRED_ENUMS);
                    setEnumsLoaded(true);
                    console.log('✓ All required enums for ForSaleNav loaded');
                } catch (error) {
                    console.error('Error loading ForSaleNav enums:', error);
                }
            }
        })();
    }, [getMultipleEnumValues, enumsLoaded]);

    // Opdater localFilters når URL ændrer sig - med nullish coalescing og optional chaining
    useEffect(() => {
        if (pathname?.includes('/sale/rabbits')) {
            const paramsFilters = extractFiltersFromUrl(searchParams);
            
            if (Object.keys(paramsFilters).length > 0) {
                setLocalFilters(prev => ({ ...prev, ...paramsFilters }));
            }
        }
    }, [searchParams, pathname]);

    // Memoize handlers with useCallback + computed property name 
    const handleLocalFilter = useCallback((key: keyof ForSaleFilters, value: FilterValue) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleClear = useCallback((key: keyof ForSaleFilters) => {
        setLocalFilters(prev => ({ ...prev, [key]: null }));
    }, []);

    // Modern Object manipulation med filter og map
    const handleSearch = useCallback(() => {
        if (onFilterChange) {
            onFilterChange(localFilters);
        } else {
            // Brug af Array methods med kædet funktioner
            const params = new URLSearchParams(
                Object.entries(localFilters)
                .filter(entry => entry[1] !== null && entry[1] !== undefined && entry[1] !== '')
                .map(([key, value]) => [key, String(value)])
            );
            
            const queryString = params.toString();
            // Template literal string
            const newPath = `/sale/rabbits${queryString ? `?${queryString}` : ''}`;
            
            router.push(newPath);
        }
    }, [onFilterChange, localFilters, router]);

    return (
        <SectionNav title="Kaniner til salg" headerActions={[
            {
                label: "Søg",
                onClick: handleSearch,
                color: "primary" as const
            }
        ]}>
            <Listbox
                aria-label="Filter menu"
                variant="flat"
                className="p-0 gap-0 w-full"
                classNames={{ base: itemStyles.base }}
            >
                {/* Grundfiltre sektion */}
                <ListboxSection
                    title={FILTER_SECTIONS.BASIC}
                    showDivider={true}
                    classNames={{
                        divider: itemStyles.divider
                    }}
                >
                    {/* ID filter */}
                    <ListboxItem
                        key="id-filter"
                        textValue="ID filter"
                        className={itemStyles.subLink}
                        startContent={<MdFilterList className={itemStyles.icon} />}
                        endContent={
                            <div className="w-36 ml-2">
                                <Input
                                    size="sm"
                                    placeholder="ID"
                                    value={localFilters.RightEarId ?? ''}
                                    onChange={(e) => handleLocalFilter('RightEarId', e.target.value || null)}
                                    endContent={localFilters.RightEarId && (
                                        <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('RightEarId')}>
                                            <IoMdClose />
                                        </Button>
                                    )}
                                    classNames={{
                                        inputWrapper: "h-7 min-h-unit-7",
                                        input: "text-sm"
                                    }}
                                />
                            </div>
                        }
                    >
                        ID
                    </ListboxItem>

                    {/* Race filter */}
                    <ListboxItem
                        key="race-filter"
                        textValue="Race filter"
                        className={itemStyles.subLink}
                        startContent={<LuRabbit className={itemStyles.icon} />}
                        endContent={
                            <div className="w-36 ml-2">
                                <EnumAutocomplete
                                    enumType="Race"
                                    value={localFilters.Race ?? null}
                                    onChange={(value) => handleLocalFilter('Race', value)}
                                    label=""
                                />
                            </div>
                        }
                    >
                        Race
                    </ListboxItem>

                    {/* Farve filter */}
                    <ListboxItem
                        key="color-filter"
                        textValue="Farve filter"
                        className={itemStyles.subLink}
                        startContent={<IoColorPaletteOutline className={itemStyles.icon} />}
                        endContent={
                            <div className="w-36 ml-2">
                                <EnumAutocomplete
                                    enumType="Color"
                                    value={localFilters.Color ?? null}
                                    onChange={(value) => handleLocalFilter('Color', value)}
                                    label=""
                                />
                            </div>
                        }
                    >
                        Farve
                    </ListboxItem>

                    {/* Køn filter */}
                    <ListboxItem
                        key="gender-filter"
                        textValue="Køn filter"
                        className={itemStyles.subLink}
                        startContent={<RiGenderlessLine className={itemStyles.icon} />}
                        endContent={
                            <div className="w-36 ml-2">
                                <EnumAutocomplete
                                    enumType="Gender"
                                    value={localFilters.Gender ?? null}
                                    onChange={(value) => handleLocalFilter('Gender', value)}
                                    label=""
                                />
                            </div>
                        }
                    >
                        Køn
                    </ListboxItem>

                    {/* Alder filter */}
                    <ListboxItem
                        key="age-filter"
                        textValue="Alder filter"
                        className={itemStyles.subLink}
                        startContent={<MdCalendarMonth className={itemStyles.icon} />}
                        endContent={
                            <div className="w-36 ml-2">
                                <Input
                                    size="sm"
                                    type="date"
                                    value={localFilters.BornAfter ?? ''}
                                    onChange={(e) => handleLocalFilter('BornAfter', e.target.value || null)}
                                    endContent={localFilters.BornAfter && (
                                        <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('BornAfter')}>
                                            <IoMdClose />
                                        </Button>
                                    )}
                                    classNames={{
                                        inputWrapper: "h-7 min-h-unit-7",
                                        input: "text-sm"
                                    }}
                                />
                            </div>
                        }
                    >
                        Født efter
                    </ListboxItem>
                </ListboxSection>

                {/* Lokation sektion */}
                <ListboxSection
                    title={FILTER_SECTIONS.LOCATION}
                    showDivider={false}
                >
                    {/* Min postnummer */}
                    <ListboxItem
                        key="min-zipcode"
                        textValue="Min postnummer"
                        className={itemStyles.subLink}
                        startContent={<MdOutlineLocationOn className={itemStyles.icon} />}
                        endContent={
                            <div className="w-36 ml-2">
                                <Input
                                    size="sm"
                                    placeholder="Min postnr"
                                    type="number"
                                    value={localFilters.MinZipCode?.toString() ?? ''}
                                    onChange={(e) => handleLocalFilter('MinZipCode', e.target.value ? parseInt(e.target.value) : null)}
                                    endContent={localFilters.MinZipCode && (
                                        <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('MinZipCode')}>
                                            <IoMdClose />
                                        </Button>
                                    )}
                                    classNames={{
                                        inputWrapper: "h-7 min-h-unit-7",
                                        input: "text-sm"
                                    }}
                                />
                            </div>
                        }
                    >
                        Min postnr
                    </ListboxItem>

                    {/* Max postnummer */}
                    <ListboxItem
                        key="max-zipcode"
                        textValue="Max postnummer"
                        className={itemStyles.subLink}
                        startContent={<MdOutlineLocationOn className={itemStyles.icon} />}
                        endContent={
                            <div className="w-36 ml-2">
                                <Input
                                    size="sm"
                                    placeholder="Max postnr"
                                    type="number"
                                    value={localFilters.MaxZipCode?.toString() ?? ''}
                                    onChange={(e) => handleLocalFilter('MaxZipCode', e.target.value ? parseInt(e.target.value) : null)}
                                    endContent={localFilters.MaxZipCode && (
                                        <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('MaxZipCode')}>
                                            <IoMdClose />
                                        </Button>
                                    )}
                                    classNames={{
                                        inputWrapper: "h-7 min-h-unit-7",
                                        input: "text-sm"
                                    }}
                                />
                            </div>
                        }
                    >
                        Max postnr
                    </ListboxItem>
                </ListboxSection>
            </Listbox>
        </SectionNav>
    );
}

// Pure function til URL parameter ekstraktion med ESNext features
function extractFiltersFromUrl(searchParams: ReturnType<typeof useSearchParams>): Partial<ForSaleFilters> {
    if (!searchParams) return {};
    
    // Brug af optional chaining, nullish coalescing, og direkte objekt returnering
    return {
        Race: searchParams?.get('Race') ?? null,
        Color: searchParams?.get('Color') ?? null,
        Gender: searchParams?.get('Gender') ?? null,
        RightEarId: searchParams?.get('RightEarId') ?? null,
        BornAfter: searchParams?.get('BornAfter') ?? null,
        
        // Direkte konvertering med nullish coalescing og falsy check
        MinZipCode: searchParams?.has('MinZipCode') 
            ? Number(searchParams.get('MinZipCode')) || null 
            : null,
        MaxZipCode: searchParams?.has('MaxZipCode')
            ? Number(searchParams.get('MaxZipCode')) || null
            : null
    };
}