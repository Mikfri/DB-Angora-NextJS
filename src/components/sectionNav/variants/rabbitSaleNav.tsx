// src/components/sectionNav/variants/rabbitSaleNav.tsx
'use client';
import { Input, Button } from "@heroui/react";
import { ForSaleFilters } from "@/api/types/filterTypes";
import SectionNav from '../base/baseSideNav';
import { useCallback, useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useEnums, RabbitEnum } from '@/contexts/EnumContext'; // Importér fra EnumContext

interface Props {
    activeFilters: ForSaleFilters;
    onFilterChange: (filters: ForSaleFilters) => void;
}

type FilterValue = string | number | undefined | null;

// De enum typer der bruges i denne komponent
const REQUIRED_ENUMS: RabbitEnum[] = ['Race', 'Color', 'Gender'];

export default function ForSaleNav({ activeFilters, onFilterChange }: Props) {
    const [localFilters, setLocalFilters] = useState<ForSaleFilters>(activeFilters);
    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);
    
    // Pre-hent nødvendige enums når komponenten indlæses
    useEffect(() => {
        const loadRequiredEnums = async () => {
            try {
                await getMultipleEnumValues(REQUIRED_ENUMS);
                setEnumsLoaded(true);
                console.log('✓ All required enums for ForSaleNav loaded');
            } catch (error) {
                console.error('Error loading ForSaleNav enums:', error);
            }
        };
        
        if (!enumsLoaded) {
            loadRequiredEnums();
        }
    }, [getMultipleEnumValues, enumsLoaded]);

    // Memoize handlers to prevent unnecessary re-renders
    const handleLocalFilter = useCallback((key: keyof ForSaleFilters, value: FilterValue) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleClear = useCallback((key: keyof ForSaleFilters) => {
        setLocalFilters(prev => ({ ...prev, [key]: null }));
    }, []);

    const handleSearch = useCallback(() => {
        onFilterChange(localFilters);
    }, [onFilterChange, localFilters]);

    // Create filter input components with memoized handlers
    const filterInputs = [
        <Input
            key="rightEarId"
            size="sm"
            placeholder="ID"
            value={localFilters.RightEarId ?? ''}
            onChange={(e) => handleLocalFilter('RightEarId', e.target.value || null)}
            endContent={localFilters.RightEarId && (
                <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('RightEarId')}>
                    <IoMdClose />
                </Button>
            )}
        />,
        <Input
            key="bornAfter"
            size="sm"
            type="date"
            label="Født efter"
            variant="flat"
            value={localFilters.BornAfter ?? ''}
            onChange={(e) => handleLocalFilter('BornAfter', e.target.value || null)}
            endContent={localFilters.BornAfter && (
                <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('BornAfter')}>
                    <IoMdClose />
                </Button>
            )}
        />,
        <EnumAutocomplete
            key="race"
            enumType="Race"
            value={localFilters.Race ?? null}
            onChange={(value) => handleLocalFilter('Race', value)}
            label="Race"
        />,
        <EnumAutocomplete
            key="color"
            enumType="Color"
            value={localFilters.Color ?? null}
            onChange={(value) => handleLocalFilter('Color', value)}
            label="Farve"
        />,
        <EnumAutocomplete
            key="gender"
            enumType="Gender"
            value={localFilters.Gender ?? null}
            onChange={(value) => handleLocalFilter('Gender', value)}
            label="Køn"
        />,
        <Input
            key="minZipCode"
            size="sm"
            placeholder="Min Postnummer"
            type="number"
            value={localFilters.MinZipCode?.toString() ?? ''}
            onChange={(e) => handleLocalFilter('MinZipCode', e.target.value ? parseInt(e.target.value) : null)}
            endContent={localFilters.MinZipCode && (
                <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('MinZipCode')}>
                    <IoMdClose />
                </Button>
            )}
        />,
        <Input
            key="maxZipCode"
            size="sm"
            placeholder="Max Postnummer"
            type="number"
            value={localFilters.MaxZipCode?.toString() ?? ''}
            onChange={(e) => handleLocalFilter('MaxZipCode', e.target.value ? parseInt(e.target.value) : null)}
            endContent={localFilters.MaxZipCode && (
                <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('MaxZipCode')}>
                    <IoMdClose />
                </Button>
            )}
        />
    ];

    return (
        <SectionNav
            title="Kaniner til salg"
            headerActions={[
                { 
                    label: "Søg", 
                    onClick: handleSearch, 
                    color: "primary" as const 
                }
            ]}
        >
            {filterInputs}
        </SectionNav>
    );
}