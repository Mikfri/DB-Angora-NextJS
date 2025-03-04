// src/components/sectionNav/variants/myNav.tsx
'use client'
import { usePathname } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import { IoHomeOutline, IoPersonOutline } from "react-icons/io5";
import { MdPets } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { ImPriceTags } from 'react-icons/im';
import SectionNav, { 
    breederNavigationLinks, 
    moderatorNavigationLinks,
    navigationLinks,
    homeNavigationLinks,
    saleNavigationLinks,
    type NavGroup 
} from '../base/baseSideNav';

// Constants for better maintainability
const SECTION_TITLES = {
    ACCOUNT: 'Min konto',
    SALE: 'Salg',
    ADMIN: 'Administration',
    BREEDER: 'Avler funktioner'
} as const;

// Item styling configuration
const itemStyles = {
    base: "px-1 py-0",
    mainLink: "font-semibold",
    subLink: "pl-4",
    active: "text-primary",
    divider: "bg-zinc-700/50 my-1",
    icon: "text-xl text-default-500",
    disabledText: "ml-2 text-xs text-default-400"
} as const;

// Icon mapping for better maintainability and performance
const ICON_MAP = {
    '/': <IoHomeOutline className={itemStyles.icon} />,
    '/sale': <ImPriceTags className={itemStyles.icon} />,
    '/account': <IoPersonOutline className={itemStyles.icon} />,
    '/account/myRabbits': <MdPets className={itemStyles.icon} />,
    '/sale/rabbits': <MdPets className={itemStyles.icon} />,
    '/admin/users': <FaUsersCog className={itemStyles.icon} />
};

export default function MyNav() {
    const pathname = usePathname();
    const { isLoggedIn, userRole } = useAuthStore();
    //const { isLoggedIn, userRole, checkAuth } = useAuthStore();   
    // udkommenteret ovenstående og nedestående grundet TopNav allerede har kaldt checkAuth


    // Simplified useEffect without subscription    
    // useEffect(() => {
    //     // Refresh auth state ved mount
    //     checkAuth();
    // }, [checkAuth]);

    // Stable function for icon retrieval
    const getIconForLink = useCallback((href: string) => {
        return ICON_MAP[href as keyof typeof ICON_MAP] ?? null;
    }, []);

    // Stable function for section title retrieval
    const getSectionTitle = useCallback((group: NavGroup): string | undefined => {
        // Use the group's title if it exists
        if (group.title) return group.title;
        
        // Fallback to default titles based on href
        const firstLink = group.links[0];
        if (firstLink.href.startsWith('/account')) return SECTION_TITLES.ACCOUNT;
        if (firstLink.href.startsWith('/sale')) return SECTION_TITLES.SALE;
        if (firstLink.href.includes('/admin')) return SECTION_TITLES.ADMIN;
        return undefined;
    }, []);

    // Memoize the current links to prevent unnecessary recalculations
    const currentLinks = useMemo(() => {
        const links: NavGroup[] = [];
    
        // First add home/sale navigation
        if (pathname === '/') {
            links.push(...homeNavigationLinks);
        } else if (pathname.startsWith('/sale')) {
            links.push(...saleNavigationLinks);
        }
    
        if (isLoggedIn) {
            // Add regular navigation links first (account related)
            links.push(...navigationLinks);
    
            // Then add role-based links if they exist
            if (userRole) {
                const roleBasedLinks = {
                    'BreederBasic': breederNavigationLinks,
                    'BreederPremium': breederNavigationLinks,
                    'Admin': [...moderatorNavigationLinks, ...breederNavigationLinks],
                    'Moderator': [...moderatorNavigationLinks, ...breederNavigationLinks]
                }[userRole];
    
                if (roleBasedLinks) {
                    links.push(...roleBasedLinks);
                }
            }
        }
    
        return links;
    }, [pathname, isLoggedIn, userRole]);

    // Memoize disabled keys for performance
    const disabledKeys = useMemo(() => {
        return currentLinks.flatMap(group => 
            group.links.filter(link => link.disabled).map(link => link.href)
        );
    }, [currentLinks]);

    return (
        <SectionNav title="Navigation">
            <div className="w-full">
                <Listbox
                    aria-label="Navigation menu"
                    variant="flat"
                    className="p-0 gap-0"
                    disabledKeys={disabledKeys}
                    classNames={{ base: itemStyles.base }}
                >
                    {currentLinks.map((group, groupIndex) => (
                        <ListboxSection
                            key={`nav-group-${groupIndex}`}
                            title={getSectionTitle(group)}
                            showDivider={groupIndex < currentLinks.length - 1}
                            classNames={{
                                divider: "bg-zinc-200/50 mt-1"
                            }}
                        >
                            {group.links.map((link) => (
                                <ListboxItem
                                    key={link.href}
                                    href={link.href}
                                    textValue={link.label}
                                    className={`
                                        ${link.href === '/account' || link.href === '/sale' 
                                            ? itemStyles.mainLink 
                                            : itemStyles.subLink}
                                        ${pathname === link.href ? itemStyles.active : ''}
                                    `}
                                    startContent={getIconForLink(link.href)}
                                >
                                    {link.label}
                                    {link.disabled && (
                                        <span className={itemStyles.disabledText}>
                                            (kommer snart)
                                        </span>
                                    )}
                                </ListboxItem>
                            ))}
                        </ListboxSection>
                    ))}
                </Listbox>
            </div>
        </SectionNav>
    );
}