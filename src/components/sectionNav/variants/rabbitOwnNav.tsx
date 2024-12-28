'use client';
import { Input, Switch } from "@nextui-org/react";
import SectionNav from '../base/baseSideNav';
import { useRouter } from 'next/navigation';
import { PiRabbitFill } from "react-icons/pi";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { OwnFilters } from '@/hooks/rabbits/useRabbitOwnFilter';

interface Props {
    activeFilters: OwnFilters;
    onFilterChange: (filters: Partial<OwnFilters>) => void;
}

export default function OwnNav({ activeFilters, onFilterChange }: Props) {
    const router = useRouter();

    return (
        <SectionNav
            title="Mine Kaniner"
            actions={[
                {
                    label: (
                        <>
                            <PiRabbitFill className="mr-2" />
                            Opret kanin
                        </>
                    ),
                    onClick: () => router.push('/rabbits/create'),
                    color: "success",
                    className: "text-white"
                }
            ]}
        >
            <div className="flex flex-col gap-4">
                <Input
                    value={activeFilters.search}
                    onChange={(e) => onFilterChange({ search: e.target.value })}
                    placeholder="Søg efter navn, øremærke eller race..."
                    aria-label="Søg efter kaniner"
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
                <Switch
                    isSelected={activeFilters.ForSale}
                    onValueChange={(checked) => onFilterChange({ ForSale: checked })}
                    aria-label="Vis kun til salg"
                >
                    Til Salg
                </Switch>

                <Switch
                    isSelected={activeFilters.ForBreeding}
                    onValueChange={(checked) => onFilterChange({ ForBreeding: checked })}
                    aria-label="Vis kun til avl"
                >
                    Til Avl
                </Switch>

                <Switch
                    isSelected={activeFilters.showDeceased}
                    onValueChange={(checked) => onFilterChange({ showDeceased: checked })}
                    aria-label="Vis afdøde kaniner"
                >
                    Vis afdøde
                </Switch>
            </div>
        </SectionNav>
    );
}