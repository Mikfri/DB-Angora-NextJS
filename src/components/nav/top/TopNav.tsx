// src/components/nav/top/TopNav.tsx
'use client'
import {
    Dropdown, DropdownTrigger, DropdownMenu,
    DropdownItem, Chip
} from "@heroui/react";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { topNavigationLinks } from '@/constants/navigationConstants';
import { filterLink } from '@/navigation';
import LoginModal from '@/components/modals/login/loginModal';
import { roleDisplayNames } from '@/types/authTypes';
import { useTheme } from 'next-themes';
// Ikoner
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import { PiUserCircleFill, PiUserCircleCheckFill } from "react-icons/pi";
import { MdOutlineLogout } from 'react-icons/md';

export default function TopNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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

  useEffect(() => {
      checkAuth();
  }, [checkAuth]);

  useEffect(() => {
      if (isLoggedIn) {
          setIsLoginOpen(false);
      }
  }, [isLoggedIn]);

  const roles = userIdentity?.roles || [];
  const hasMultipleRoles = roles.length > 1;

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

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="h-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md backdrop-saturate-150 transition-colors">
        <div className="max-w-screen-2xl mx-auto w-full h-full px-4 flex items-center justify-between gap-2 relative">
          {/* Branding (ikke krympes) */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/DB-Angora.png"
                alt="DenBlå-Angora Logo"
                width={40}
                height={40}
                className="rounded-sm"
                priority
              />
              <p className="font-bold text-gray-900 dark:text-zinc-100 hidden sm:inline">DenBlå-Angora</p>
              <Chip
                color="danger"
                variant="shadow"
                size="sm"
                className="ml-2 font-bold tracking-wide hidden sm:inline-block"
              >
                v0.26 ALPHA
              </Chip>
            </Link>

            {/* Nav Links (skjult på små skærme) */}
            <div className="hidden sm:flex ml-8 gap-6">
              {mainNavLinks.map(link => (
                <Link 
                  key={link.key} 
                  href={link.href}
                  className="text-gray-700 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100 nav-text transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="sm:hidden">
              <button
                aria-label="Åbn navigation"
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                onClick={() => setMobileNavOpen(v => !v)}
              >
                <FaBars size={22} />
              </button>
              {/* Mobile nav dropdown */}
              {mobileNavOpen && (
                <div className="absolute top-16 left-0 w-full bg-white dark:bg-zinc-900 shadow-lg border-b border-zinc-800">
                  <div className="flex flex-col px-4 py-2 gap-2">
                    {mainNavLinks.map(link => (
                      <Link
                        key={link.key}
                        href={link.href}
                        className="py-2 px-2 rounded text-gray-800 dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => setMobileNavOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <FaSun size={20} className="text-yellow-400" />
                ) : (
                  <FaMoon size={20} className="text-blue-600" />
                )}
              </button>
            )}
            {!mounted && (
              <div className="p-2 rounded-lg bg-gray-200 dark:bg-zinc-800 w-9 h-9" />
            )}

            {/* Auth */}
            {isLoading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-300 dark:bg-zinc-700 rounded-full" />
            ) : isLoggedIn ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div className="flex items-center gap-5 cursor-pointer">
                    <div className="flex flex-col items-end">
                      <span className="text-gray-800 dark:text-slate-300 nav-text">{userName}</span>
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
                        <span className="text-xs text-warning-600 dark:text-warning-300">{userRole}</span>
                      )}
                    </div>
                    <PiUserCircleCheckFill size={32} className="text-primary hover:text-primary-400" />
                  </div>
                </DropdownTrigger>

                <DropdownMenu aria-label="Profil handlinger" className="nav-dropdown">
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
                <span className="text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 nav-text hidden sm:inline">Log ind</span>
                <PiUserCircleFill size={32} className="text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200" />
              </div>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}