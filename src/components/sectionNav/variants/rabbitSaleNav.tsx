// src/components/sectionNav/variants/forSaleNav.tsx
// filepath: /c:/Users/mikkf/Documents/GitHub/DB-Angora-NextJS/src/components/sectionNav/variants/rabbitSaleNav.tsx

'use client';
import { Input, Button } from "@heroui/react";
import { ForSaleFilters } from "@/api/types/filterTypes";
import SectionNav from '../base/baseSideNav';
import { useCallback, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';

interface Props {
    activeFilters: ForSaleFilters;
    onFilterChange: (filters: ForSaleFilters) => void;
}

type FilterValue = string | number | undefined | null;

export default function ForSaleNav({ activeFilters, onFilterChange }: Props) {
    const [localFilters, setLocalFilters] = useState<ForSaleFilters>(activeFilters);

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
/*
graph TD
    subgraph "ForSaleNav (SSR)"
        A[User ændrer filter] --> B[Opdater localFilters state]
        B --> C[Klik på Søg knap]
        C --> D[onFilterChange trigger]
        D --> E[URL params opdateres]
        E --> F[Server-side API kald]
        F --> G[Ny SSR render]
    end

    subgraph "OwnNav (CSR)"
        H[User ændrer søgning] --> I[Direkte onChange event]
        I --> J[Filter lokalt array]
        J --> K[Re-render med filtreret data]
    end

//--------------------------
FORSKELLE:
ForSaleNav (SSR)
• Filter genererer URL params
• Server-side data fetching
• God for SEO
• Delbare URLs med filtre
• Større dataset håndtering

OwnNav (CSR)
• In-memory filtrering
• Beskyttet bag auth
• Hurtigere feedback
• Mindre dataset
• Ingen SEO behov (private data)


//--------------------
LIDT OM SEO:
Man kan ikke SEO optimere indhold bag login af flere grunde:

Crawler Adgang
• Søgemaskine crawlers kan ikke logge ind
• Private data er ikke tilgængelig for indeksering

Tekniske Begrænsninger
• JavaScript-baseret auth blokerer crawlers
• Cookie/session beskyttelse forhindrer adgang
• CSR content genereres kun efter succesfuld auth

Best Practices

Private data bør ikke være søgbart
• Personlige oplysninger skal forblive private
• Auth er designet til at forhindre uautoriseret adgang
*/