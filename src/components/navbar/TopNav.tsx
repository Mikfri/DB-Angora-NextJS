// src/components/navbar/TopNav.tsx
'use client'
import NextLink from 'next/link';
import Image from 'next/image';
import {
    Navbar, NavbarBrand, NavbarContent, NavbarItem,
    Dropdown, DropdownTrigger, DropdownMenu,
    DropdownItem
} from "@nextui-org/react";
import { PiUserCircleFill, PiUserCircleCheckFill } from "react-icons/pi";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '../modals/loginModal';

export default function TopNav() {
    const pathname = usePathname();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { isLoggedIn, userName, logout, refresh } = useAuth();

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
            <Navbar isBordered className="bg-zinc-900/70 backdrop-blur-md backdrop-saturate-150 max-w-7xl mx-auto rounded-lg" maxWidth="xl">
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
                        <NavbarItem isActive={pathname === '/rabbits/for-sale'}>
                            <NextLink
                                href="/rabbits/for-sale"
                                className={pathname === '/rabbits/for-sale' ? 'text-primary' : 'text-foreground'}
                            >
                                Til Salg
                            </NextLink>
                        </NavbarItem>
                        <NavbarItem isActive={pathname === '/rabbits/for-breeding'}>
                            <NextLink
                                href="/rabbits/for-breeding"
                                className={pathname === '/rabbits/for-breeding' ? 'text-primary' : 'text-foreground'}
                            >
                                Til Avl
                            </NextLink>
                        </NavbarItem>
                    </NavbarContent>
                </NavbarContent>

                <NavbarContent as="div" justify="end">
                    {isLoggedIn ? (
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <div className="flex items-center gap-5">
                                    <span className="text-slate-300"> {userName} </span>
                                    <PiUserCircleCheckFill
                                        size={32}
                                        className="text-primary hover:text-primary-400"
                                    />
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profil handlinger" className='text-zinc-600'>
                                <DropdownItem key="mine-kaniner" textValue="Mine kaniner">
                                    <NextLink href="/rabbits/own" className="w-full block">
                                        Mine kaniner
                                    </NextLink>
                                </DropdownItem>
                                <DropdownItem key="user-profile" textValue="Bruger profil">
                                    <NextLink href="/user/profile" className="w-full block">
                                        Bruger profil
                                    </NextLink>
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    className="text-danger"
                                    textValue="Log ud"
                                    onPress={logout}
                                >
                                    Log ud
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsLoginOpen(true)}
                        >
                            <span className="text-zinc-400 hover:text-zinc-200">
                                Login
                            </span>
                            <PiUserCircleFill
                                size={32}
                                className="text-zinc-400 hover:text-zinc-200"
                            />
                        </div>
                    )}
                </NavbarContent>
            </Navbar>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />
        </>
    );
}
