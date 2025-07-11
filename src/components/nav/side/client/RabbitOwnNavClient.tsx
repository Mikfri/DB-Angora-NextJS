'use client';
import { Input, Switch, Button, Divider, RadioGroup, Radio } from "@heroui/react"; // Tilføjet RadioGroup og Radio
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
import { useState, useEffect, useCallback } from 'react';
import { useEnums, RabbitEnum } from '@/contexts/EnumContext';

interface RabbitOwnNavClientProps {
    activeFilters: OwnFilters;
    onFilterChange: (filters: Partial<OwnFilters>) => void;
    setLifeStatusFilter?: (status: 'all' | 'alive' | 'deceased') => void; // Tilføj denne
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

// Definér konstanter til RadioGroup værdier
const LIFE_STATUS = {
    ALL: 'all',
    ALIVE: 'alive',
    DECEASED: 'deceased'
} as const;

const APPROVAL_STATUS = {
    ALL: 'all',
    APPROVED: 'approved',
    NOT_APPROVED: 'notApproved'
} as const;

export function RabbitOwnNavClient({
    activeFilters = {},
    onFilterChange,
    setLifeStatusFilter
}: RabbitOwnNavClientProps) {
    const router = useRouter();
    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);

    // Load enums når komponenten mounter
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
        onFilterChange(updates);
    }, [onFilterChange]);

    // Hjælpefunktion til at konvertere showDeceased til lifeStatus string
    const getCurrentLifeStatus = useCallback(() => {
        if (activeFilters.lifeStatus === null) return LIFE_STATUS.ALL;
        return activeFilters.lifeStatus === true ? LIFE_STATUS.DECEASED : LIFE_STATUS.ALIVE;
    }, [activeFilters.lifeStatus]);

    // Hjælpefunktion til at konvertere raceColorApproval til approvalStatus string
    const getCurrentApprovalStatus = useCallback(() => {
        if (activeFilters.raceColorApproval === null) return APPROVAL_STATUS.ALL;
        return activeFilters.raceColorApproval === 'Approved' ? APPROVAL_STATUS.APPROVED : APPROVAL_STATUS.NOT_APPROVED;
    }, [activeFilters.raceColorApproval]);

    // Handler til lifeStatus radio
    const handleLifeStatusChange = useCallback((value: string) => {
        if (setLifeStatusFilter) {
            setLifeStatusFilter(value as 'all' | 'alive' | 'deceased');
        } else {
            console.warn('setLifeStatusFilter ikke tilgængelig. Dette bør ikke ske!');
        }
    }, [setLifeStatusFilter]);

    // Handler til approvalStatus radio
    const handleApprovalStatusChange = useCallback((value: string) => {
        let raceColorApproval: string | null = null;

        if (value === APPROVAL_STATUS.APPROVED) {
            raceColorApproval = 'Approved';
        } else if (value === APPROVAL_STATUS.NOT_APPROVED) {
            raceColorApproval = 'NotApproved';
        }

        handleFilterChange({ raceColorApproval });
    }, [handleFilterChange]);

    // Sikre værdier fra activeFilters
    const filters = {
        search: activeFilters?.search || '',
        gender: activeFilters?.gender || null,
        race: activeFilters?.race || null,
        color: activeFilters?.color || null,
        forSale: Boolean(activeFilters?.forSale),
        isForBreeding: Boolean(activeFilters?.isForBreeding),
        lifeStatus: activeFilters?.lifeStatus, // Ikke kald Boolean her, vi vil beholde null
        showJuveniles: Boolean(activeFilters?.showJuveniles),
        raceColorApproval: activeFilters?.raceColorApproval || null,
        bornAfterDate: activeFilters?.bornAfterDate || null
    };

    return (
        <div className="w-full p-1 space-y-2"> {/* Reduceret yderligere padding og spacing */}
            {/* Handlinger sektion - kompakt styling */}
            <div>
                {/* Opdateret overskriftstil med mindre margin */}
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.ACTIONS}
                </h3>

                <Button
                    color="success"
                    variant="flat"
                    fullWidth
                    size="sm"
                    startContent={<MdAdd />}
                    onPress={() => router.push('/account/myRabbits/create')}
                >
                    Opret ny kanin
                </Button>
            </div>

            {/* Divider med minimal spacing */}
            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Grundfiltre sektion - mere kompakt */}
            <div>
                {/* Opdateret overskriftstil */}
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.BASIC}
                </h3>

                <div className="space-y-1.5"> {/* Reduceret spacing */}
                    {/* Søgefelt - mere kompakt */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <MdFilterList className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Søg</span>
                        </div>
                        <div className="flex-1">
                            <Input
                                size="sm"
                                placeholder="Navn eller øremærke"
                                value={filters.search}
                                onChange={(e) => handleFilterChange({ search: e.target.value })}
                                classNames={{
                                    inputWrapper: "h-7 min-h-unit-7 px-2",
                                    input: "text-xs"
                                }}
                            />
                        </div>
                    </div>

                    {/* Fødselsdag filter - mere kompakt */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <MdCalendarMonth className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Efter</span>
                        </div>
                        <div className="flex-1">
                            <Input
                                size="sm"
                                type="date"
                                value={filters.bornAfterDate || ''}
                                onChange={(e) => handleFilterChange({ bornAfterDate: e.target.value || null })}
                                classNames={{
                                    inputWrapper: "h-7 min-h-unit-7 px-2",
                                    input: "text-xs"
                                }}
                            />
                        </div>
                    </div>

                    {/* Køn filter - mere kompakt */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <RiGenderlessLine className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Køn</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Gender"
                                value={filters.gender}
                                onChange={(value) => handleFilterChange({ gender: value })}
                                label="Køn"
                            />
                        </div>
                    </div>

                    {/* Race filter - mere kompakt */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <LuRabbit className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Race</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Race"
                                value={filters.race}
                                onChange={(value) => handleFilterChange({ race: value })}
                                label="Race"
                            />
                        </div>
                    </div>

                    {/* Farve filter - mere kompakt */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <IoColorPaletteOutline className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Farve</span>
                        </div>
                        <div className="flex-1">
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

            {/* Divider med minimal spacing */}
            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Egenskaber sektion - mere kompakt */}
            <div>
                {/* Opdateret overskriftstil */}
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.ATTRIBUTES}
                </h3>

                <div className="space-y-1.5"> {/* Reduceret spacing */}
                    {/* Race/farve godkendelse - ændret til RadioGroup */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <FaRegStar className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Race/farve godkendelse</span>
                        </div>

                        <RadioGroup
                            orientation="horizontal"
                            size="sm"
                            value={getCurrentApprovalStatus()}
                            onValueChange={handleApprovalStatusChange}
                            classNames={{
                                wrapper: "gap-1",
                            }}
                        >
                            <Radio value={APPROVAL_STATUS.ALL}>
                                <span className="text-xs">Alle</span>
                            </Radio>
                            <Radio value={APPROVAL_STATUS.APPROVED}>
                                <span className="text-xs">Godkendte</span>
                            </Radio>
                            <Radio value={APPROVAL_STATUS.NOT_APPROVED}>
                                <span className="text-xs">Ikke godkendte</span>
                            </Radio>
                        </RadioGroup>
                    </div>

                    {/* Ungdyr switch - mere kompakt */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <FaInfoCircle className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Alder</span>
                        </div>
                        <div className="flex-1 flex items-center">
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

            {/* Divider med minimal spacing */}
            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Status sektion - mere kompakt */}
            <div>
                {/* Opdateret overskriftstil */}
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.STATUS}
                </h3>

                <div className="space-y-1.5"> {/* Reduceret spacing */}
                    {/* Til salg filter - mere kompakt */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <BiPurchaseTagAlt className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Til salg</span>
                        </div>
                        <div className="flex-1 flex items-center">
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

                    {/* Til avl filter - mere kompakt */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <BiPurchaseTagAlt className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Til avl</span>
                        </div>
                        <div className="flex-1 flex items-center">
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

                    {/* Afdøde filter - ændret til RadioGroup */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <TbStatusChange className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Status</span>
                        </div>

                        <RadioGroup
                            orientation="horizontal"
                            size="sm"
                            value={getCurrentLifeStatus()}
                            onValueChange={handleLifeStatusChange}
                            classNames={{
                                wrapper: "gap-1",
                            }}
                        >
                            <Radio value={LIFE_STATUS.ALL}>
                                <span className="text-xs">Alle</span>
                            </Radio>
                            <Radio value={LIFE_STATUS.ALIVE}>
                                <span className="text-xs">Kun levende</span>
                            </Radio>
                            <Radio value={LIFE_STATUS.DECEASED}>
                                <span className="text-xs">Kun afdøde</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}