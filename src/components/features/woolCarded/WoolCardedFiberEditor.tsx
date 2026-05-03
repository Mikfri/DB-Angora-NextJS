// src/components/features/woolCarded/WoolCardedFiberEditor.tsx

/**
 * Redigerbar liste af WoolCardedFiberComponentDTO.
 *
 * - Readonly view: viser type, vægt (g) og procentdel (beregnet af serveren)
 * - Edit view: rækker med WoolFiberType autocomplete + gram-input + slet-knap, plus Tilføj-knap
 * - Gram-baseret (modsat garnets procent-baserede FiberComponentEditor)
 */

'use client';

import { Chip, Button } from '@/components/ui/heroui';
import { WoolCardedFiberComponentDTO, WoolCardedFiberComponentReadDTO } from '@/api/types/WoolCardedDTOs';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface Props {
    /** Write-model: bruges til POST/PUT og til edit-visning */
    components: WoolCardedFiberComponentDTO[];
    onChange: (components: WoolCardedFiberComponentDTO[]) => void;
    isEditing?: boolean;
    required?: boolean;
    /** Read-model med beregnet percentage: bruges til readonly-visning når de hentes fra API */
    readComponents?: WoolCardedFiberComponentReadDTO[];
}

function totalGrams(components: WoolCardedFiberComponentDTO[]): number {
    return components.reduce((sum, c) => sum + (c.weightInGrams ?? 0), 0);
}

export default function WoolCardedFiberEditor({
    components,
    onChange,
    isEditing = false,
    required = false,
    readComponents,
}: Props) {
    const total = totalGrams(components);

    const addRow = () => {
        onChange([...components, { type: '', weightInGrams: 0 }]);
    };

    const removeRow = (index: number) => {
        onChange(components.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, patch: Partial<WoolCardedFiberComponentDTO>) => {
        onChange(components.map((c, i) => i === index ? { ...c, ...patch } : c));
    };

    // Readonly display: prefer readComponents (has percentage) when not editing
    const displayRows = readComponents && !isEditing ? readComponents : null;

    return (
        <div className="rounded-lg border border-divider bg-surface overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-divider">
                <p className="text-sm font-semibold text-foreground">
                    Fiber sammensætning
                    {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
                </p>
                <div className="flex items-center gap-2">
                    {components.length > 0 && (
                        <Chip size="sm" variant="soft" color="default">
                            {total} g
                        </Chip>
                    )}
                    {isEditing && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onPress={addRow}
                            aria-label="Tilføj fiberkomponent"
                            className="text-accent"
                        >
                            <FaPlus size={12} />
                        </Button>
                    )}
                </div>
            </div>

            {/* Readonly view */}
            {!isEditing && (
                (displayRows ?? []).length === 0 ? (
                    <p className="px-3 py-3 text-sm italic text-foreground/40">Ingen fiberkomponenter angivet.</p>
                ) : (
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b border-divider bg-content2">
                                <th className="px-3 py-1.5 text-left text-xs font-medium text-foreground/60 w-1/3">Type</th>
                                <th className="px-3 py-1.5 text-left text-xs font-medium text-foreground/60 w-20">Vægt</th>
                                <th className="px-3 py-1.5 text-left text-xs font-medium text-foreground/60">Andel</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-divider">
                            {(displayRows ?? []).map((row, index) => (
                                <tr key={`${row.type}-${index}`}>
                                    <td className="px-3 py-2 text-sm text-foreground">
                                        {row.type || <span className="italic text-foreground/40">—</span>}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-foreground tabular-nums">
                                        {row.weightInGrams} g
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-accent"
                                                    style={{ width: `${row.percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-foreground tabular-nums w-9 text-right">
                                                {row.percentage}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}

            {/* Edit view */}
            {isEditing && (
                <div className="divide-y divide-divider">
                    {components.length === 0 && (
                        <p className="px-3 py-3 text-sm italic text-foreground/40">
                            Tryk + for at tilføje en fiberkomponent.
                        </p>
                    )}
                    {components.map((component, index) => (
                        <div key={index} className="flex items-center gap-3 px-3 py-3">

                            {/* Fibertype autocomplete */}
                            <div className="w-36 shrink-0">
                                <EnumAutocomplete
                                    enumType="WoolFiberType"
                                    value={component.type || null}
                                    onChange={(val) => updateRow(index, { type: val ?? '' })}
                                    label="Fibertype"
                                    placeholder="Fibertype"
                                    compact
                                />
                            </div>

                            {/* Gram input */}
                            <div className="flex-1 min-w-0">
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={component.weightInGrams}
                                    onChange={(e) => updateRow(index, { weightInGrams: Number(e.target.value) })}
                                    className="w-full rounded-md border border-divider bg-content1 px-2 py-1.5 text-sm text-foreground tabular-nums focus:outline-none focus:ring-1 focus:ring-accent"
                                    aria-label={`Vægt i gram for fiberkomponent ${index + 1}`}
                                    placeholder="Gram"
                                />
                                <span className="text-xs text-foreground/50 mt-0.5 block">gram</span>
                            </div>

                            {/* Slet */}
                            <Button
                                isIconOnly
                                size="sm"
                                variant="ghost"
                                className="text-danger/70 hover:text-danger shrink-0"
                                onPress={() => removeRow(index)}
                                aria-label={`Fjern fiberkomponent ${index + 1}`}
                            >
                                <FaTrash size={12} />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
