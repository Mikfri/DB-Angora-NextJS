// src/components/cards/saleCategoryCards.tsx
'use client';

import { usePathname } from 'next/navigation';
import IconCard from './iconCard';
import { saleCategoryLinks } from '@/constants/navigationConstants';

export default function SaleCategoryCards() {
    const pathname = usePathname();

    return (
        <div className="unified-container p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {saleCategoryLinks.map(({ label, href, icon, iconSrc, disabled }) => (
                    <IconCard
                        key={label}
                        label={label}
                        href={href}
                        icon={icon}
                        iconSrc={iconSrc}
                        disabled={disabled}
                        isActive={pathname === href || pathname.startsWith(href + '/')}
                    />
                ))}
            </div>
        </div>
    );
}
