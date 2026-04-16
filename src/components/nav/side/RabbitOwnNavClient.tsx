// src/components/nav/side/RabbitOwnNavClient.tsx
'use client';

import { Input, Switch, Button, Separator, Tooltip, Chip, Slider } from '@/components/ui/heroui';
import { useRouter } from 'next/navigation';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import { useState, useEffect, useCallback } from 'react';
import { useEnums, EnumType } from '@/contexts/EnumContext';
import { useTransferRequests } from "@/hooks/transferRequests/useTransferRequest";
import { useRabbitsOwnedStore } from '@/store/rabbitsOwnedStore';
import { ROUTES } from '@/constants/navigationConstants';

// Importer de nødvendige ikoner
import { MdCalendarMonth } from "react-icons/md";
import { LuRabbit } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RiAddCircleLine, RiExchangeLine, RiGenderlessLine } from "react-icons/ri";
import { FiArrowLeft } from 'react-icons/fi';
import { FaInfoCircle } from "react-icons/fa";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { SiMicrogenetics } from "react-icons/si";
import { GiHealthNormal } from "react-icons/gi";
import { PiSelectionPlus } from "react-icons/pi";
import { TbGrave2, TbPercentage } from "react-icons/tb";

// De enum typer der bruges i denne komponent
const REQUIRED_ENUMS: EnumType[] = ['Race', 'Color', 'Gender'];

// Konstanter til sektioner
const FILTER_SECTIONS = {
    ACTIONS: 'Handlinger',
    LIFESTATUS: 'Primære filtre',
    BASIC: 'Sekundære filtre',
    ATTRIBUTES: 'Egenskaber',
    STATUS: 'Status'
} as const;

const APPROVAL_STATUS = {
    ALL: 'all',
    APPROVED: 'approved',
    NOT_APPROVED: 'not_approved'
} as const;

