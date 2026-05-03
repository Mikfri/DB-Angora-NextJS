// src/components/nav/side/SaleRawWoolNavClient.tsx
'use client';

import { Input, Button, Separator, Switch } from '@/components/ui/heroui';
import { useState, useEffect, memo } from 'react';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import EnumLocalAutocomplete from '@/components/ui/custom/autocomplete/EnumLocalAutocomplete';
import { useEnums, EnumType } from '@/contexts/EnumContext';
import { useRawWoolFilters } from '@/store/saleRawWoolFilterStore';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/navigationConstants';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineLocationOn, MdSort } from 'react-icons/md';
import { FiArrowLeft } from 'react-icons/fi';
import { FaTruck } from 'react-icons/fa';
import { GiWool } from 'react-icons/gi';
import { LuRuler, LuWeight } from 'react-icons/lu';
import { PriceRangeSlider } from '@/components/ui/custom/range';

const REQUIRED_ENUMS: EnumType[] = ['WoolFiberType', 'WoolNaturalColor'];

const SORT_ENUM: Record<string, string> = {
    'Newest':     'Nyeste først',
    'MostViewed': 'Mest sete',
};

const FILTER_SECTIONS = {
    WOOL:     'Rå uld filtre',
    SHIPPING: 'Sending',
    PRICE:    'Pris (kr.)',
    LOCATION: 'Lokation',
} as const;

