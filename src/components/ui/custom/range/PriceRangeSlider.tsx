// src/components/ui/custom/range/PriceRangeSlider.tsx
'use client';

/**
 * Genbrugelig pris-range slider baseret på HeroUI <Slider>.
 * Håndterer lokal drag-state internt og kalder `onChangeEnd` når brugeren slipper.
 * Synkroniserer med ekstern `value` prop (fx ved nulstilling af filtre).
 */

import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/heroui';
import { MdAttachMoney } from 'react-icons/md';

interface PriceRangeSliderProps {
    /** Venstre label + ikon i header-rækken */
    label?: string;
    icon?: React.ReactNode;
    /** Interval-grænser */
    min?: number;
    max?: number;
    step?: number;
    /** Controlled value fra forælderen – [min, max] */
    value: [number, number];
    /** Kaldes under drag (opdater lokal visning i forælderen hvis ønsket) */
    onChange?: (value: [number, number]) => void;
    /** Kaldes når brugeren slipper slideren – commit til store her */
    onChangeEnd: (value: [number, number]) => void;
    /** Valgfri format-funktion til visning af talværdier */
    formatValue?: (value: number) => string;
    /** Enhed vist efter talværdier, fx 'kr.' */
    suffix?: string;
    ariaLabel?: string;
}

const defaultFormat = (v: number) =>
    v.toLocaleString('da-DK', { maximumFractionDigits: 0 });

export default function PriceRangeSlider({
    label = 'Pris',
    icon,
    min = 0,
    max = 5000,
    step = 50,
    value,
    onChange,
    onChangeEnd,
    formatValue = defaultFormat,
    suffix = 'kr.',
    ariaLabel,
}: PriceRangeSliderProps) {
    const [localValue, setLocalValue] = useState<[number, number]>(value);

    // Synkroniser når ekstern value ændres (fx nulstil alle)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const isDefault = localValue[0] === min && localValue[1] === max;
    const displayMax = localValue[1] >= max
        ? `${formatValue(localValue[1])}+`
        : formatValue(localValue[1]);

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    {icon ?? <MdAttachMoney className="text-base text-muted" />}
                    <span className="text-label">{label}</span>
                </div>
                <span className="text-xs text-muted">
                    {isDefault
                        ? 'Alle'
                        : `${formatValue(localValue[0])} – ${displayMax} ${suffix}`}
                </span>
            </div>

            <Slider
                value={localValue}
                onChange={(v) => {
                    const next = v as [number, number];
                    setLocalValue(next);
                    onChange?.(next);
                }}
                onChangeEnd={(v) => {
                    onChangeEnd(v as [number, number]);
                }}
                minValue={min}
                maxValue={max}
                step={step}
                aria-label={ariaLabel ?? label}
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
    );
}
