// src/components/navbar/TopNav.tsx
'use client'
import NextLink from 'next/link';
import Image from 'next/image';
import { Navbar, NavbarBrand, NavbarItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip } from "@nextui-org/react";
import { PiUserCircleFill, PiUserCircleCheckFill } from "react-icons/pi";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '../modals/loginModal';
import { navigationLinks, filterLink } from '@/components/sectionNav/base/baseSideNav';

export default function TopNav() {
    const pathname = usePathname();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { isLoggedIn, userName, userRole, logout, refresh } = useAuth();

    useEffect(() => {
        refresh();
    }, [pathname, refresh]);

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoginOpen(false);
        }
    }, [isLoggedIn]);

    return (
        <>
            <div className="sticky top-0 z-50 w-full max-w-7xl mx-auto">
                {/* First Navbar */}
                <Navbar isBordered className="h-16 bg-zinc-900/70 backdrop-blur-md backdrop-saturate-150 rounded-t-lg nav-text p-0" maxWidth="full">
                    <div className="w-full h-16 flex items-center justify-between px-4">
                        <div className="flex items-center gap-8">
                            <NavbarBrand>
                                <NextLink href="/" className="flex items-center gap-2">
                                    <Image src="/images/DB-Angora.png" alt="DenBlå-Angora Logo" width={40} height={40} className="rounded-sm" />
                                    <p className="font-bold">DenBlå-Angora</p>
                                </NextLink>
                            </NavbarBrand>

                            <div className="hidden sm:flex gap-4">
                                <NavbarItem>
                                    <NextLink
                                        href="/sale"
                                        className={pathname.startsWith('/sale') ? 'text-primary nav-text' : 'text-foreground nav-text hover:text-zinc-200'}
                                    >
                                        Til salg
                                    </NextLink>
                                </NavbarItem>
                                <Tooltip
                                    content={<span className="nav-tooltip">Under udvikling</span>}
                                    placement="bottom"
                                    closeDelay={0}
                                >
                                    <NavbarItem>
                                        <span className="cursor-not-allowed text-zinc-300/50 nav-text">Katalog</span>
                                    </NavbarItem>
                                </Tooltip>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            {isLoggedIn ? (
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <div className="flex items-center gap-5 cursor-pointer">
                                            <span className="text-slate-300 nav-text">{userName}</span>
                                            <PiUserCircleCheckFill size={32} className="text-primary hover:text-primary-400" />
                                        </div>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Profil handlinger" className="nav-dropdown text-zinc-600">
                                        <DropdownItem key="min-side">
                                            <NextLink href="/account" className="w-full block nav-text">Min side</NextLink>
                                        </DropdownItem>
                                        <DropdownItem key="profile">
                                            <NextLink href="/account/profile" className="w-full block nav-text">Bruger profil</NextLink>
                                        </DropdownItem>
                                        <DropdownItem key="logout" className="text-danger nav-text" onPress={logout}>Log ud</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            ) : (
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsLoginOpen(true)}>
                                    <span className="text-zinc-400 hover:text-zinc-200 nav-text">Log ind</span>
                                    <PiUserCircleFill size={32} className="text-zinc-400 hover:text-zinc-200" />
                                </div>
                            )}
                        </div>
                    </div>
                </Navbar>

                {/* Second Navbar - Only visible when logged in */}
                {isLoggedIn && (
                    <Navbar className="h-10 bg-zinc-900/70 backdrop-blur-md backdrop-saturate-150 rounded-b-lg nav-text p-0" maxWidth="full">
                        <div className="w-full flex items-center px-4 gap-4">
                            {navigationLinks.map((group) =>
                                group.links
                                    .filter(link => filterLink(link, isLoggedIn, userRole))
                                    .map((link) => (
                                        <NavbarItem key={link.href} className="hidden sm:flex">
                                            <NextLink
                                                href={link.href}
                                                className={`${pathname === link.href ? 'text-primary' : 'text-foreground'} nav-text px-3`}
                                            >
                                                {link.label}
                                            </NextLink>
                                        </NavbarItem>
                                    ))
                            )}
                        </div>
                    </Navbar>
                )}
            </div>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}