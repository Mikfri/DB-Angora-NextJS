'use client';
import { Input, Switch, Button, Divider } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { MdAdd, MdFilterList, MdCalendarMonth } from "react-icons/md";
import { LuRabbit } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RiGenderlessLine } from "react-icons/ri";
import { FaInfoCircle, FaRegStar } from "react-icons/fa";
import { TbStatusChange } from "react-icons/tb";
import { BiPurchaseTagAlt } from "react-icons/bi";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { OwnFilters } from '@/api/types/filterTypes';
import EnumLocalAutocomplete, { RaceColorApproval } from "@/components/enumHandlers/enumLocalAutocomplete";
import { useState, useEffect, useCallback } from 'react';
import { useEnums, RabbitEnum } from '@/contexts/EnumContext';

interface RabbitOwnNavClientProps {
    activeFilters: OwnFilters;
    onFilterChange: (filters: Partial<OwnFilters>) => void;
}

// De enum typer der bruges i denne komponent
const REQUIRED_ENUMS: RabbitEnum[] = ['Race', 'Color', 'Gender'];

// Konstanter til sektioner
const FILTER_SECTIONS = {
    ACTIONS: 'Handlinger',
    BASIC: 'Grundfiltre',
    ATTRIBUTES: 'Egenskaber',
    STATUS: 'Status'
} as const;

