// src/components/filters/RabbitStatusFilter.tsx
'use client';
import { Switch, Chip } from "@heroui/react";
import { TbStatusChange } from "react-icons/tb";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { OwnFilters } from '@/api/types/filterTypes';

interface RabbitOwnStatusFiltersProps {
    activeFilters: OwnFilters;
    onFilterChange: (filters: Partial<OwnFilters>) => void;
    totalCount: number;
    filteredCount: number;
    currentPage: number;
    totalPages: number;
}

export default function RabbitStatusFilters({
    activeFilters,
    onFilterChange,
    totalCount,
    filteredCount,
    currentPage,
    totalPages
}: RabbitOwnStatusFiltersProps) {
    // Sikre værdier fra activeFilters
    const filters = {
        forSale: Boolean(activeFilters?.forSale),
        isForBreeding: Boolean(activeFilters?.isForBreeding),
        lifeStatus: Boolean(activeFilters?.lifeStatus),
    };

    // Tjek om der er aktive filtre i denne komponent
    const hasActiveStatusFilters = filters.forSale || filters.isForBreeding || filters.lifeStatus;

    return (
        <div className="bg-zinc-800/60 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-3 mb-3">
            <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:items-center md:justify-between">
                {/* Venstre side - Info om antal kaniner */}
                <div className="flex items-center gap-2">
                    <h2 className="text-sm md:text-base text-zinc-300">
                        Mine Kaniner
                    </h2>
                    <Chip 
                        size="sm" 
                        color="primary" 
                        variant="flat"
                        className="h-5"
                    >
                        {filteredCount} af {totalCount}
                    </Chip>
                    
                    {totalPages > 1 && (
                        <span className="text-xs text-zinc-400">
                            Side {currentPage}/{totalPages}
                        </span>
                    )}
                </div>
                
                {/* Højre side - Status filtre */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Reset knap hvis der er aktive filtre */}
                    {hasActiveStatusFilters && (
                        <button 
                            className="text-xs text-primary hover:underline"
                            onClick={() => onFilterChange({ 
                                forSale: false, 
                                isForBreeding: false, 
                                lifeStatus: false
                            })}
                        >
                            Nulstil status
                        </button>
                    )}
                
                    {/* Til salg filter */}
                    <div className="flex items-center gap-2">
                        <BiPurchaseTagAlt className="text-default-500" />
                        <Switch
                            size="sm"
                            isSelected={filters.forSale}
                            onValueChange={(checked) => onFilterChange({ forSale: checked })}
                            aria-label="Vis kun til salg"
                            className="mr-1"
                        />
                        <span className="text-xs">Til salg</span>
                    </div>

                    {/* Til avl filter */}
                    <div className="flex items-center gap-2">
                        <BiPurchaseTagAlt className="text-default-500" />
                        <Switch
                            size="sm"
                            isSelected={filters.isForBreeding}
                            onValueChange={(checked) => onFilterChange({ isForBreeding: checked })}
                            aria-label="Vis kun til avl"
                            className="mr-1"
                        />
                        <span className="text-xs">Til avl</span>
                    </div>

                    {/* Afdøde filter */}
                    <div className="flex items-center gap-2">
                        <TbStatusChange className="text-default-500" />
                        <Switch
                            size="sm"
                            isSelected={filters.lifeStatus}
                            onValueChange={(checked) => onFilterChange({ lifeStatus: checked })}
                            className="mr-1"
                        />
                        <span className="text-xs">Kun døde</span>
                    </div>
                </div>
            </div>
        </div>
    );
}