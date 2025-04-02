// src/components/nav/top/TopNavClient.tsx
'use client'
import NextLink from 'next/link';
import {
    Dropdown, DropdownTrigger, DropdownMenu,
    DropdownItem, Chip
} from "@heroui/react"; // Fjernet Tooltip import
import { PiUserCircleFill, PiUserCircleCheckFill } from "react-icons/pi";
import { MdOutlineLogout } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import LoginModal from '../../modals/login/loginModal';
import { useNav } from '@/components/providers/Providers';
import { roleDisplayNames } from '@/types/auth';

// Kun autentikations- og dropdown-delene er nu i denne komponent
export function TopNavClient() {
    const pathname = usePathname();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { isLoggedIn, userName, userRole, userIdentity, logout, checkAuth: refresh } = useAuthStore();
    const { authInitialized } = useNav();

    // Få roller direkte fra userIdentity
    const roles = userIdentity?.roles || [];
    const hasMultipleRoles = roles.length > 1;

    // Luk login modal når bruger logger ind
    useEffect(() => {
        if (isLoggedIn) {
            setIsLoginOpen(false);
        }
    }, [isLoggedIn]);

    // Vi behøver kun at refreshe auth ved login/ud relaterede sider
    useEffect(() => {
        if (authInitialized && (pathname === '/login' || pathname === '/logout')) {
            refresh();
        }
    }, [pathname, refresh, authInitialized]);

    return (
        <>
            {isLoggedIn ? (
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
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}

// Behold denne export for baglæns kompatibilitet
export default TopNavClient;