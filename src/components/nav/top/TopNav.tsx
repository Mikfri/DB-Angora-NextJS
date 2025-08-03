// src/components/nav/top/TopNav.tsx (ny unified komponent)
'use client'
import {
    Dropdown, DropdownTrigger, DropdownMenu,
    DropdownItem, Chip
} from "@heroui/react";
import { PiUserCircleFill, PiUserCircleCheckFill } from "react-icons/pi";
import { MdOutlineLogout } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { topNavigationLinks } from '@/constants/navigation';
import { filterLink } from '@/utils/navigation';
import LoginModal from '@/components/modals/login/loginModal';
import { roleDisplayNames } from '@/types/auth';

export default function TopNav() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { 
        isLoggedIn, 
        userName, 
        userRole, 
        userIdentity, 
        logout, 
        checkAuth,
        isLoading 
    } = useAuthStore();

    // Initialiser auth check når komponenten mounter
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Luk login modal når bruger logger ind
    useEffect(() => {
        if (isLoggedIn) {
            setIsLoginOpen(false);
        }
    }, [isLoggedIn]);

    // Få roller direkte fra userIdentity
    const roles = userIdentity?.roles || [];
    const hasMultipleRoles = roles.length > 1;

    // Hent hovednavigationslinks fra vores centraliserede navigation
    const mainNavLinks = [
        ...topNavigationLinks[0].links
    ]
        .filter(link => !link.disabled)
        .filter(link => filterLink(link, isLoggedIn, userIdentity))
        .map(link => ({
            href: link.href,
            label: link.label,
            key: link.href.replace(/\//g, '-').slice(1) || 'home'
        }));

    return (
        <div className="w-full">
            <div className="h-16 bg-zinc-900/70 backdrop-blur-md backdrop-saturate-150 border-b border-zinc-800">
                <div className="w-full h-full px-4 mx-auto flex items-center justify-between">
                    {/* Branding */}
                    <div className="flex items-center">
                        {/* <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/images/DB-Angora.png"
                                alt="DenBlå-Angora Logo"
                                width={40}
                                height={40}
                                className="rounded-sm"
                                priority
                            />
                            <p className="font-bold text-zinc-100">DenBlå-Angora</p>
                        </Link> */}
                        <Link href="/" className="flex items-center gap-2 dark">
                            <Image
                                src="/images/DB-Angora.png"
                                alt="DenBlå-Angora Logo"
                                width={40}
                                height={40}
                                className="rounded-sm"
                                priority
                            />
                            <p className="font-bold text-zinc-100">DenBlå-Angora</p>
                            <Chip
                                color="danger"
                                variant="shadow"
                                size="sm"
                                className="ml-2 font-bold tracking-wide"
                            >
                                v0.22 ALPHA 
                            </Chip>
                        </Link>
                        
                        {/* Nav Links */}
                        <div className="hidden sm:flex ml-8 gap-6">
                            {mainNavLinks.map(link => (
                                <Link 
                                    key={link.key} 
                                    href={link.href}
                                    className="text-zinc-300 hover:text-zinc-100 nav-text"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    {/* Auth section */}
                    {isLoading ? (
                        <div className="w-8 h-8 animate-pulse bg-zinc-700 rounded-full" />
                    ) : isLoggedIn ? (
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <div className="flex items-center gap-5 cursor-pointer">
                                    <div className="flex flex-col items-end">
                                        <span className="text-slate-300 nav-text">{userName}</span>
                                        {hasMultipleRoles ? (
                                            <div className="flex gap-1 mt-1 flex-wrap justify-end">
                                                {roles.map(role => (
                                                    <Chip
                                                        key={role}
                                                        size="sm"
                                                        color="warning"
                                                        variant="light"
                                                        className="text-[10px] h-4 px-1"
                                                    >
                                                        {roleDisplayNames[role] || role}
                                                    </Chip>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-warning-300">{userRole}</span>
                                        )}
                                    </div>
                                    <PiUserCircleCheckFill size={32} className="text-primary hover:text-primary-400" />
                                </div>
                            </DropdownTrigger>

                            <DropdownMenu aria-label="Profil handlinger" className="nav-dropdown text-zinc-600">
                                <DropdownItem 
                                    key="min-side" 
                                    textValue="Min side"
                                    href="/account"
                                    className="nav-text"
                                >
                                    Min side
                                </DropdownItem>
                                <DropdownItem 
                                    key="profile" 
                                    textValue="Bruger profil"
                                    href="/account/profile" 
                                    className="nav-text"
                                >
                                    Bruger profil
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
                </div>
            </div>
            
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
    );
}