// src/components/nav/side/SaleYarnNavClient.tsx
'use client';

import { Input, Button, Separator, Switch } from '@/components/ui/heroui';
import { useState, useEffect, memo } from 'react';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import EnumLocalAutocomplete from '@/components/ui/custom/autocomplete/EnumLocalAutocomplete';
import { useEnums, EnumType } from '@/contexts/EnumContext';
import { useYarnFilters } from '@/store/saleYarnFilterStore';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/navigationConstants';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineLocationOn, MdSort, MdCategory } from 'react-icons/md';
import { FiArrowLeft } from 'react-icons/fi';
import { FaTruck } from 'react-icons/fa';
import { PiYarn } from 'react-icons/pi';
import { GiWool } from 'react-icons/gi';
import { PriceRangeSlider } from '@/components/ui/custom/range';

const REQUIRED_ENUMS: EnumType[] = ['YarnMainCategory', 'YarnWeightCategory', 'WoolFiberType'];

const SORT_ENUM: Record<string, string> = {
    'Newest':     'Nyeste først',
    'MostViewed': 'Mest sete',
};

const ENTITY_TYPE_ENUM: Record<string, string> = {
    'RabbitSD':     'Kaniner',
    'WoolCardedSD': 'Kardet uld',
    'WoolRawSD':    'Rå uld',
    'YarnSD':       'Garn',
    'PeltSD':       'Skind',
};

const FILTER_SECTIONS = {
    YARN:     'Garn filtre',
    SHIPPING: 'Sending',
    PRICE:    'Pris (kr.)',
    LOCATION: 'Lokation',
} as const;

export const SaleYarnNavClient = memo(function SaleYarnNavClient() {
    const router = useRouter();
    const {
        filters,
        updateFilter,
        clearFilter,
        clearAllFilters,
        applyFilters,
        syncFiltersWithUrl,
    } = useYarnFilters();

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
                console.error('Error loading SaleYarnNav enums:', error);
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

            {/* Kategori (låst til Garn) */}
            <div className="flex items-center gap-1 opacity-50 pointer-events-none">
                <div className="flex items-center gap-1.5 min-w-17.5">
                    <MdCategory className="text-lg text-muted" />
                    <span className="text-label">Kategori</span>
                </div>
                <div className="flex-1">
                    <EnumLocalAutocomplete
                        enumType={ENTITY_TYPE_ENUM}
                        value="YarnSD"
                        onChange={() => undefined}
                        label="Kategori"
                        id="yarn-kategori"
                        isDisabled
                    />
                </div>
            </div>

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
                        id="yarn-sortering"
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

            {/* Garn filtre */}
            <div>
                <h3 className="text-label mb-0.5">{FILTER_SECTIONS.YARN}</h3>
                <div className="space-y-1.5">
                    {/* Garnkategori */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-17.5">
                            <PiYarn className="text-lg text-muted" />
                            <span className="text-label">Kategori</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="YarnMainCategory"
                                value={filters.applicationCategory ?? null}
                                onChange={(v) => updateFilter('applicationCategory', v ?? undefined)}
                                label="Garnkategori"
                            />
                        </div>
                    </div>

                    {/* Vægt/tykkelse */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-17.5">
                            <GiWool className="text-lg text-muted" />
                            <span className="text-label">Tykkelse</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="YarnWeightCategory"
                                value={filters.weightCategory ?? null}
                                onChange={(v) => updateFilter('weightCategory', v ?? undefined)}
                                label="Garntykkelse"
                            />
                        </div>
                    </div>

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

                    {/* Antal tråde */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-17.5">
                            <PiYarn className="text-lg text-muted" />
                            <span className="text-label">Tråde</span>
                        </div>
                        <div className="flex items-center gap-1 flex-1">
                            <Input
                                type="number"
                                placeholder="Antal tråde"
                                min={1}
                                max={12}
                                value={filters.plyCount?.toString() ?? ''}
                                onChange={(e) => updateFilter('plyCount', e.target.value ? parseInt(e.target.value) : null)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                fullWidth
                            />
                            {!!filters.plyCount && (
                                <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                    onPress={() => clearFilter('plyCount')}>
                                    <IoMdClose />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});