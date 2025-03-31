// src/components/sectionNav/variants/rabbitOwnNav.tsx
'use client';
import { Input, Switch } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { PiRabbitFill } from "react-icons/pi";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { OwnFilters } from '@/api/types/filterTypes';
import EnumLocalAutocomplete, { RaceColorApproval } from "@/components/enumHandlers/enumLocalAutocomplete";
import SectionNav from "@/components/sectionNav/base/baseSideNav";
interface Props {
    activeFilters: OwnFilters;
    onFilterChange: (filters: Partial<OwnFilters>) => void;
}

export default function OwnNav({ activeFilters, onFilterChange }: Props) {
    const router = useRouter();

    return (
        <SectionNav
            title="Mine Kaniner"
            headerActions={[
                {
                    label: (
                        <>
                            <PiRabbitFill className="mr-2" />
                            Opret kanin
                        </>
                    ),
                    onClick: () => router.push('/account/myRabbits/create'),
                    color: "success",
                    className: "text-white"
                }
            ]}
        >
            <div className="flex flex-col gap-4">
                <Input
                    value={activeFilters.search || ''}
                    onChange={(e) => onFilterChange({ search: e.target.value })}
                    placeholder="Navn, øremærke eller race"
                    aria-label="Søg efter kaniner"
                />
                <Input
                    size="sm"
                    type="date"
                    label="Født efter"
                    value={activeFilters.bornAfterDate || ''}
                    onChange={(e) => onFilterChange({ bornAfterDate: e.target.value || null })}
                    placeholder="Vælg dato"
                />

                {/* Gruppe 1: Selektorer */}
                <EnumAutocomplete
                    enumType="Gender"
                    value={activeFilters.gender || null}
                    onChange={(value) => onFilterChange({ gender: value })}
                    label="Køn"
                />
                <EnumAutocomplete
                    enumType="Race"
                    value={activeFilters.race || null}
                    onChange={(value) => onFilterChange({ race: value })}
                    label="Race"
                />
                <EnumAutocomplete
                    enumType="Color"
                    value={activeFilters.color || null}
                    onChange={(value) => onFilterChange({ color: value })}
                    label="Farve"
                />
                <EnumLocalAutocomplete
                    enumType={RaceColorApproval}
                    value={activeFilters.raceColorApproval || null}
                    onChange={(value) => onFilterChange({ raceColorApproval: value })}
                    label="Godkendt race/farve"
                />

                {/* Divider for bedre visuel gruppering */}
                <div className="border-t border-zinc-700 my-2"></div>

                {/* Gruppe 2: Juvenile filter */}
                <Switch
                    size="sm"
                    isSelected={activeFilters.showJuveniles || false}
                    onValueChange={(checked) => onFilterChange({ showJuveniles: checked })}
                    aria-label="Vis kun ungdyr"
                >
                    Kun ungdyr
                </Switch>

                {/* Gruppe 3: Formål-filtre */}
                <Switch
                    size="sm"
                    isSelected={activeFilters.forSale || false}
                    onValueChange={(checked) => onFilterChange({ forSale: checked })}
                    aria-label="Vis kun til salg"
                >
                    Til Salg
                </Switch>
                <Switch
                    size="sm"
                    isSelected={activeFilters.isForBreeding || false}
                    onValueChange={(checked) => onFilterChange({ isForBreeding: checked })}
                    aria-label="Vis kun til avl"
                >
                    Til Avl
                </Switch>

                {/* Divider for at adskille død-filteret */}
                <div className="border-t border-zinc-700 my-2"></div>

                {/* Gruppe 4: Status-filtre */}
                <Switch
                    size="sm"
                    isSelected={activeFilters.showDeceased || false}
                    onValueChange={(checked) => onFilterChange({ showDeceased: checked })}
                    aria-label="Vis afdøde kaniner"
                >
                    Vis afdøde
                </Switch>
            </div>
        </SectionNav>
    );
}