// src/constants/navigationConstants.tsx
import { roleGroups } from "@/types/authTypes";
import { NavGroup } from "@/types/navigationTypes";
import { IoHomeOutline, IoPersonOutline } from "react-icons/io5";
import { MdPets } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { ImPriceTags } from 'react-icons/im';

// ============= ROUTES KONSTANTER =============
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOGS: {
    BASE: '/blogs',
    BLOG: (slug: string) => `/blogs/${slug}`,
  },
  ACCOUNT: {
    BASE: '/account',
    PROFILE: '/account/profile',
    USER_PROFILE: (userProfileId: string) => `/account/profile/${userProfileId}`,
    MY_RABBITS: '/account/myRabbits',
    TRANSFER_REQUESTS: '/account/myRabbits/transferRequests',
    RABBIT_PROFILE: (earCombId: string) => `/account/myRabbits/rabbitProfile/${earCombId}`,
    RABBITS_FOR_BREEDING: '/account/rabbitsForbreeding',
    RABBIT_BREEDING_PROFILE: (earCombId: string) => `/account/rabbitsForbreeding/rabbitBreedingProfile/${earCombId}`,
    MY_BLOGS: '/account/myBlogs',
    CREATE_BLOG: '/account/myBlogs/createBlog',
    USER_BLOGS: (userId: string) => `/account/myBlogs/${userId}`,
    BLOG_WORKSPACE: (blogId: number) => `/account/myBlogs/blogWorkspace/${blogId}`,
    BLOG_WORKSPACE_BASE: '/account/myBlogs/blogWorkspace',

  },
  SALE: {
    BASE: '/annoncer',
    RABBITS: '/annoncer/kaniner',
    WOOLS: '/annoncer/wool',
    RABBIT_PROFILE: (id: string) => `/annoncer/kaniner/profile/${id}`,
    RABBIT: (slug: string) => `/annoncer/kaniner/${slug}`,
    WOOL_PROFILE: (id: string) => `/annoncer/uld/profile/${id}`,
    WOOL: (slug: string) => `/annoncer/uld/${slug}`,
  },
  ADMIN: {
    USERS: '/admin/users',
    POSTS: '/admin/posts',
  },
  BREEDERS: '/breeders',
  CARE: '/care',
  ANCHORS: {
    WELCOME: '#welcome',
    NEWS: '#news',
    EVENTS: '#events',
    FEATURED: '#featured',
  }
} as const;

// ============= UI KONSTANTER =============
export const SECTION_TITLES = {
  ACCOUNT: 'Konto',
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

export const createIconMap = (iconClassName: string) => ({
  [ROUTES.HOME]: <IoHomeOutline className={iconClassName} />,
  [ROUTES.SALE.BASE]: <ImPriceTags className={iconClassName} />,
  [ROUTES.ACCOUNT.BASE]: <IoPersonOutline className={iconClassName} />,
  [ROUTES.ACCOUNT.MY_RABBITS]: <MdPets className={iconClassName} />,
  [ROUTES.SALE.RABBITS]: <MdPets className={iconClassName} />,
  [ROUTES.ADMIN.USERS]: <FaUsersCog className={iconClassName} />
});

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
        requiredRoles: roleGroups.breeders
      },
      {
        href: ROUTES.ACCOUNT.RABBITS_FOR_BREEDING,
        label: 'Find avlskaniner',
        requiresAuth: true,
        requiredRoles: roleGroups.breeders
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
        requiredRoles: roleGroups.moderators
      },
      {
        href: ROUTES.ADMIN.POSTS,
        label: 'Opret indlæg',
        requiresAuth: true,
        requiredRoles: roleGroups.moderators
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
    ]
  }
];

export const saleNavigationLinks: NavGroup[] = [
  {
    title: "Kategorier",
    links: [
      { href: ROUTES.SALE.BASE, label: 'Salg' },
      { href: ROUTES.SALE.RABBITS, label: 'Kaniner', requiresAuth: false },
      { href: ROUTES.SALE.WOOLS, label: 'Uld', disabled: true }
    ]
  }
];

export const topNavigationLinks: NavGroup[] = [
  {
    title: "Hovedmenu",
    links: [
      { href: ROUTES.SALE.BASE, label: 'Salg' },
      { href: ROUTES.BLOGS.BASE, label: 'Blogs' },
      { href: ROUTES.BREEDERS, label: 'Opdrættere', disabled: true },
      { href: ROUTES.CARE, label: 'Pleje & pasning', disabled: true },
      { href: ROUTES.ABOUT, label: 'Om os' }
    ]
  }
];

export const ROUTE_UTILS = {
  isAccountRoute: (path: string) => path.startsWith(ROUTES.ACCOUNT.BASE),
  isSaleRoute: (path: string) => path.startsWith(ROUTES.SALE.BASE),
  isAdminRoute: (path: string) => path.includes('/admin'),
  getParentRoute: (path: string) => {
    const segments = path.split('/').filter(Boolean);
    return segments.length > 1 ? `/${segments[0]}` : '/';
  }
} as const;