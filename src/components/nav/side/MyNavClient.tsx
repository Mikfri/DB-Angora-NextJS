// src/components/nav/side/MyNavClient.tsx
'use client'
import { usePathname } from 'next/navigation';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import {
    breederNavigationLinks,
    moderatorNavigationLinks,
    navigationLinks,
    homeNavigationLinks,
    saleNavigationLinks,
    NAV_STYLES,
    createIconMap,
    getDefaultSectionTitle,
    ROUTES,
    ROUTE_UTILS
} from '@/constants/navigationConstants';
import { NavGroup } from '@/types/navigationTypes';
import { hasAnyRole, roleGroups } from '@/types/authTypes';

/**
 * Client Component for MyNav
 * Handles auth-based filtering and interactive elements
 */
export function MyNavClient() {
    const pathname = usePathname();
    const { isLoggedIn, userIdentity } = useAuthStore();
    
    // Track hash for anchor links
    const [hash, setHash] = useState('');
    
    // Ny state for active section på forsiden (scroll spying)
    const [activeSection, setActiveSection] = useState<string | null>(null);
    
    useEffect(() => {
        // Initial hash
        setHash(window.location.hash);
        
        // Listen for hash changes
        const handleHashChange = () => {
            setHash(window.location.hash);
        };
        
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Scroll spying for forsiden sektioner
    useEffect(() => {
        if (pathname !== ROUTES.HOME) return; // Kun på forsiden

        const sections = ['welcome', 'news', 'updates']; // Matcher section id'er fra HomeContent.tsx
        const observers: IntersectionObserver[] = [];

        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(`/#${sectionId}`); // Matcher ROUTES.ANCHORS format
                    }
                },
                {
                    rootMargin: '-50% 0px -50% 0px', // Aktiver når sektionen er 50% i view
                    threshold: 0
                }
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, [pathname]);

    // Combine pathname + hash for matching (fallback til activeSection på forsiden)
    const fullPath = useMemo(() => {
        if (pathname === ROUTES.HOME && activeSection) {
            return activeSection; // Brug scroll-detekteret sektion på forsiden
        }
        if (hash) {
            return pathname === '/' ? `/${hash}` : `${pathname}${hash}`;
        }
        return pathname;
    }, [pathname, hash, activeSection]);

    // Brug icon factory funktion fra navigation.ts - ikoner med text-current så de arver farve
    const ICON_MAP = useMemo(() =>
        new Map(Object.entries(createIconMap("text-lg text-current")))
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
        hasBreederRoles: hasAnyRole(userIdentity, roleGroups.breeders),
        hasModeratorRoles: hasAnyRole(userIdentity, roleGroups.moderators)
    }), [userIdentity]);

    // Opdateret current links logik med ROUTES konstanter
    const currentLinks = useMemo(() => {
        const links: NavGroup[] = [];

        if (pathname === ROUTES.HOME) {
            links.push(...homeNavigationLinks);
        } else if (ROUTE_UTILS.isSaleRoute(pathname || '')) {
            links.push(...saleNavigationLinks);
        } else if (ROUTE_UTILS.isAccountRoute(pathname || '')) {
            links.push(...navigationLinks);
        }

        // Tilføj kun ekstra sektioner hvis ikke allerede tilføjet
        if (!ROUTE_UTILS.isAccountRoute(pathname || '') && isLoggedIn) {
            links.push(...navigationLinks);
        }
        if (isLoggedIn && hasBreederRoles) links.push(...breederNavigationLinks);
        if (isLoggedIn && hasModeratorRoles) links.push(...moderatorNavigationLinks);

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
            disabledKeys={new Set(disabledKeys)}
            selectedKeys={[fullPath]}
            selectionMode="single"
            //selectionIcon= // <--- Ændret: Fjerner fluebens ikonet helt (i stedet for showSelectionIcon)
            classNames={{
                base: "px-1 py-0"
            }}
            itemClasses={{
                base: [
                    "group", // add group so icons can react to hover/selected via group- classes
                    // Hover: blue pill + white text
                    "data-[hover=true]:bg-primary/100",
                    "data-[hover=true]:text-white",
                    "data-[hover=true]:rounded-md",
                    // Selected: identical to hover
                    "data-[selected=true]:bg-primary/100",
                    "data-[selected=true]:text-white",
                    "data-[selected=true]:rounded-md",
                ],
                // Fjernet endContent - ikke tilladt i slot-typen
            }}
        >
            {currentLinks.map((group, groupIndex) => (
                <ListboxSection
                    key={`nav-group-${groupIndex}`}
                    title={getSectionTitle(group)}
                    showDivider={groupIndex < currentLinks.length - 1}
                    hideSelectedIcon={true} // <--- Tilføjet: Fjerner fluebens ikonet i hele sektionen
                    classNames={{
                        divider: "divider mt-1"
                    }}
                >
                    {group.links?.map((link) => {
                        const classNames = (link.href === ROUTES.ACCOUNT.BASE || link.href === ROUTES.SALE.BASE)
                            ? "font-semibold"
                            : "pl-4";

                        return (
                            <ListboxItem
                                key={link.href}
                                value={link.href}
                                href={link.href}
                                textValue={link.label}
                                className={classNames}
                                startContent={getIconForLink(link.href)}
                                selectedIcon={null} // <--- Tilføjet: Fjerner fluebens ikonet på dette item
                            >
                                {link.label}
                                {link.disabled && (
                                    <span className="ml-2 text-xs text-muted">(kommer snart)</span>
                                )}
                            </ListboxItem>
                        );
                    })}
                </ListboxSection>
            ))}
        </Listbox>
    );
}