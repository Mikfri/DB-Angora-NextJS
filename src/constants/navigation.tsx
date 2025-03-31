// src/constants/navigation.tsx
import { NavGroup } from "@/types/navigation";
import { UserRole, roleGroups } from "@/types/auth";
import { IoHomeOutline, IoPersonOutline } from "react-icons/io5";
import { MdPets } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { ImPriceTags } from 'react-icons/im';

// Eksporter UI konstanter der kan bruges på tværs af komponenter
export const SECTION_TITLES = {
    ACCOUNT: 'Min konto',
    SALE: 'Salg',
    ADMIN: 'Administration',
    BREEDER: 'Avler funktioner'
} as const;

// Navigation styles - kan bruges af flere navs
export const NAV_STYLES = {
    base: "px-1 py-0",
    mainLink: "font-semibold",
    subLink: "pl-4",
    active: "text-primary",
    divider: "bg-zinc-700/50 my-1",
    icon: "text-xl text-default-500",
    disabledText: "ml-2 text-xs text-default-400"
} as const;

// Helper funktion til at bestemme sektion baseret på URL
export const getDefaultSectionTitle = (href?: string): string | undefined => {
    if (!href) return undefined;
    
    if (href.startsWith('/account')) return SECTION_TITLES.ACCOUNT;
    if (href.startsWith('/sale')) return SECTION_TITLES.SALE;
    if (href.includes('/admin')) return SECTION_TITLES.ADMIN;
    return undefined;
};

// Icon factory funktion der returnerer et map af path->icon
export const createIconMap = (iconClassName: string) => {
    return {
        '/': <IoHomeOutline className={iconClassName} />,
        '/sale': <ImPriceTags className={iconClassName} />,
        '/account': <IoPersonOutline className={iconClassName} />,
        '/account/myRabbits': <MdPets className={iconClassName} />,
        '/sale/rabbits': <MdPets className={iconClassName} />,
        '/admin/users': <FaUsersCog className={iconClassName} />
    };
};

// Brugerroller
export const BREEDER_ROLES: UserRole[] = [
  ...roleGroups.breeders as UserRole[], 
  'Admin' as UserRole, 
  'ModeratorBreeder' as UserRole
];

export const MODERATOR_ROLES: UserRole[] = [
  ...roleGroups.moderators as UserRole[],
  'Admin' as UserRole
];

// Navigation links
export const navigationLinks: NavGroup[] = [
    {
        title: "Konto",
        links: [
            { href: '/account', label: 'Min side', requiresAuth: true },
            { href: '/account/profile', label: 'Brugerprofil', requiresAuth: true },
        ]
    }
];

export const breederNavigationLinks: NavGroup[] = [
    {
        title: "Avler funktioner",
        links: [
            {
                href: '/account/myRabbits',
                label: 'Mine kaniner',
                requiresAuth: true,
                requiredRoles: BREEDER_ROLES
            },
            {
                href: '/account/rabbitsForbreeding',
                label: 'Find avlskaniner',
                requiresAuth: true,
                requiredRoles: BREEDER_ROLES
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
                requiredRoles: MODERATOR_ROLES
            },
            {
                href: '/admin/posts',
                label: 'Opret indlæg',
                requiresAuth: true,
                requiredRoles: MODERATOR_ROLES
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