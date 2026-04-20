// src/components/ui/custom/inputs/CompactInput.tsx

/**
 * A compact variant of HeroUI's Input for use inside PropertyTable edit cells
 * and other space-constrained layouts (e.g. inline numeric pairs).
 *
 * - Uses variant="secondary" so it blends into surface backgrounds
 * - Reduced vertical padding via className override
 * - flex-1 + min-w-0 so it participates in flex shrink/grow correctly
 */

'use client';

import { Input } from '@/components/ui/heroui';
import type { ComponentProps } from 'react';

type CompactInputProps = ComponentProps<typeof Input>;

export default function CompactInput({ className, ...props }: CompactInputProps) {
    return (
        <Input
            variant="secondary"
            className={`py-1 px-2 text-xs flex-1 min-w-0${className ? ` ${className}` : ''}`}
            {...props}
        />
    );
}
