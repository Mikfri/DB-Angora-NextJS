// src/components/sectionNav/variants/myNav.tsx
'use client'
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import SectionNav from '../base/baseSideNav';
import Link from 'next/link';

export type NavLink = {
    href: string;
    label: string;
    requiresAuth?: boolean;
    requiredRole?: string[];
};

export type NavGroup = {
    title?: string;
    links: NavLink[];
};

export const navigationLinks: NavGroup[] = [
    {
        title: "Min konto",
        links: [
            { href: '/account', label: 'Min side', requiresAuth: true },
        ]
    },
    {
        title: "Avler funktioner",
        links: [
            {
                href: '/account/myRabbits',
                label: 'Mine kaniner',
                requiresAuth: true,
                requiredRole: ['BreederBasic', 'BreederPremium', 'Moderator', 'Admin']
            },
            {
                href: '/account/rabbitsForbreeding',
                label: 'Find avlskaniner',
                requiresAuth: true,
                requiredRole: ['BreederBasic', 'BreederPremium', 'Moderator', 'Admin']
            },
        ]
    }
];

export default function MyNav() {
    const { isLoggedIn, userRole } = useAuth();
    const pathname = usePathname();

    const filterLink = (link: NavLink) => {
        if (!link.requiresAuth) return true;
        if (link.requiresAuth && !isLoggedIn) return false;
        if (link.requiredRole && !link.requiredRole.includes(userRole)) return false;
        return true;
    };

    return (
        <SectionNav title="Navigation">
            <div className="flex flex-col gap-4">
                {navigationLinks.map((group, index) => {
                    const filteredGroupLinks = group.links.filter(filterLink);
                    if (filteredGroupLinks.length === 0) return null;

                    return (
                        <div key={index} className="flex flex-col gap-2">
                            <h3 className="text-sm font-medium text-zinc-400 px-2">
                                {group.title}
                            </h3>
                            {filteredGroupLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`p-2 rounded-md transition-colors ${
                                        pathname === link.href
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-zinc-700/50'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {index < navigationLinks.length - 1 && (
                                <div className="h-px bg-zinc-400/30 my-2" />
                            )}
                        </div>
                    );
                })}
            </div>
        </SectionNav>
    );
}