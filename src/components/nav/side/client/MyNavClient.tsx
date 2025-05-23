// src/components/nav/side/variants/MyNavClient.tsx
'use client'
import { usePathname } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import { 
    breederNavigationLinks, 
    moderatorNavigationLinks,
    navigationLinks,
    homeNavigationLinks,
    saleNavigationLinks,
    BREEDER_ROLES,
    MODERATOR_ROLES,
    NAV_STYLES,
    createIconMap,
    getDefaultSectionTitle
} from '@/constants/navigation';
import { NavGroup } from '@/types/navigation';
import { hasAnyRole } from '@/types/auth';

/**
 * Client Component for MyNav
 * Handles auth-based filtering and interactive elements
 */
export function MyNavClient() {
    const pathname = usePathname();
    const { isLoggedIn, userIdentity } = useAuthStore();

    // Brug icon factory funktion fra navigation.ts
    const ICON_MAP = useMemo(() => 
        new Map(Object.entries(createIconMap(NAV_STYLES.icon)))
    , []);

    // Forenklet getIconForLink funktion med ICON_MAP
    const getIconForLink = useCallback((href: string) => {
        return ICON_MAP.get(href) ?? null;
    }, [ICON_MAP]);

    // Brug centraliseret getDefaultSectionTitle
    const getSectionTitle = useCallback((group: NavGroup): string | undefined => {
        return group.title ?? getDefaultSectionTitle(group.links[0]?.href);
    }, []);

    // Role checks bruger memoization for bedre performance
    const { hasBreederRoles, hasModeratorRoles } = useMemo(() => ({
        hasBreederRoles: hasAnyRole(userIdentity, BREEDER_ROLES),
        hasModeratorRoles: hasAnyRole(userIdentity, MODERATOR_ROLES)
    }), [userIdentity]);

    // Current links logik med conditional chaining
    const currentLinks = useMemo(() => {
        const links: NavGroup[] = [];
    
        if (pathname === '/') {
            links.push(...homeNavigationLinks);
        } else if (pathname?.startsWith('/sale')) {
            links.push(...saleNavigationLinks);
        }
    
        // Brug af logical AND for bedre læsbarhed
        isLoggedIn && links.push(...navigationLinks);
        isLoggedIn && hasBreederRoles && links.push(...breederNavigationLinks);
        isLoggedIn && hasModeratorRoles && links.push(...moderatorNavigationLinks);
    
        return links;
    }, [pathname, isLoggedIn, hasBreederRoles, hasModeratorRoles]);

    // Mere koncist med flatMap og arrow functions
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
        <Listbox
            aria-label="Navigation menu"
            variant="flat"
            className="p-0 gap-0"
            disabledKeys={new Set(disabledKeys)} // Brug Set for O(1) lookup
            classNames={{ base: NAV_STYLES.base }} // Brug centraliserede styles
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
                    {group.links?.map((link) => {
                        // Template literal med konditionelle klasser
                        const classNames = `
                            ${(link.href === '/account' || link.href === '/sale') 
                                ? NAV_STYLES.mainLink 
                                : NAV_STYLES.subLink}
                            ${pathname === link.href ? NAV_STYLES.active : ''}
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
                                {/* Konditionel rendering med logical AND */}
                                {link.disabled && (
                                    <span className={NAV_STYLES.disabledText}>
                                        (kommer snart)
                                    </span>
                                )}
                            </ListboxItem>
                        );
                    })}
                </ListboxSection>
            ))}
        </Listbox>
    );
}