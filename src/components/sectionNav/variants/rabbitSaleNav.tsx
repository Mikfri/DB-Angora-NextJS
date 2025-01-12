// src/components/sectionNav/variants/forSaleNav.tsx
import { Input, Button } from "@nextui-org/react";
import { ForSaleFilters } from "@/Types/filterTypes";
import SectionNav from '../base/baseSideNav';
import { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';

interface Props {
    activeFilters: ForSaleFilters;
    onFilterChange: (filters: ForSaleFilters) => void;
}

type FilterValue = string | number | undefined | null;

export default function ForSaleNav({ activeFilters, onFilterChange }: Props) {
    const [localFilters, setLocalFilters] = useState<ForSaleFilters>(activeFilters);

    const handleLocalFilter = (key: keyof ForSaleFilters, value: FilterValue) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClear = (key: keyof ForSaleFilters) => {
        setLocalFilters(prev => ({ ...prev, [key]: undefined }));
    };

    const handleSearch = () => {
        onFilterChange(localFilters);
    };

    return (
        <SectionNav
            title="Kaniner til salg"
            actions={[{ label: "Søg", onClick: handleSearch, color: "primary" as const }]}
        >
            <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Input
                        placeholder="ID"
                        value={localFilters.RightEarId ?? ''}
                        onChange={(e) => handleLocalFilter('RightEarId', e.target.value || null)}
                        className="max-w-xs"
                        endContent={localFilters.RightEarId && (
                            <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('RightEarId')}>
                                <IoMdClose />
                            </Button>
                        )}
                    />
                </div>

                <div className="flex items-center gap-2 min-w-[200px]">
                    <Input
                        type="date"
                        label="Født efter"
                        variant="flat"
                        value={localFilters.BornAfter ?? ''}
                        onChange={(e) => handleLocalFilter('BornAfter', e.target.value || null)}
                        className="max-w-xs"
                        endContent={localFilters.BornAfter && (
                            <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('BornAfter')}>
                                <IoMdClose />
                            </Button>
                        )}
                    />
                </div>

                <div className="flex items-center gap-2 min-w-[200px]">
                    <EnumAutocomplete
                        enumType="Race"
                        value={localFilters.Race ?? null}
                        onChange={(value) => handleLocalFilter('Race', value)}
                        label="Race"
                    />
                </div>

                <div className="flex items-center gap-2 min-w-[200px]">
                    <EnumAutocomplete
                        enumType="Color"
                        value={localFilters.Color ?? null}
                        onChange={(value) => handleLocalFilter('Color', value)}
                        label="Farve"
                    />
                </div>


                <div className="flex items-center gap-2 min-w-[200px]">
                    <EnumAutocomplete
                        enumType="Gender"
                        value={localFilters.Gender ?? null}
                        onChange={(value) => handleLocalFilter('Gender', value)}
                        label="Køn"
                    />
                </div>

                <div className="flex items-center gap-2 min-w-[200px]">
                    <Input
                        placeholder="Min Postnummer"
                        type="number"
                        value={localFilters.MinZipCode?.toString() ?? ''}
                        onChange={(e) => handleLocalFilter('MinZipCode', e.target.value ? parseInt(e.target.value) : null)}
                        className="max-w-xs"
                        endContent={localFilters.MinZipCode && (
                            <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('MinZipCode')}>
                                <IoMdClose />
                            </Button>
                        )}
                    />
                </div>

                <div className="flex items-center gap-2 min-w-[200px]">
                    <Input
                        placeholder="Max Postnummer"
                        type="number"
                        value={localFilters.MaxZipCode?.toString() ?? ''}
                        onChange={(e) => handleLocalFilter('MaxZipCode', e.target.value ? parseInt(e.target.value) : null)}
                        className="max-w-xs"
                        endContent={localFilters.MaxZipCode && (
                            <Button isIconOnly size="sm" variant="light" onPress={() => handleClear('MaxZipCode')}>
                                <IoMdClose />
                            </Button>
                        )}
                    />
                </div>
            </div>
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