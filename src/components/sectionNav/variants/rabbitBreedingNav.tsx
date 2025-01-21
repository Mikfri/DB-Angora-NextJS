// src/components/sectionNav/variants/rabbitBreedingNav.tsx
'use client'
import { Input } from "@nextui-org/react";
import SectionNav from '../base/baseSideNav';
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import EnumLocalAutocomplete, { RaceColorApproval } from "@/components/enumHandlers/enumLocalAutocomplete";
import { BreedingFilters } from '@/hooks/rabbits/useRabbitBreedingFilter';

interface Props {
    activeFilters: BreedingFilters;
    onFilterChange: (filters: Partial<BreedingFilters>) => void;
}

export default function RabbitBreedingNav({ activeFilters, onFilterChange }: Props) {
    return (
        <SectionNav title="Avlskaniner">
            <div className="flex flex-col gap-4">
                <Input
                    value={activeFilters.search}
                    onChange={(e) => onFilterChange({ search: e.target.value })}
                    placeholder="Søg efter ID, race, farve eller by"
                    aria-label="Søg efter avlskaniner"
                />
                <Input
                    size="sm"
                    type="date"
                    label="Født efter"
                    value={activeFilters.bornAfterDate || ''}
                    onChange={(e) => onFilterChange({ bornAfterDate: e.target.value || null })}
                    placeholder="Vælg dato"
                />
                <EnumAutocomplete
                    enumType="Gender"
                    value={activeFilters.Gender ?? null}
                    onChange={(value) => onFilterChange({ Gender: value })}
                    label="Køn"
                />
                <EnumAutocomplete
                    enumType="Race"
                    value={activeFilters.Race ?? null}
                    onChange={(value) => onFilterChange({ Race: value })}
                    label="Race"
                />
                <EnumAutocomplete
                    enumType="Color"
                    value={activeFilters.Color ?? null}
                    onChange={(value) => onFilterChange({ Color: value })}
                    label="Farve"
                />
                <EnumLocalAutocomplete
                    enumType={RaceColorApproval}
                    value={activeFilters.raceColorApproval ?? null}
                    onChange={(value) => onFilterChange({ raceColorApproval: value })}
                    label="Godkendt race/farve"
                />
                <div className="flex flex-col gap-2">
                    <Input
                        size="sm"
                        type="number"
                        label="Min postnummer"
                        value={activeFilters.minZipCode?.toString() || ''}
                        onChange={(e) => onFilterChange({ minZipCode: parseInt(e.target.value) || undefined })}
                    />
                    <Input
                        size="sm"
                        type="number"
                        label="Max postnummer"
                        value={activeFilters.maxZipCode?.toString() || ''}
                        onChange={(e) => onFilterChange({ maxZipCode: parseInt(e.target.value) || undefined })}
                    />
                </div>
            </div>
        </SectionNav>
    );
}