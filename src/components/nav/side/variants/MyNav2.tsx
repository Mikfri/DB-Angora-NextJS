// src/components/nav/side/variants/MyNav2.tsx
'use client'
import { usePathname } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import { IoHomeOutline, IoPersonOutline } from "react-icons/io5";
import { MdPets } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { ImPriceTags } from 'react-icons/im';
import NavBase from '../../base/NavBase';
import { 
    breederNavigationLinks, 
    moderatorNavigationLinks,
    navigationLinks,
    homeNavigationLinks,
    saleNavigationLinks,
    BREEDER_ROLES,
    MODERATOR_ROLES 
} from '@/constants/navigation';
import { NavGroup } from '@/types/navigation';
import { hasAnyRole } from '@/types/auth';

// Brug Const Assertions for literals
const SECTION_TITLES = {
    ACCOUNT: 'Min konto',
    SALE: 'Salg',
    ADMIN: 'Administration',
    BREEDER: 'Avler funktioner'
} as const;

// Brug Const Assertions for objekt med styles
const itemStyles = {
    base: "px-1 py-0",
    mainLink: "font-semibold",
    subLink: "pl-4",
    active: "text-primary",
    divider: "bg-zinc-700/50 my-1",
    icon: "text-xl text-default-500",
    disabledText: "ml-2 text-xs text-default-400"
} as const;

// Bruge Map-objektet for bedre lookup-performance
const ICON_MAP = new Map([
    ['/', <IoHomeOutline key="home" className={itemStyles.icon} />],
    ['/sale', <ImPriceTags key="sale" className={itemStyles.icon} />],
    ['/account', <IoPersonOutline key="account" className={itemStyles.icon} />],
    ['/account/myRabbits', <MdPets key="myRabbits" className={itemStyles.icon} />],
    ['/sale/rabbits', <MdPets key="rabbits" className={itemStyles.icon} />],
    ['/admin/users', <FaUsersCog key="users" className={itemStyles.icon} />]
]);

export default function MyNav() {
    const pathname = usePathname();
    const { isLoggedIn, userIdentity } = useAuthStore();

    // Bruge Map.get() direkte for O(1) lookup
    const getIconForLink = useCallback((href: string) => {
        return ICON_MAP.get(href) ?? null;
    }, []);

    // Brug optional chaining og nullish coalescing
    const getSectionTitle = useCallback((group: NavGroup): string | undefined => {
        // Nullish coalescing operator for conditionals
        return group.title ?? getDefaultSectionTitle(group.links[0]?.href);
    }, []);
    
    // Pure function for at bestemme default section title
    const getDefaultSectionTitle = (href?: string): string | undefined => {
        if (!href) return undefined;
        
        // Bruge nullish coalescing på falsy values
        if (href.startsWith('/account')) return SECTION_TITLES.ACCOUNT;
        if (href.startsWith('/sale')) return SECTION_TITLES.SALE;
        if (href.includes('/admin')) return SECTION_TITLES.ADMIN;
        return undefined;
    };

    // Moderne memoization pattern med dependency array
    const { hasBreederRoles, hasModeratorRoles } = useMemo(() => ({
        hasBreederRoles: hasAnyRole(userIdentity, BREEDER_ROLES),
        hasModeratorRoles: hasAnyRole(userIdentity, MODERATOR_ROLES)
    }), [userIdentity]);

    // Brug af optional chaining og array spread
    const currentLinks = useMemo(() => {
        // Start med en tom array som vi bygger op
        const links: NavGroup[] = [];
    
        // Udnyt optional chaining i conditions
        if (pathname === '/') {
            links.push(...homeNavigationLinks);
        } else if (pathname?.startsWith('/sale')) {
            links.push(...saleNavigationLinks);
        }
    
        // Kortere betingelser med optional chaining og logical AND
        isLoggedIn && links.push(...navigationLinks);
        isLoggedIn && hasBreederRoles && links.push(...breederNavigationLinks);
        isLoggedIn && hasModeratorRoles && links.push(...moderatorNavigationLinks);
    
        return links;
    }, [pathname, isLoggedIn, hasBreederRoles, hasModeratorRoles]);

    // Brug flatMap og arrow function for koncis kode
    const disabledKeys = useMemo(() => 
        currentLinks.flatMap(group => 
            group.links
              .filter(link => link.disabled)
              .map(link => link.href)
        )
    , [currentLinks]);

    // Early return for edge case
    if (!currentLinks.length) return null;

    return (
        <NavBase title="Navigation">
            <div className="w-full">
                <Listbox
                    aria-label="Navigation menu"
                    variant="flat"
                    className="p-0 gap-0"
                    disabledKeys={new Set(disabledKeys)} // Brug Set for O(1) lookup
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
                            {/* Brug logical AND for conditional rendering */}
                            {group.links?.map((link) => {
                                // Template literal med conditional expressions
                                const classNames = `
                                    ${(link.href === '/account' || link.href === '/sale') 
                                        ? itemStyles.mainLink 
                                        : itemStyles.subLink}
                                    ${pathname === link.href ? itemStyles.active : ''}
                                `;
                                
                                return (
                                    <ListboxItem
                                        key={link.href}
                                        href={link.href}
                                        textValue={link.label}
                                        className={classNames}
                                        startContent={getIconForLink(link.href)}
                                    >
                                        {link.label}
                                        {/* Logical AND for conditional rendering */}
                                        {link.disabled && (
                                            <span className={itemStyles.disabledText}>
                                                (kommer snart)
                                            </span>
                                        )}
                                    </ListboxItem>
                                );
                            })}
                        </ListboxSection>
                    ))}
                </Listbox>
            </div>
        </NavBase>
    );
}