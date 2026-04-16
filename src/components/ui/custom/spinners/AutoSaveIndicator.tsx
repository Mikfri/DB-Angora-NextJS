// src/components/ui/custom/spinners/AutoSaveIndicator.tsx

'use client';

import { Spinner } from '@/components/ui/heroui';

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveIndicatorProps {
    status: AutoSaveStatus;
    lastSaved?: Date | null;
}

export function AutoSaveIndicator({ status }: AutoSaveIndicatorProps) {
    if (status === 'idle') return null;

    if (status === 'saving') {
        return (
            <div className="flex items-center gap-2 text-sm text-default-500">
                <Spinner size="sm" />
                <span>Gemmer...</span>
            </div>
        );
    }

    if (status === 'saved') {
        return (
            <span className="text-sm text-success-500">Gemt ✓</span>
        );
    }

    return (
        <span className="text-sm text-danger-500">Fejl ved gemning</span>
    );
}