export function RabbitOwnNavClient({ 
    activeFilters = {}, 
    onFilterChange 
}: RabbitOwnNavClientProps) {
    const router = useRouter();
    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);

    // Load enums när komponenten mounter
    useEffect(() => {
        if (!enumsLoaded) {
            getMultipleEnumValues(REQUIRED_ENUMS)
                .then(() => setEnumsLoaded(true))
                .catch(error => console.error('Error loading OwnNav enums:', error));
        }
    }, [getMultipleEnumValues, enumsLoaded]);

    // Typestærk handler til filteropdateringer
    const handleFilterChange = useCallback((updates: Partial<OwnFilters>) => {
        console.log("RabbitOwnNavClient - Sending filter update:", updates);
        
        // Sikrer os at boolske værdier er faktisk booleans
        const processedUpdates = { ...updates };
        
        if ('forSale' in updates) {
            processedUpdates.forSale = Boolean(updates.forSale);
        }
        if ('isForBreeding' in updates) {
            processedUpdates.isForBreeding = Boolean(updates.isForBreeding);
        }
        if ('showDeceased' in updates) {
            processedUpdates.showDeceased = Boolean(updates.showDeceased);
        }
        if ('showJuveniles' in updates) {
            processedUpdates.showJuveniles = Boolean(updates.showJuveniles);
        }
        
        onFilterChange(processedUpdates);
    }, [onFilterChange]);
    
    // Sikre værdier fra activeFilters
    const filters = {
        search: activeFilters?.search || '',
        gender: activeFilters?.gender || null,
        race: activeFilters?.race || null,
        color: activeFilters?.color || null,
        forSale: Boolean(activeFilters?.forSale),
        isForBreeding: Boolean(activeFilters?.isForBreeding),
        showDeceased: Boolean(activeFilters?.showDeceased),
        showJuveniles: Boolean(activeFilters?.showJuveniles),
        raceColorApproval: activeFilters?.raceColorApproval || null,
        bornAfterDate: activeFilters?.bornAfterDate || null
    };

    return (
        <div className="w-full p-2 space-y-3">
            {/* Handlinger sektion - opdateret styling */}
            <div>
                {/* Opdateret overskriftstil med mindre margin */}
                <h3 className="text-[13px] font-medium text-zinc-400 mb-2">
                    {FILTER_SECTIONS.ACTIONS}
                </h3>

                <Button
                    color="success"
                    variant="flat"
                    fullWidth
                    startContent={<MdAdd />}
                    onPress={() => router.push('/account/myRabbits/create')}
                >
                    Opret ny kanin
                </Button>
            </div>

            {/* Divider mellem sektioner med konsistent styling */}
            <div className="pt-1">
                <Divider className="bg-zinc-200/5" />
            </div>

            {/* Grundfiltre sektion - med mindre spacing til divider ovenover */}
            <div className="pt-1.5">
                {/* Opdateret overskriftstil */}
                <h3 className="text-[13px] font-medium text-zinc-400 mb-2">
                    {FILTER_SECTIONS.BASIC}
                </h3>

                <div className="space-y-3">
                    {/* Søgefelt */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <MdFilterList className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Søg</span>
                        </div>
                        <div className="w-2/3">
                            <Input
                                size="sm"
                                placeholder="Navn eller øremærke"
                                value={filters.search}
                                onChange={(e) => handleFilterChange({ search: e.target.value })}
                                classNames={{
                                    inputWrapper: "h-7 min-h-unit-7 cursor-text",
                                    input: "text-sm cursor-text"
                                }}
                            />
                        </div>
                    </div>

                    {/* Fødselsdag filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <MdCalendarMonth className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Født efter</span>
                        </div>
                        <div className="w-2/3">
                            <Input
                                size="sm"
                                type="date"
                                value={filters.bornAfterDate || ''}
                                onChange={(e) => handleFilterChange({ bornAfterDate: e.target.value || null })}
                                classNames={{
                                    inputWrapper: "h-7 min-h-unit-7",
                                    input: "text-sm"
                                }}
                            />
                        </div>
                    </div>

                    {/* Køn filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <RiGenderlessLine className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Køn</span>
                        </div>
                        <div className="w-2/3">
                            <EnumAutocomplete
                                enumType="Gender"
                                value={filters.gender}
                                onChange={(value) => handleFilterChange({ gender: value })}
                                label="Køn"
                            />
                        </div>
                    </div>

                    {/* Race filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <LuRabbit className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Race</span>
                        </div>
                        <div className="w-2/3">
                            <EnumAutocomplete
                                enumType="Race"
                                value={filters.race}
                                onChange={(value) => handleFilterChange({ race: value })}
                                label="Race"
                            />
                        </div>
                    </div>

                    {/* Farve filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <IoColorPaletteOutline className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Farve</span>
                        </div>
                        <div className="w-2/3">
                            <EnumAutocomplete
                                enumType="Color"
                                value={filters.color}
                                onChange={(value) => handleFilterChange({ color: value })}
                                label="Farve"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider mellem sektioner med konsistent styling */}
            <div className="pt-1">
                <Divider className="bg-zinc-200/5" />
            </div>

            {/* Egenskaber sektion - med mindre spacing til divider ovenover */}
            <div className="pt-1.5">
                {/* Opdateret overskriftstil */}
                <h3 className="text-[13px] font-medium text-zinc-400 mb-2">
                    {FILTER_SECTIONS.ATTRIBUTES}
                </h3>

                <div className="space-y-3">
                    {/* Race/farve godkendelse */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <FaRegStar className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Godkendt</span>
                        </div>
                        <div className="w-2/3">
                            <EnumLocalAutocomplete
                                enumType={RaceColorApproval}
                                value={filters.raceColorApproval}
                                onChange={(value) => handleFilterChange({ raceColorApproval: value })}
                                label="Godkendelse"
                            />
                        </div>
                    </div>

                    {/* Ungdyr switch */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <FaInfoCircle className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Aldersgruppe</span>
                        </div>
                        <div className="w-2/3 flex items-center">
                            <Switch
                                size="sm"
                                isSelected={filters.showJuveniles}
                                onValueChange={(checked) => handleFilterChange({ showJuveniles: checked })}
                                aria-label="Vis kun ungdyr"
                            >
                                <span className="text-xs">Kun ungdyr</span>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider mellem sektioner med konsistent styling */}
            <div className="pt-1">
                <Divider className="bg-zinc-200/5" />
            </div>

            {/* Status sektion - med mindre spacing til divider ovenover */}
            <div className="pt-1.5">
                {/* Opdateret overskriftstil */}
                <h3 className="text-[13px] font-medium text-zinc-400 mb-2">
                    {FILTER_SECTIONS.STATUS}
                </h3>

                <div className="space-y-3">
                    {/* Til salg filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <BiPurchaseTagAlt className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Til salg</span>
                        </div>
                        <div className="w-2/3 flex items-center">
                            <Switch
                                size="sm"
                                isSelected={filters.forSale}
                                onValueChange={(checked) => handleFilterChange({ forSale: checked })}
                                aria-label="Vis kun til salg"
                            >
                                <span className="text-xs">Ja</span>
                            </Switch>
                        </div>
                    </div>

                    {/* Til avl filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <BiPurchaseTagAlt className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Til avl</span>
                        </div>
                        <div className="w-2/3 flex items-center">
                            <Switch
                                size="sm"
                                isSelected={filters.isForBreeding}
                                onValueChange={(checked) => handleFilterChange({ isForBreeding: checked })}
                                aria-label="Vis kun til avl"
                            >
                                <span className="text-xs">Ja</span>
                            </Switch>
                        </div>
                    </div>


                    {/* Afdøde filter */}
                    <div className="flex items-center">
                        <div className="w-1/3 flex items-center gap-2">
                            <TbStatusChange className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Status</span>
                        </div>
                        <div className="w-2/3 flex items-center">
                            <Switch
                                size="sm"
                                isSelected={filters.showDeceased}
                                onValueChange={(checked) => handleFilterChange({ showDeceased: checked })}
                                className="ml-1"
                            >
                                <span className="text-xs">Vis afdøde</span>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}