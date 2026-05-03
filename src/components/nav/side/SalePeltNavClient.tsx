// src/components/nav/side/SalePeltNavClient.tsx
'use client';

import { Input, Button, Separator, Switch } from '@/components/ui/heroui';
import { useState, useEffect, memo } from 'react';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import EnumLocalAutocomplete from '@/components/ui/custom/autocomplete/EnumLocalAutocomplete';
import { useEnums, EnumType } from '@/contexts/EnumContext';
import { usePeltFilters } from '@/store/salePeltFilterStore';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/navigationConstants';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineLocationOn, MdSort } from 'react-icons/md';
import { MdPets } from 'react-icons/md';
import { FiArrowLeft } from 'react-icons/fi';
import { FaTruck } from 'react-icons/fa';
import { LuRuler } from 'react-icons/lu';
import { PriceRangeSlider } from '@/components/ui/custom/range';

const REQUIRED_ENUMS: EnumType[] = ['Race', 'Color', 'TanningMethod', 'PeltCondition'];

const SORT_ENUM: Record<string, string> = {
    'Newest':     'Nyeste først',
    'MostViewed': 'Mest sete',
};

const FILTER_SECTIONS = {
    PELT:     'Skind filtre',
    SHIPPING: 'Sending',
    PRICE:    'Pris (kr.)',
    LOCATION: 'Lokation',
} as const;

export const SalePeltNavClient = memo(function SalePeltNavClient() {
    const router = useRouter();
    const {
        filters,
        updateFilter,
        clearFilter,
        clearAllFilters,
        applyFilters,
        syncFiltersWithUrl,
    } = usePeltFilters();

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
                console.error('Error loading SalePeltNav enums:', error);
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
                        id="pelt-sortering"
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

            {/* Skind filtre */}
            <div>
                <h3 className="text-label mb-0.5">{FILTER_SECTIONS.PELT}</h3>
                <div className="space-y-1.5">

                    {/* Farve */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-17.5">
                            <MdPets className="text-lg text-muted" />
                            <span className="text-label">Farve</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Color"
                                value={filters.color ?? null}
                                onChange={(v) => updateFilter('color', v ?? undefined)}
                                label="Farve"
                            />
                        </div>
                    </div>

                    {/* Race */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-17.5">
                            <MdPets className="text-lg text-muted" />
                            <span className="text-label">Race</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="Race"
                                value={filters.race ?? null}
                                onChange={(v) => updateFilter('race', v ?? undefined)}
                                label="Race"
                            />
                        </div>
                    </div>

                    {/* Garvningsmetode */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-17.5">
                            <MdPets className="text-lg text-muted" />
                            <span className="text-label">Garvning</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="TanningMethod"
                                value={filters.tanningMethod ?? null}
                                onChange={(v) => updateFilter('tanningMethod', v ?? undefined)}
                                label="Garvningsmetode"
                            />
                        </div>
                    </div>

                    {/* Stand */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 min-w-17.5">
                            <MdPets className="text-lg text-muted" />
                            <span className="text-label">Stand</span>
                        </div>
                        <div className="flex-1">
                            <EnumAutocomplete
                                enumType="PeltCondition"
                                value={filters.condition ?? null}
                                onChange={(v) => updateFilter('condition', v ?? undefined)}
                                label="Stand"
                            />
                        </div>
                    </div>

                    {/* Mål: Længde (cm) */}
                    <div>
                        <h4 className="text-label mb-1 flex items-center gap-1.5">
                            <LuRuler className="text-lg text-muted" />
                            Længde (cm)
                        </h4>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Min cm"
                                    min={0}
                                    step={0.5}
                                    value={filters.minLengthCm?.toString() ?? ''}
                                    onChange={(e) => updateFilter('minLengthCm', e.target.value ? parseFloat(e.target.value) : null)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    fullWidth
                                />
                                {!!filters.minLengthCm && (
                                    <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                        onPress={() => clearFilter('minLengthCm')}>
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
                                    value={filters.maxLengthCm?.toString() ?? ''}
                                    onChange={(e) => updateFilter('maxLengthCm', e.target.value ? parseFloat(e.target.value) : null)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    fullWidth
                                />
                                {!!filters.maxLengthCm && (
                                    <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                        onPress={() => clearFilter('maxLengthCm')}>
                                        <IoMdClose />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mål: Bredde (cm) */}
                    <div>
                        <h4 className="text-label mb-1 flex items-center gap-1.5">
                            <LuRuler className="text-lg text-muted" />
                            Bredde (cm)
                        </h4>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Min cm"
                                    min={0}
                                    step={0.5}
                                    value={filters.minWidthCm?.toString() ?? ''}
                                    onChange={(e) => updateFilter('minWidthCm', e.target.value ? parseFloat(e.target.value) : null)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    fullWidth
                                />
                                {!!filters.minWidthCm && (
                                    <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                        onPress={() => clearFilter('minWidthCm')}>
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
                                    value={filters.maxWidthCm?.toString() ?? ''}
                                    onChange={(e) => updateFilter('maxWidthCm', e.target.value ? parseFloat(e.target.value) : null)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    fullWidth
                                />
                                {!!filters.maxWidthCm && (
                                    <Button isIconOnly size="sm" variant="ghost" className="text-muted"
                                        onPress={() => clearFilter('maxWidthCm')}>
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
