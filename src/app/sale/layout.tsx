// src/app/sale/layout.tsx
'use client'
import { usePathname } from 'next/navigation';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import MyNav from '@/components/nav/side/variants/MyNav';
import ForSaleNav from '@/components/nav/side/variants/RabbitSaleNav2';

// Definér konstanter for sidenavs og routes
const NO_SIDENAV_PATHS = ['/sale/rabbits/profile'];

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  
  // Tjek om vi skal vise sidenav
  const shouldHaveSideNav = !NO_SIDENAV_PATHS.some(path => pathname.startsWith(path));
  
  if (!shouldHaveSideNav) {
    return (
      <div className="container mx-auto px-4 lg:px-6 max-w-5xl"> {/* Standardiseret container */}
        {children}
      </div>
    );
  }
  
  // Vælg den korrekte sidenav baseret på path
  const sideNav = pathname.includes('/sale/rabbits') && !pathname.includes('/profile')
    ? <ForSaleNav activeFilters={{}} />
    : <MyNav />;
  
  return (
    <SideNavLayout sideNav={sideNav}>
      {children}
    </SideNavLayout>
  );
}