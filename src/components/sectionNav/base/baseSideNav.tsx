// src/components/sectionNav/base/baseSideNav.tsx
'use client';

import { Button } from "@nextui-org/react";
import { ReactNode } from "react";

export type NavLink = {
    href: string;
    label: string;
    requiresAuth?: boolean;
    requiredRole?: string[];
    disabled?: boolean;
};

export type NavGroup = {
    title?: string;
    links: NavLink[];
};

// Eksempel på navigation links
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

export const homeNavigationLinks: NavGroup[] = [
    {
        title: "Sektioner",
        links: [
            { href: '#welcome', label: 'Velkommen til' },
            { href: '#news', label: 'Nyheder' },
            // { href: '#events', label: 'Arrangementer' },
            // { href: '#featured', label: 'Fremhævede' }
        ]
    }
];

export const saleNavigationLinks: NavGroup[] = [
    {
        title: "Kategorier",
        links: [
            { href: '/sale/rabbits', label: 'Kaniner' },
            { href: '/sale/wool', label: 'Uld', disabled: true }
        ]
    }
];

// Funktion til at filtrere links baseret på brugerens login-status og rolle
export const filterLink = (link: NavLink, isLoggedIn: boolean, userRole: string): boolean => {
    if (!link.requiresAuth) return true;
    if (link.requiresAuth && !isLoggedIn) return false;
    if (link.requiredRole && !link.requiredRole.includes(userRole)) return false;
    return true;
};

interface NavAction {
    label: string | JSX.Element;
    className?: string;
    onClick: () => void;
    color?: "primary" | "secondary" | "success" | "warning" | "danger";
    disabled?: boolean;
}

interface SectionNavProps {
    title: string;
    actions?: NavAction[];
    children?: ReactNode;
}

export default function SectionNav({ title, actions = [], children }: SectionNavProps) {
    return (
        <nav
            className="
                sticky top-0
                max-h-[calc(100vh-220px)]
                bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150
                p-4 rounded-xl border border-zinc-700/50 shadow-lg
                h-fit
            "
        >
            {/* Header med titel og actions */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <div className="flex gap-2">
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            onPress={action.onClick}
                            className={action.className}
                            color={action.color}
                            disabled={action.disabled}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            </div>
            
            {/* Indhold/children af navigationssektionen */}
            <div className="flex flex-col gap-4">
                {children}
            </div>
        </nav>
    );
}