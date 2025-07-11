'use client';
import { Input, Switch, Button, Divider, RadioGroup, Radio } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { MdAdd, MdFilterList, MdCalendarMonth } from "react-icons/md";
import { LuRabbit } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RiGenderlessLine } from "react-icons/ri";
import { FaInfoCircle, FaRegStar } from "react-icons/fa";
import { TbStatusChange } from "react-icons/tb";
import { BiPurchaseTagAlt } from "react-icons/bi";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useState, useEffect, useCallback } from 'react';
import { useEnums, RabbitEnum } from '@/contexts/EnumContext';
import { useRabbitsOwnedStore } from '@/store/rabbitsOwnedStore';

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

// Ingen props længere - alt hentes fra storen
export function RabbitOwnNavClient() {
    const router = useRouter();
    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);
    
    // Hent alt fra storen
    const {
        filters,
        updateFilters,
        setLifeStatusFilter
    } = useRabbitsOwnedStore();

    // Load enums når komponenten mounter
    useEffect(() => {
        if (!enumsLoaded) {
            getMultipleEnumValues(REQUIRED_ENUMS)
                .then(() => setEnumsLoaded(true))
                .catch(error => console.error('Error loading OwnNav enums:', error));
        }
    }, [getMultipleEnumValues, enumsLoaded]);

    // Hjælpefunktion til at konvertere lifeStatus til string
    const getCurrentLifeStatus = useCallback(() => {
        if (filters.lifeStatus === null) return LIFE_STATUS.ALL;
        return filters.lifeStatus === true ? LIFE_STATUS.DECEASED : LIFE_STATUS.ALIVE;
    }, [filters.lifeStatus]);

    // Hjælpefunktion til at konvertere raceColorApproval til approvalStatus string
    const getCurrentApprovalStatus = useCallback(() => {
        if (filters.raceColorApproval === null) return APPROVAL_STATUS.ALL;
        return filters.raceColorApproval === 'Approved' ? APPROVAL_STATUS.APPROVED : APPROVAL_STATUS.NOT_APPROVED;
    }, [filters.raceColorApproval]);

    // Handler til approvalStatus radio
    const handleApprovalStatusChange = useCallback((value: string) => {
        let raceColorApproval: string | null = null;

        if (value === APPROVAL_STATUS.APPROVED) {
            raceColorApproval = 'Approved';
        } else if (value === APPROVAL_STATUS.NOT_APPROVED) {
            raceColorApproval = 'NotApproved';
        }

        updateFilters({ raceColorApproval });
    }, [updateFilters]);

    return (
        <div className="w-full p-1 space-y-2">
            {/* Handlinger sektion */}
            <div>
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

            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Grundfiltre sektion */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.BASIC}
                </h3>

                <div className="space-y-1.5">
                    {/* Søgefelt */}
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
                                onChange={(e) => updateFilters({ search: e.target.value })}
                                classNames={{
                                    inputWrapper: "h-7 min-h-unit-7 px-2",
                                    input: "text-xs"
                                }}
                            />
                        </div>
                    </div>

                    {/* Fødselsdag filter */}
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
                                onChange={(e) => updateFilters({ bornAfterDate: e.target.value || null })}
                                classNames={{
                                    inputWrapper: "h-7 min-h-unit-7 px-2",
                                    input: "text-xs"
                                }}
                            />
                        </div>
                    </div>

                    {/* Køn filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <RiGenderlessLine className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Køn</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Gender"
                                value={filters.gender}
                                onChange={(value) => updateFilters({ gender: value })}
                                label="Køn"
                            />
                        </div>
                    </div>

                    {/* Race filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <LuRabbit className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Race</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Race"
                                value={filters.race}
                                onChange={(value) => updateFilters({ race: value })}
                                label="Race"
                            />
                        </div>
                    </div>

                    {/* Farve filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <IoColorPaletteOutline className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Farve</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Color"
                                value={filters.color}
                                onChange={(value) => updateFilters({ color: value })}
                                label="Farve"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Egenskaber sektion */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.ATTRIBUTES}
                </h3>

                <div className="space-y-1.5">
                    {/* Race/farve godkendelse */}
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

                    {/* Ungdyr switch */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <FaInfoCircle className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Alder</span>
                        </div>
                        <div className="flex-1 flex items-center">
                            <Switch
                                size="sm"
                                isSelected={filters.showJuveniles}
                                onValueChange={(checked) => updateFilters({ showJuveniles: checked })}
                                aria-label="Vis kun ungdyr"
                            >
                                <span className="text-xs">Kun ungdyr</span>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>

            <Divider className="bg-zinc-200/5 my-0.5" />

            {/* Status sektion */}
            <div>
                <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
                    {FILTER_SECTIONS.STATUS}
                </h3>

                <div className="space-y-1.5">
                    {/* Til salg filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <BiPurchaseTagAlt className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Til salg</span>
                        </div>
                        <div className="flex-1 flex items-center">
                            <Switch
                                size="sm"
                                isSelected={filters.forSale}
                                onValueChange={(checked) => updateFilters({ forSale: checked })}
                                aria-label="Vis kun til salg"
                            >
                                <span className="text-xs">Ja</span>
                            </Switch>
                        </div>
                    </div>

                    {/* Til avl filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <BiPurchaseTagAlt className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Til avl</span>
                        </div>
                        <div className="flex-1 flex items-center">
                            <Switch
                                size="sm"
                                isSelected={filters.isForBreeding}
                                onValueChange={(checked) => updateFilters({ isForBreeding: checked })}
                                aria-label="Vis kun til avl"
                            >
                                <span className="text-xs">Ja</span>
                            </Switch>
                        </div>
                    </div>

                    {/* Afdøde filter */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <TbStatusChange className="text-lg text-default-500" />
                            <span className="text-xs font-medium">Status</span>
                        </div>
                        
                        <RadioGroup
                            orientation="horizontal"
                            size="sm"
                            value={getCurrentLifeStatus()}
                            onValueChange={(value) => setLifeStatusFilter(value as 'all' | 'alive' | 'deceased')}
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