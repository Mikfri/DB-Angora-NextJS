// src/components/cards/iconCard.tsx

/**
 * Dette card er for små ikoner/symboler i SVG stil,
 * til at viderstille brugeren til andre sider. 
 */

'use client';

import Link from 'next/link';
import { toast } from 'react-toastify';
import type { IconType } from 'react-icons';

interface IconCardProps {
    label: string;
    href: string;
    icon: IconType;
    disabled?: boolean;
    disabledMessage?: string;
    isActive?: boolean;
}

export default function IconCard({
    label,
    href,
    icon: Icon,
    disabled = false,
    disabledMessage = 'Denne kategori er ikke tilgængelig endnu',
    isActive = false,
}: IconCardProps) {
    if (disabled) {
        return (
            <button
                type="button"
                onClick={() => toast.info(disabledMessage)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-(--card-border) bg-(--card-bg) opacity-50 cursor-not-allowed w-full"
            >
                <Icon className="text-3xl text-foreground/40" />
                <span className="text-sm font-medium text-foreground/40">{label}</span>
            </button>
        );
    }

    return (
        <Link
            href={href}
            className={[
                'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
                isActive
                    ? 'border-(--accent) bg-(--accent)/10 shadow-(--card-shadow-hover)'
                    : 'border-(--card-border) bg-(--card-bg) shadow-(--card-shadow) hover:shadow-(--card-shadow-hover) hover:border-(--accent)',
            ].join(' ')}
        >
            <Icon className={isActive ? 'text-3xl text-accent' : 'text-3xl text-foreground/70'} />
            <span className={isActive ? 'text-sm font-semibold text-accent' : 'text-sm font-medium text-foreground/80'}>{label}</span>
        </Link>
    );
}

