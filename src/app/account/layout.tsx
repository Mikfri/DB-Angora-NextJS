'use client'
import { usePathname } from 'next/navigation';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import MyNav from '@/components/nav/side/index/MyNavWrapper';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Sider der ikke skal have sidenav
  // Bemærk: Vi ekskluderer nu specifikt kun '/account/profile' og '/account/myRabbits'
  // men ikke '/account/myRabbits/rabbitProfile' som får sin egen nav via child layout
  const noSideNavPaths = [
    '/account/profile',
    '/account/myRabbits'
  ];
  
  // Ekskluder kun de eksakte paths - ikke deres underruter
  const shouldHaveSideNav = !noSideNavPaths.includes(pathname);
  
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