// src/components/sectionNav/variants/myNav.tsx
// https://www.heroui.com/docs/components/listbox
// TODO: Find ud af hvorfor vi får warning nedenfor efter 'npm run build':
// <Item> with non-plain text contents is unsupported by type to select for accessibility. Please add a `textValue` prop.
'use client'
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import { IoHomeOutline, IoPersonOutline } from "react-icons/io5";
import { MdPets, MdShoppingCart } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import SectionNav, { breederNavigationLinks, moderatorNavigationLinks } from '../base/baseSideNav';
import { 
    navigationLinks,
    homeNavigationLinks,
    saleNavigationLinks,
    type NavGroup 
} from '../base/baseSideNav';

export default function MyNav() {
    const pathname = usePathname();
    const { isLoggedIn, userRole, refresh } = useAuth();

    useEffect(() => {
        refresh();
    }, [refresh]);

    const getIconForLink = (href: string) => {
        switch (href) {
            case '/':
                return <IoHomeOutline className="text-xl text-default-500" />;
            case '/sale':
                return <MdShoppingCart className="text-xl text-default-500" />;
            case '/account':
                return <IoPersonOutline className="text-xl text-default-500" />;
            case '/account/myRabbits':
            case '/sale/rabbits':
                return <MdPets className="text-xl text-default-500" />;
            case '/admin/users':
                return <FaUsersCog className="text-xl text-default-500" />;
            default:
                return null;
        }
    };

    const getDisabledKeys = (links: NavGroup[]) => {
        const disabledKeys: string[] = [];
        links.forEach(group => {
            group.links.forEach(link => {
                if (link.disabled) {
                    disabledKeys.push(link.href);
                }
            });
        });
        return disabledKeys;
    };

    const currentLinks = useMemo(() => {
        const links: NavGroup[] = [];

        // Add page-specific navigation first
        if (pathname === '/') {
            links.push(...homeNavigationLinks);
        } else if (pathname.startsWith('/sale')) {
            links.push(...saleNavigationLinks);
        }

        // Add user navigation if logged in
        if (isLoggedIn) {
            links.push(...navigationLinks);
            
            // Add role-specific links
            if (userRole) {
                if (['BreederBasic', 'BreederPremium', 'Admin'].includes(userRole)) {
                    links.push(...breederNavigationLinks);
                }
                if (['Moderator', 'Admin'].includes(userRole)) {
                    links.push(...moderatorNavigationLinks);
                }
            }
        }

        return links;
    }, [pathname, isLoggedIn, userRole]);

    return (
        <SectionNav title="Navigation">
            <div className="w-full">
                <Listbox
                    aria-label="Navigation menu"
                    variant="flat"
                    className="p-0 gap-0 divide-y divide-default-100/50"
                    disabledKeys={getDisabledKeys(currentLinks)}
                >
                    {currentLinks.map((group, groupIndex) => (
                        <ListboxSection
                            key={groupIndex}
                            title={group.links[0].href === '/account' ? 'Min konto' : 
                                  group.links[0].href === '/sale' ? 'Salg' : 
                                  group.links[0].href.includes('/admin') ? 'Administration' : 
                                  undefined}
                            showDivider={groupIndex < currentLinks.length - 1}
                        >
                            {group.links.map((link) => {
                                const isMainLink = link.href === '/account' || link.href === '/sale';
                                const icon = getIconForLink(link.href);
                                
                                return (
                                    <ListboxItem
                                        key={link.href}
                                        href={link.href}
                                        className={`
                                            ${isMainLink ? 'font-medium' : 'pl-4'}
                                            ${pathname === link.href ? 'text-primary' : ''}
                                        `}
                                        startContent={icon}
                                    >
                                        {link.label}
                                        {link.disabled && (
                                            <span className="ml-2 text-xs text-default-400">
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
        </SectionNav>
    );
}