// src/components/features/yarn/FiberComponentEditor.tsx

/**
 * Redigerbar liste af YarnFiberComponentDTO.
 *
 * - Viser readonly tabel når isEditing=false
 * - Skifter til editor-rækker med autocomplete + sliders når isEditing=true
 * - Validerer at samlet procent = 100%
 * - Kan bruges til både POST (ny annonce) og PUT (rediger eksisterende)
 */

'use client';

import { Slider, Chip, Button } from '@/components/ui/heroui';
import { YarnFiberComponentDTO } from '@/api/types/YarnDTOs';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface Props {
    components: YarnFiberComponentDTO[];
    onChange: (components: YarnFiberComponentDTO[]) => void;
    isEditing?: boolean;
}

function totalPercentage(components: YarnFiberComponentDTO[]): number {
    return components.reduce((sum, c) => sum + (c.percentage ?? 0), 0);
}

export default function FiberComponentEditor({ components, onChange, isEditing = false }: Props) {
    const total = totalPercentage(components);
    const isValid = total === 100 || components.length === 0;

    const addRow = () => {
        const remaining = Math.max(0, 100 - total);
        onChange([...components, { type: '', percentage: remaining, fiberLengthInCm: null }]);
    };

    const removeRow = (index: number) => {
        onChange(components.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, patch: Partial<YarnFiberComponentDTO>) => {
        onChange(components.map((c, i) => i === index ? { ...c, ...patch } : c));
    };

    return (
        <div className="rounded-lg border border-divider bg-surface overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-divider">
                <p className="text-sm font-semibold text-foreground">Fiber sammensætning</p>
                <div className="flex items-center gap-2">
                    {components.length > 0 && (
                        <Chip
                            size="sm"
                            variant="soft"
                            color={isValid ? 'default' : 'danger'}
                        >
                            {total}%
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
                components.length === 0 ? (
                    <p className="px-3 py-3 text-sm italic text-foreground/40">Ingen fiberkomponenter angivet.</p>
                ) : (
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b border-divider bg-content2">
                                <th className="px-3 py-1.5 text-left text-xs font-medium text-foreground/60 w-1/3">Type</th>
                                <th className="px-3 py-1.5 text-left text-xs font-medium text-foreground/60">Andel</th>
                                <th className="px-3 py-1.5 text-left text-xs font-medium text-foreground/60 w-24">Fiberlængde</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-divider">
                            {components.map((component, index) => (
                                <tr key={`${component.type}-${index}`}>
                                    <td className="px-3 py-2 text-sm text-foreground">{component.type || <span className="italic text-foreground/40">—</span>}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-accent"
                                                    style={{ width: `${component.percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-foreground tabular-nums w-9 text-right">{component.percentage}%</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-sm text-foreground">
                                        {component.fiberLengthInCm != null
                                            ? `${component.fiberLengthInCm} cm`
                                            : <span className="text-foreground/40 italic">-</span>
                                        }
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

                            {/* Procent slider */}
                            <div className="flex-1 min-w-0">
                                <Slider
                                    aria-label={`Procentdel for fiberkomponent ${index + 1}`}
                                    value={component.percentage}
                                    onChange={(val) => updateRow(index, { percentage: Array.isArray(val) ? val[0] : val })}
                                    minValue={0}
                                    maxValue={100}
                                    step={1}
                                >
                                    <div className="flex items-center justify-end mb-1">
                                        <Slider.Output className={`text-xs font-medium tabular-nums ${!isValid ? 'text-danger' : 'text-foreground/70'}`}>
                                            {({ state }) => `${state.values[0]}%`}
                                        </Slider.Output>
                                    </div>
                                    <Slider.Track>
                                        <Slider.Fill />
                                        <Slider.Thumb />
                                    </Slider.Track>
                                </Slider>
                            </div>

                            {/* Fiberlængde slider */}
                            <div className="flex-1 min-w-0">
                                <Slider
                                    aria-label={`Fiberlængde for fiberkomponent ${index + 1}`}
                                    value={component.fiberLengthInCm ?? 0}
                                    onChange={(val) => {
                                        const v = Array.isArray(val) ? val[0] : val;
                                        updateRow(index, { fiberLengthInCm: v === 0 ? null : v });
                                    }}
                                    minValue={0}
                                    maxValue={30}
                                    step={1}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-foreground/50">Fiber længde</span>
                                        <Slider.Output className="text-xs font-medium tabular-nums text-foreground/70">
                                            {({ state }) => state.values[0] === 0 ? '—' : `${state.values[0]} cm`}
                                        </Slider.Output>
                                    </div>
                                    <Slider.Track>
                                        <Slider.Fill />
                                        <Slider.Thumb />
                                    </Slider.Track>
                                </Slider>
                            </div>

                            {/* Slet */}
                            <Button
                                size="sm"
                                variant="ghost"
                                onPress={() => removeRow(index)}
                                aria-label="Fjern fiberkomponent"
                                className="text-danger shrink-0"
                            >
                                <FaTrash size={12} />
                            </Button>
                        </div>
                    ))}

                    {/* Valideringsfejl */}
                    {components.length > 0 && !isValid && (
                        <p className="px-3 py-2 text-xs text-danger">
                            Samlet procent er {total}% — skal være 100%.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
