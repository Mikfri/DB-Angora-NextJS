// src/constants/navigation.tsx
import { NavGroup } from "@/types/navigation";
import { UserRole, roleGroups } from "@/types/auth";
import { IoHomeOutline, IoPersonOutline } from "react-icons/io5";
import { MdPets } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { ImPriceTags } from 'react-icons/im';

// ============= ROUTES KONSTANTER =============
export const ROUTES = {
  // Base routes
  HOME: '/',
  ABOUT: '/about',
  
  // Account routes
  ACCOUNT: {
    BASE: '/account',
    PROFILE: '/account/profile',
    MY_RABBITS: '/account/myRabbits',
    RABBITS_FOR_BREEDING: '/account/rabbitsForbreeding',
  },
  
  // Sale routes - opdateret til at matche din faktiske mappestruktur
  SALE: {
    BASE: '/annoncer',
    RABBITS: '/annoncer/kaniner',
    WOOL: '/annoncer/wool',
  },
  
  // Profile routes - baseret på din mappestruktur
  PROFILES: {
    RABBIT: (slug: string) => `/annoncer/kaniner/${slug}`,
    WOOL: (slug: string) => `/annoncer/uld/${slug}`,
    // Fallback til traditionelle profile URLs
    RABBIT_PROFILE: (id: string) => `/annoncer/kaniner/profile/${id}`,
    WOOL_PROFILE: (id: string) => `/annoncer/wool/profile/${id}`,
  },
  
  // Admin routes
  ADMIN: {
    USERS: '/admin/users',
    POSTS: '/admin/posts',
  },
  
  // External/future routes
  BREEDERS: '/breeders',
  CARE: '/care',
  
  // Hash anchors (for homepage)
  ANCHORS: {
    WELCOME: '#welcome',
    NEWS: '#news',
    EVENTS: '#events',
    FEATURED: '#featured',
  }
} as const;

// ============= UI KONSTANTER =============
export const SECTION_TITLES = {
    ACCOUNT: 'Min konto',
    SALE: 'Salg',
    ADMIN: 'Administration',
    BREEDER: 'Avler funktioner'
} as const;

export const NAV_STYLES = {
    base: "px-1 py-0",
    mainLink: "font-semibold",
    subLink: "pl-4",
    active: "text-primary",
    divider: "bg-zinc-700/50 my-1",
    icon: "text-xl text-default-500",
    disabledText: "ml-2 text-xs text-default-400"
} as const;

// ============= HELPER FUNKTIONER =============
export const getDefaultSectionTitle = (href?: string): string | undefined => {
    if (!href) return undefined;
    
    if (href.startsWith(ROUTES.ACCOUNT.BASE)) return SECTION_TITLES.ACCOUNT;
    if (href.startsWith(ROUTES.SALE.BASE)) return SECTION_TITLES.SALE;
    if (href.includes('/admin')) return SECTION_TITLES.ADMIN;
    return undefined;
};

export const createIconMap = (iconClassName: string) => {
    return {
        [ROUTES.HOME]: <IoHomeOutline className={iconClassName} />,
        [ROUTES.SALE.BASE]: <ImPriceTags className={iconClassName} />,
        [ROUTES.ACCOUNT.BASE]: <IoPersonOutline className={iconClassName} />,
        [ROUTES.ACCOUNT.MY_RABBITS]: <MdPets className={iconClassName} />,
        [ROUTES.SALE.RABBITS]: <MdPets className={iconClassName} />,
        [ROUTES.ADMIN.USERS]: <FaUsersCog className={iconClassName} />
    };
};

// ============= ROLLER =============
export const BREEDER_ROLES: UserRole[] = [
  ...roleGroups.breeders as UserRole[], 
  'Admin' as UserRole, 
  'ModeratorBreeder' as UserRole
];

export const MODERATOR_ROLES: UserRole[] = [
  ...roleGroups.moderators as UserRole[],
  'Admin' as UserRole
];

// ============= NAVIGATION DEFINITIONER =============
export const navigationLinks: NavGroup[] = [
    {
        title: "Konto",
        links: [
            { href: ROUTES.ACCOUNT.BASE, label: 'Min side', requiresAuth: true },
            { href: ROUTES.ACCOUNT.PROFILE, label: 'Brugerprofil', requiresAuth: true },
        ]
    }
];

export const breederNavigationLinks: NavGroup[] = [
    {
        title: "Avler funktioner",
        links: [
            {
                href: ROUTES.ACCOUNT.MY_RABBITS,
                label: 'Mine kaniner',
                requiresAuth: true,
                requiredRoles: BREEDER_ROLES
            },
            {
                href: ROUTES.ACCOUNT.RABBITS_FOR_BREEDING,
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
                href: ROUTES.ADMIN.USERS,
                label: 'Find bruger',
                requiresAuth: true,
                requiredRoles: MODERATOR_ROLES
            },
            {
                href: ROUTES.ADMIN.POSTS,
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
            { href: ROUTES.ANCHORS.WELCOME, label: 'Velkommen til' },
            { href: ROUTES.ANCHORS.NEWS, label: 'Nyheder' },
            // { href: ROUTES.ANCHORS.EVENTS, label: 'Arrangementer' },
            // { href: ROUTES.ANCHORS.FEATURED, label: 'Fremhævede' }
        ]
    }
];

export const saleNavigationLinks: NavGroup[] = [
    {
        title: "Kategorier",
        links: [
            { href: ROUTES.SALE.BASE, label: 'Salg' },
            { href: ROUTES.SALE.RABBITS, label: 'Kaniner', requiresAuth: false },
            { href: ROUTES.SALE.WOOL, label: 'Uld', disabled: true }
        ]
    }
];

export const topNavigationLinks: NavGroup[] = [
  {
    title: "Hovedmenu",
    links: [
      { href: ROUTES.SALE.BASE, label: 'Til salg' },
      { href: ROUTES.BREEDERS, label: 'Opdrættere', disabled: true },
      { href: ROUTES.CARE, label: 'Pleje & pasning', disabled: true },
      { href: ROUTES.ABOUT, label: 'Om os' }
    ]
  }
];

export const ROUTE_UTILS = {
  // Checker om en path er under account sektion
  isAccountRoute: (path: string) => path.startsWith(ROUTES.ACCOUNT.BASE),
  
  // Checker om en path er under sale sektion
  isSaleRoute: (path: string) => path.startsWith(ROUTES.SALE.BASE),
  
  // Checker om en path er admin route
  isAdminRoute: (path: string) => path.includes('/admin'),
  
  // Få parent route
  getParentRoute: (path: string) => {
    const segments = path.split('/').filter(Boolean);
    return segments.length > 1 ? `/${segments[0]}` : '/';
  }
} as const;