export function RabbitOwnNavClient() {
    const router = useRouter();
    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);

    // Hent både received og load fra hooket
    const { received, load } = useTransferRequests();
    const pendingCount = received.filter(r => r.status === "Pending").length;

    // Kald load() når komponenten mountes
    useEffect(() => {
        load();
    }, [load]);

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

    // Hjælpefunktion til at konvertere raceColorApproval til approvalStatus string
    const getCurrentApprovalStatus = useCallback(() => {
        if (filters.raceColorApproval === null) return APPROVAL_STATUS.ALL;
        return filters.raceColorApproval === true ? APPROVAL_STATUS.APPROVED : APPROVAL_STATUS.NOT_APPROVED;
    }, [filters.raceColorApproval]);

    // Handler til approvalStatus radio
    const handleApprovalStatusChange = useCallback((value: string | boolean) => {
        let raceColorApproval: boolean | null = null;

        if (value === APPROVAL_STATUS.APPROVED) {
            raceColorApproval = true;
        } else if (value === APPROVAL_STATUS.NOT_APPROVED) {
            raceColorApproval = false;
        }

        updateFilters({ raceColorApproval });
    }, [updateFilters]);

    const [inbreedingRange, setInbreedingRange] = useState<[number, number]>([
        filters.inbreedingMin ?? 0,
        filters.inbreedingMax ?? 100,
    ]);

    useEffect(() => {
        setInbreedingRange([
            filters.inbreedingMin ?? 0,
            filters.inbreedingMax ?? 100,
        ]);
    }, [filters.inbreedingMin, filters.inbreedingMax]);

    return (
        <div className="w-full p-1 space-y-2">
            {/* Tilbage */}
            <button
                onClick={() => router.push(ROUTES.ACCOUNT.BASE)}
                className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
                <FiArrowLeft className="shrink-0" />
                Min side
            </button>

            <Separator className="divider my-0.5" />

            {/* Handlinger sektion */}
            <div>
                <h3 className="text-label mb-0.5">
                    {FILTER_SECTIONS.ACTIONS}
                </h3>

                <Button
                    variant="ghost"
                    fullWidth
                    size="sm"
                    className="justify-start"
                    onPress={() => router.push('/account/myRabbits/create')}
                >
                    <RiAddCircleLine className="text-lg" /> Opret ny kanin
                </Button>

                <Button
                    variant="ghost"
                    fullWidth
                    size="sm"
                    className="mt-2 justify-start relative"
                    onPress={() => router.push('/account/myRabbits/transferRequests')}
                >
                    <RiExchangeLine className="text-lg" /> Overførsels anmodninger
                    {pendingCount > 0 && (
                        <Chip
                            size="sm"
                            className="ml-auto mr-2"
                        >
                            {pendingCount}
                        </Chip>
                    )}
                </Button>
            </div>

            <Separator className="Separator my-0.5" />

            {/* Livsstatus sektion */}
            <div>
                <h3 className="text-label mb-0.5">
                    {FILTER_SECTIONS.LIFESTATUS}
                </h3>

                {/* Søgefelt */}
                <div className="flex items-center gap-1">
                    <div className="flex-1">
                        <Input
                            placeholder="Navn eller øremærke"
                            aria-label="Søg kanin"
                            value={filters.search}
                            onChange={(e) => updateFilters({ search: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 mt-2">
                    <div className="flex gap-2">
                        <Tooltip.Root>
                            <Tooltip.Trigger>
                                <Button
                                    size="sm"
                                    variant={filters.lifeStatus === false ? "primary" : "ghost"}
                                    onPress={() => setLifeStatusFilter('alive')}
                                    isIconOnly
                                    aria-label="Kun levende kaniner"
                                >
                                    <GiHealthNormal className="text-lg" />
                                </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content>Kun levende kaniner</Tooltip.Content>
                        </Tooltip.Root>
                        
                        <Tooltip.Root>
                            <Tooltip.Trigger>
                                <Button
                                    size="sm"
                                    variant={filters.lifeStatus === true ? "danger" : "ghost"}
                                    onPress={() => setLifeStatusFilter('deceased')}
                                    isIconOnly
                                    aria-label="Kun afdøde kaniner"
                                >
                                    <TbGrave2 className="text-lg" />
                                </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content>Kun afdøde kaniner</Tooltip.Content>
                        </Tooltip.Root>

                        <Tooltip.Root>
                            <Tooltip.Trigger>
                                <Button
                                    size="sm"
                                    variant={filters.lifeStatus === null ? "primary" : "ghost"}
                                    onPress={() => setLifeStatusFilter('all')}
                                    isIconOnly
                                    aria-label="Vis alle kaniner"
                                >
                                    <PiSelectionPlus className="text-lg" />
                                </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content>Vis alle kaniner</Tooltip.Content>
                        </Tooltip.Root>                        
                    </div>
                </div>
            </div>

            <Separator className="Separator my-0.5" />

            {/* Grundfiltre sektion */}
            <div>
                <h3 className="text-label mb-0.5">
                    {FILTER_SECTIONS.BASIC}
                </h3>

                <div className="space-y-1.5">
                    {/* Fødselsdag filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <MdCalendarMonth className="text-lg text-muted" />
                            <span className="text-label">Efter</span>
                        </div>
                        <div className="flex-1">
                            <Input
                                type="date"
                                aria-label="Født efter dato"
                                value={filters.bornAfterDate || ''}
                                onChange={(e) => updateFilters({ bornAfterDate: e.target.value || null })}
                            />
                        </div>
                    </div>

                    {/* Køn filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <RiGenderlessLine className="text-lg text-muted" />
                            <span className="text-label">Køn</span>
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
                            <LuRabbit className="text-lg text-muted" />
                            <span className="text-label">Race</span>
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
                            <IoColorPaletteOutline className="text-lg text-muted" />
                            <span className="text-label">Farve</span>
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

            <Separator className="Separator my-0.5" />

            {/* Egenskaber sektion */}
            <div>
                <h3 className="text-label mb-0.5">
                    {FILTER_SECTIONS.ATTRIBUTES}
                </h3>

                <div className="space-y-1.5">
                    {/* Race/farve godkendelse */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <SiMicrogenetics className="text-lg text-muted" />
                            <span className="text-label">Race/farve godkendelse</span>
                        </div>

                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant={getCurrentApprovalStatus() === APPROVAL_STATUS.ALL ? "primary" : "ghost"}
                                onPress={() => handleApprovalStatusChange(APPROVAL_STATUS.ALL)}
                                className="flex-1 text-xs"
                            >
                                Alle
                            </Button>
                            <Button
                                size="sm"
                                variant={getCurrentApprovalStatus() === APPROVAL_STATUS.APPROVED ? "primary" : "ghost"}
                                onPress={() => handleApprovalStatusChange(APPROVAL_STATUS.APPROVED)}
                                className="flex-1 text-xs"
                            >
                                Godkendte
                            </Button>
                            <Button
                                size="sm"
                                variant={getCurrentApprovalStatus() === APPROVAL_STATUS.NOT_APPROVED ? "danger" : "ghost"}
                                onPress={() => handleApprovalStatusChange(APPROVAL_STATUS.NOT_APPROVED)}
                                className="flex-1 text-xs"
                            >
                                Ikke
                            </Button>
                        </div>
                    </div>

                    {/* Indavl range filter */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <TbPercentage className="text-base text-muted" />
                                <span className="text-label">Indavl</span>
                            </div>
                            <span className="text-xs text-muted">
                                {inbreedingRange[0]}% – {inbreedingRange[1]}%
                            </span>
                        </div>
                        <Slider
                            value={inbreedingRange}
                            onChange={(v) => setInbreedingRange(v as [number, number])}
                            onChangeEnd={(v) => {
                                const [min, max] = v as [number, number];
                                updateFilters({
                                    inbreedingMin: min === 0 ? null : min,
                                    inbreedingMax: max === 100 ? null : max,
                                });
                            }}
                            minValue={0}
                            maxValue={100}
                            step={1}
                            aria-label="Indavlskoefficient interval"
                        >
                            <Slider.Track>
                                {({ state }) => (
                                    <>
                                        <Slider.Fill />
                                        {state.values.map((_, i) => (
                                            <Slider.Thumb key={i} index={i} />
                                        ))}
                                    </>
                                )}
                            </Slider.Track>
                        </Slider>
                    </div>

                    {/* Ungdyr switch */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <FaInfoCircle className="text-lg text-muted" />
                            <span className="text-label">Konkurrence</span>
                        </div>
                        <div className="flex-1 flex items-center">
                            <Switch
                                size="sm"
                                isSelected={filters.showJuveniles}
                                onChange={(checked) => updateFilters({ showJuveniles: checked })}
                                aria-label="Ungdyr gruppe-M"
                            >
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <span className="text-xs">Ungdyr gruppe-M</span>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="Separator my-0.5" />

            {/* Status sektion */}
            <div>
                <h3 className="text-label mb-0.5">
                    {FILTER_SECTIONS.STATUS}
                </h3>

                <div className="space-y-1.5">
                    {/* Til salg filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <BiPurchaseTagAlt className="text-lg text-muted" />
                            <span className="text-label">Til salg</span>
                        </div>
                        <div className="flex-1 flex items-center">
                            <Switch
                                size="sm"
                                isSelected={filters.forSale}
                                onChange={(checked) => updateFilters({ forSale: checked })}
                                aria-label="Vis kun til salg"
                            >
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <span className="text-xs">Ja</span>
                            </Switch>
                        </div>
                    </div>

                    {/* Til avl filter */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <BiPurchaseTagAlt className="text-lg text-muted" />
                            <span className="text-label">Til avl</span>
                        </div>
                        <div className="flex-1 flex items-center">
                            <Switch
                                size="sm"
                                isSelected={filters.isForBreeding}
                                onChange={(checked) => updateFilters({ isForBreeding: checked })}
                                aria-label="Vis kun til avl"
                            >
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <span className="text-xs">Ja</span>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
