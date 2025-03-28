// src/app/account/layout.tsx
'use client'
import { usePathname } from 'next/navigation';
import MyNav from '@/components/sectionNav/variants/myNav';
import RabbitOwnNav from '@/components/sectionNav/variants/rabbitOwnNav';
import SideNavLayout from '@/components/layouts/SideNavLayout';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Bestem hvilken sidenav der skal bruges baseret på path
  const getSideNav = () => {
    if (pathname.includes('/account/myRabbits')) {
      // Du har allerede RabbitOwnNav
      return <RabbitOwnNav activeFilters={{}} onFilterChange={() => {}} />;
    }
    
    // Brug din eksisterende MyNav komponent som default
    return <MyNav />;
  };
  
  // Sider der ikke skal have sidenav
  const noSideNavPaths = ['/account/profile'];
  const shouldHaveSideNav = !noSideNavPaths.some(path => pathname.startsWith(path));
  
  if (!shouldHaveSideNav) {
    return children;
  }
  
  return (
    <SideNavLayout sideNav={getSideNav()}>
      {children}
    </SideNavLayout>
  );
}