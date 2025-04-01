'use client'
import { usePathname } from 'next/navigation';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import MyNav from '@/components/nav/side/index/MyNavWrapper';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Sider der ikke skal have sidenav
  const noSideNavPaths = ['/account/profile', '/account/myRabbits'];
  const shouldHaveSideNav = !noSideNavPaths.some(path => pathname === path || pathname.startsWith(path));
  
  if (!shouldHaveSideNav) {
    // Returner indholdet uden en sidenav
    return children;
  }
  
  // For alle andre sider, brug default sidenav
  return (
    <SideNavLayout sideNav={<MyNav />}>
      {children}
    </SideNavLayout>
  );
}