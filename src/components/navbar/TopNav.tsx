// src/components/navbar/TopNav.tsx
'use client'
import NextLink from 'next/link';
import Image from 'next/image';
import { 
    Navbar, NavbarBrand, NavbarContent, NavbarItem, 
    Dropdown, DropdownTrigger, DropdownMenu, 
    DropdownItem, Tooltip 
} from "@heroui/react";
import { PiUserCircleFill, PiUserCircleCheckFill } from "react-icons/pi";
import { MdOutlineLogout } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import LoginModal from '../modals/login/loginModal';

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
                <Navbar isBordered className="h-16 bg-zinc-900/70 backdrop-blur-md backdrop-saturate-150 rounded-lg nav-text" maxWidth="full">
                    <NavbarContent justify="start">
                        <NavbarBrand>
                            <NextLink href="/" className="flex items-center gap-2">
                                <Image 
                                    src="/images/DB-Angora.png" 
                                    alt="DenBlå-Angora Logo" 
                                    width={40} 
                                    height={40} 
                                    className="rounded-sm" 
                                />
                                <p className="font-bold">DenBlå-Angora</p>
                            </NextLink>
                        </NavbarBrand>

                        <NavbarContent className="hidden sm:flex gap-4">
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
                                    <span className="cursor-not-allowed text-zinc-300/50 nav-text">
                                        Opdrætter & race katalog
                                    </span>
                                </NavbarItem>
                            </Tooltip>
                            <Tooltip
                                content={<span className="nav-tooltip">Under udvikling</span>}
                                placement="bottom"
                                closeDelay={0}
                            >
                                <NavbarItem>
                                    <span className="cursor-not-allowed text-zinc-300/50 nav-text">
                                        Pleje & pasning
                                    </span>
                                </NavbarItem>
                            </Tooltip>
                        </NavbarContent>
                    </NavbarContent>

                    <NavbarContent as="div" justify="end">
                        {isLoggedIn ? (
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <div className="flex items-center gap-5 cursor-pointer">
                                        <div className="flex flex-col items-end">
                                            <span className="text-slate-300 nav-text">{userName}</span>
                                            <span className="text-xs text-warning-300">{userRole}</span>
                                        </div>
                                        <PiUserCircleCheckFill size={32} className="text-primary hover:text-primary-400" />
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profil handlinger" className="nav-dropdown text-zinc-600">
                                    <DropdownItem key="min-side" textValue="Min side">
                                        <NextLink href="/account" className="w-full block nav-text">
                                            Min side
                                        </NextLink>
                                    </DropdownItem>
                                    <DropdownItem key="profile" textValue="Bruger profil">
                                        <NextLink href="/account/profile" className="w-full block nav-text">
                                            Bruger profil
                                        </NextLink>
                                    </DropdownItem>
                                    <DropdownItem 
                                        key="logout" 
                                        className="text-danger nav-text" 
                                        textValue="Log ud"
                                        onPress={logout}
                                    >
                                        <div className="flex items-center gap-2">
                                            <MdOutlineLogout size={20} />
                                            Log ud
                                        </div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsLoginOpen(true)}>
                                <span className="text-zinc-400 hover:text-zinc-200 nav-text">Log ind</span>
                                <PiUserCircleFill size={32} className="text-zinc-400 hover:text-zinc-200" />
                            </div>
                        )}
                    </NavbarContent>
                </Navbar>
            </div>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}