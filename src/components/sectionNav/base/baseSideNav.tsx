// src/components/sectionNav/base/baseSideNav.tsx
'use client';
import { Button } from "@heroui/react";
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

export const navigationLinks: NavGroup[] = [
    {
        title: "Konto",
        links: [
            { href: '/account', label: 'Min side', requiresAuth: true },
            { href: '/account/profile', label: 'Brugerprofil', requiresAuth: true },
        ]
    }
];
// Add role-specific navigation groups
export const breederNavigationLinks: NavGroup[] = [
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

export const moderatorNavigationLinks: NavGroup[] = [
    {
        title: "Moderator funktioner",
        links: [
            {
                href: '/admin/users',
                label: 'Find bruger',
                requiresAuth: true,
                requiredRole: ['Moderator', 'Admin']
            },
            {
                href: '/admin/posts',
                label: 'Opret indlæg',
                requiresAuth: true,
                requiredRole: ['Moderator', 'Admin']
            },
        ]
    }
];

export const homeNavigationLinks: NavGroup[] = [
    {
        title: "DenBlå-Angora",
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
            { href: '/sale', label: 'Salg' },
            { href: '/sale/rabbits', label: 'Kaniner', requiresAuth: false },
            { href: '/sale/wool', label: 'Uld', disabled: true }
        ]
    }
];

export const filterLink = (link: NavLink, isLoggedIn: boolean, userRole: string) => {
    if (!link.requiresAuth) return true;
    if (link.requiresAuth && !isLoggedIn) return false;
    if (link.requiredRole && !link.requiredRole.includes(userRole)) return false;
    return true;
};

interface NavAction {
    label: ReactNode;  // Bruger ReactNode i stedet for string | JSX.Element
    className?: string;
    onClick: () => void;
    color?: "primary" | "secondary" | "success" | "warning" | "danger";
    disabled?: boolean;
}

interface SectionNavProps {
    title: string;
    headerActions?: NavAction[];
    footerActions?: NavAction[];
    children?: React.ReactNode;
}

export default function SectionNav({ title, headerActions = [], footerActions = [], children }: SectionNavProps) {
    return (
        <nav className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 p-4 rounded-xl border-b-2 border-zinc-800/50 shadow-lg h-fit">
            <div className="flex flex-col gap-6">
                {/* Title */}
                <h2 className="text-2xl font-bold text-white">{title}</h2>

                {/* Header Actions */}
                {headerActions.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {headerActions.map((action, index) => (
                            <Button
                                key={index}
                                color={action.color || "primary"}
                                onPress={() => action.onClick()} // Wrap onclick i en anonym funktion
                                className={`w-full ${action.className || ''}`}
                                disabled={action.disabled}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Children (Navigation Content) */}
                <div className="flex flex-col gap-4">
                    {children}
                </div>

                {/* Footer Actions */}
                {footerActions.length > 0 && (
                    <div className="flex flex-col gap-2 mt-auto">
                        {footerActions.map((action, index) => (
                            <Button
                                key={index}
                                color={action.color || "primary"}
                                onPress={() => action.onClick()} // Wrap onclick i en anonym funktion
                                className={`w-full ${action.className || ''}`}
                                disabled={action.disabled}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}