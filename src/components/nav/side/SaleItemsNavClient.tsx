// src/components/nav/side/SaleItemsNavClient.tsx
'use client';

import { Button, Separator, Switch, Input } from '@/components/ui/heroui';
import { useEffect, useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useSaleFilters } from '@/store/saleFilterStore';
import { ROUTES } from '@/constants/navigationConstants';
import { IoMdClose } from 'react-icons/io';
import { FiArrowLeft } from 'react-icons/fi';
import { MdOutlineLocationOn, MdSort } from 'react-icons/md';
import { FaTruck } from 'react-icons/fa';
import EnumLocalAutocomplete from '@/components/ui/custom/autocomplete/EnumLocalAutocomplete';
import { PriceRangeSlider } from '@/components/ui/custom/range';

const SORT_ENUM: Record<string, string> = {
    'Newest': 'Nyeste først',
    'MostViewed': 'Mest sete',
};

export const SaleItemsNavClient = memo(function SaleItemsNavClient() {
    const router = useRouter();
    const {
        filters,
        updateFilter,
        clearFilter,
        clearAllFilters,
        applyFilters,
        syncFiltersWithUrl,
    } = useSaleFilters();

    useEffect(() => {
        syncFiltersWithUrl();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasActiveFilters = Object.values(filters).some(
        value => value !== undefined && value !== null && value !== ''
    );

    const [priceRange, setPriceRange] = useState<[number, number]>([filters.minPrice ?? 0, filters.maxPrice ?? 5000]);

    useEffect(() => {
        setPriceRange([filters.minPrice ?? 0, filters.maxPrice ?? 5000]);
    }, [filters.minPrice, filters.maxPrice]);

    return (
        <div className="w-full p-1 space-y-2">
            {/* Tilbage */}
            <button
                onClick={() => router.push(ROUTES.HOME)}
                className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
                <FiArrowLeft className="shrink-0" />
                Forside
            </button>

            <Separator className="divider my-0.5" />

            {/* Filtre header */}
            <div className="flex justify-between items-center">
                <h3 className="text-label">Filtre</h3>
                {hasActiveFilters && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 text-xs text-muted hover:text-foreground"
                        onPress={() => {
                            clearAllFilters();
                            applyFilters({});
                        }}
                    >
                        Nulstil alle
                    </Button>
                )}
            </div>

            {/* Søg — øverst under Filtre */}
            <Button
                variant="primary"
                fullWidth
                size="sm"
                onPress={() => applyFilters()}
            >
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
                        id="sale-sortering"
                    />
                </div>
            </div>

            {/* Sending */}
            <div className="flex items-center gap-1">
                <div className="flex items-center gap-1.5 min-w-17.5">
                    <FaTruck className="text-lg text-muted" />
                    <span className="text-label">Sending</span>
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
                label="Pris (kr.)"
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
                    Lokation
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
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SaleItemsNavClient;