export const SaleRawWoolNavClient = memo(function SaleRawWoolNavClient() {
    const router = useRouter();
    const {
        filters,
        updateFilter,
        clearFilter,
        clearAllFilters,
        applyFilters,
        syncFiltersWithUrl,
    } = useRawWoolFilters();

    const { getMultipleEnumValues } = useEnums();
    const [enumsLoaded, setEnumsLoaded] = useState(false);

    useEffect(() => {
        syncFiltersWithUrl();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (enumsLoaded) return;
        const loadEnums = async () => {
            try {
                await getMultipleEnumValues(REQUIRED_ENUMS);
                setEnumsLoaded(true);
            } catch (error) {
                console.error('Error loading SaleRawWoolNav enums:', error);
            }
        };
        loadEnums();
    }, [getMultipleEnumValues, enumsLoaded]);

    const [priceRange, setPriceRange] = useState<[number, number]>([
        filters.minPrice ?? 0,
        filters.maxPrice ?? 5000,
    ]);

    useEffect(() => {
        setPriceRange([filters.minPrice ?? 0, filters.maxPrice ?? 5000]);
    }, [filters.minPrice, filters.maxPrice]);

    const hasActiveFilters = Object.values(filters).some(
        value => value !== undefined && value !== null && value !== ''
    );

    return (
        <div className="w-full p-1 space-y-2">
            {/* Tilbage */}
            <button
                onClick={() => router.push(ROUTES.SALE.BASE)}
                className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
                <FiArrowLeft className="shrink-0" />
                Annoncer
            </button>

            <Separator className="divider my-0.5" />

            {/* Filtre header + nulstil */}
            <div className="flex justify-between items-center">
                <h3 className="text-label">Filtre</h3>
                {hasActiveFilters && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 text-xs text-muted hover:text-foreground"
                        onPress={clearAllFilters}
                    >
                        Nulstil alle
                    </Button>
                )}
            </div>

            <Button variant="primary" fullWidth size="sm" onPress={applyFilters}>
                Søg
            </Button>

            <Separator className="divider my-0.5" />

            {/* Sortering */}
            <div className="flex items-center gap-1">
                <div className="flex items-center gap-1.5 min-w-17.5">
                    <MdSort className="text-lg text-muted" />
                    <span className="text-label">Sortér</span>
                </div>
                <div className="flex-1">
                    <EnumLocalAutocomplete
                        enumType={SORT_ENUM}
                        value={filters.sortBy ?? null}
                        onChange={(v) => updateFilter('sortBy', v || null)}
                        label="Sortering"
                        id="rawwool-sortering"
                    />
                </div>
            </div>

            {/* Sending */}
            <div className="flex items-center gap-1">
                <div className="flex items-center gap-1.5 min-w-17.5">
                    <FaTruck className="text-lg text-muted" />
                    <span className="text-label">{FILTER_SECTIONS.SHIPPING}</span>
                </div>
                <div className="flex-1">
                    <Switch
                        size="sm"
                        isSelected={filters.canBeShipped === true}
                        onChange={(v) => updateFilter('canBeShipped', v || null)}
                        aria-label="Kan sendes"
                    >
                        <Switch.Control><Switch.Thumb /></Switch.Control>
                        <span className="text-sm text-muted">
                            {filters.canBeShipped ? 'Kan sendes' : 'Alle'}
                        </span>
                    </Switch>
                </div>
            </div>

            {/* Pris */}
            <PriceRangeSlider
                label={FILTER_SECTIONS.PRICE}
                value={priceRange}
                onChange={setPriceRange}
                onChangeEnd={([min, max]) => {
                    updateFilter('minPrice', min === 0 ? null : min);
                    updateFilter('maxPrice', max === 5000 ? null : max);
                }}
            />

            {/* Lokation */}
            <div>
                <h3 className="text-label mb-1 flex items-center gap-1.5">
                    <MdOutlineLocationOn className="text-lg text-muted" />
                    {FILTER_SECTIONS.LOCATION}
                </h3>
                <div className="mb-1.5 flex items-center gap-1">
                    <div className="flex-1">
                        <Input
                            placeholder="By..."
                            value={filters.city ?? ''}
                            onChange={(e) => updateFilter('city', e.target.value || null)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        />
                    </div>
                    {!!filters.city && (
                        <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                            onPress={() => clearFilter('city')}>
                            <IoMdClose />
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            type="number"
                            placeholder="Min postnr"
                            min={1000}
                            max={9999}
                            value={filters.minZipCode?.toString() ?? ''}
                            onChange={(e) => updateFilter('minZipCode', e.target.value ? parseInt(e.target.value) : null)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            fullWidth
                        />
                        {!!filters.minZipCode && (
                            <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                onPress={() => clearFilter('minZipCode')}>
                                <IoMdClose />
                            </Button>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input
                            type="number"
                            placeholder="Max postnr"
                            min={1000}
                            max={9999}
                            value={filters.maxZipCode?.toString() ?? ''}
                            onChange={(e) => updateFilter('maxZipCode', e.target.value ? parseInt(e.target.value) : null)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            fullWidth
                        />
                        {!!filters.maxZipCode && (
                            <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                onPress={() => clearFilter('maxZipCode')}>
                                <IoMdClose />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Separator className="divider my-0.5" />

            {/* Rå uld filtre */}
            <div>
                <h3 className="text-label mb-0.5">{FILTER_SECTIONS.WOOL}</h3>
                <div className="space-y-1.5">

                    {/* Fibertype */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-17.5">
                            <GiWool className="text-lg text-muted" />
                            <span className="text-label">Fiber</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="WoolFiberType"
                                value={filters.fiberType ?? null}
                                onChange={(v) => updateFilter('fiberType', v ?? undefined)}
                                label="Fibertype"
                            />
                        </div>
                    </div>

                    {/* Naturlig farve */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-17.5">
                            <GiWool className="text-lg text-muted" />
                            <span className="text-label">Farve</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="WoolNaturalColor"
                                value={filters.naturalColor ?? null}
                                onChange={(v) => updateFilter('naturalColor', v ?? undefined)}
                                label="Naturlig farve"
                            />
                        </div>
                    </div>

                    {/* Fiberlængde (cm) */}
                    <div>
                        <h4 className="text-label mb-1 flex items-center gap-1.5">
                            <LuRuler className="text-lg text-muted" />
                            Fiberlængde (cm)
                        </h4>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Min cm"
                                    min={0}
                                    step={0.5}
                                    value={filters.minFiberLengthCm?.toString() ?? ''}
                                    onChange={(e) => updateFilter('minFiberLengthCm', e.target.value ? parseFloat(e.target.value) : null)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    fullWidth
                                />
                                {!!filters.minFiberLengthCm && (
                                    <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                        onPress={() => clearFilter('minFiberLengthCm')}>
                                        <IoMdClose />
                                    </Button>
                                )}
                            </div>
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Max cm"
                                    min={0}
                                    step={0.5}
                                    value={filters.maxFiberLengthCm?.toString() ?? ''}
                                    onChange={(e) => updateFilter('maxFiberLengthCm', e.target.value ? parseFloat(e.target.value) : null)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    fullWidth
                                />
                                {!!filters.maxFiberLengthCm && (
                                    <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                        onPress={() => clearFilter('maxFiberLengthCm')}>
                                        <IoMdClose />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vægt (gram) */}
                    <div>
                        <h4 className="text-label mb-1 flex items-center gap-1.5">
                            <LuWeight className="text-lg text-muted" />
                            Vægt (gram)
                        </h4>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Min g"
                                    min={0}
                                    step={10}
                                    value={filters.minWeightGrams?.toString() ?? ''}
                                    onChange={(e) => updateFilter('minWeightGrams', e.target.value ? parseFloat(e.target.value) : null)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    fullWidth
                                />
                                {!!filters.minWeightGrams && (
                                    <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                        onPress={() => clearFilter('minWeightGrams')}>
                                        <IoMdClose />
                                    </Button>
                                )}
                            </div>
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Max g"
                                    min={0}
                                    step={10}
                                    value={filters.maxWeightGrams?.toString() ?? ''}
                                    onChange={(e) => updateFilter('maxWeightGrams', e.target.value ? parseFloat(e.target.value) : null)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    fullWidth
                                />
                                {!!filters.maxWeightGrams && (
                                    <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                        onPress={() => clearFilter('maxWeightGrams')}>
                                        <IoMdClose />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
});
