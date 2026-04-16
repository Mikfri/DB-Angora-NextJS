// src/components/ui/custom/textareas/ReadOnlyTextArea.tsx
'use client';

interface Props {
    value: string;
    label?: string;
    rows?: number;
    className?: string;
}

export default function ReadOnlyTextArea({ value, label, rows = 4, className }: Props) {
    return (
        <div className={`flex flex-col gap-1 ${className ?? ''}`}>
            {label && (
                <span className="text-sm font-semibold text-foreground">{label}</span>
            )}
            <textarea
                defaultValue={value}
                readOnly
                rows={rows}
                className="w-full resize-none rounded-lg border border-divider bg-surface-secondary px-3 py-2 text-sm text-foreground/80 leading-relaxed outline-none cursor-default"
            />
        </div>
    );
}
