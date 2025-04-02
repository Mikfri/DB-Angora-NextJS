'use client'
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import RabbitSaleNav from '@/components/nav/side/index/RabbitSaleNav';
import MyNav from '@/components/nav/side/index/MyNavWrapper';

// Loading component for sidebar
function SideNavLoading() {
  return (
    <div className="w-full h-full bg-zinc-800/50 animate-pulse">
      <div className="p-4">
        <div className="h-8 w-3/4 bg-zinc-700 rounded mb-4"></div>
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-6 bg-zinc-700 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Definér konstanter for sidenavs og routes
const NO_SIDENAV_PATHS = ['/sale/rabbits/profile'];

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  
  // Tjek om vi skal vise sidenav
  const shouldHaveSideNav = !NO_SIDENAV_PATHS.some(path => pathname.startsWith(path));
  
  if (!shouldHaveSideNav) {
    return (
      <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
        <Suspense>
          {children}
        </Suspense>
      </div>
    );
  }
  
  // Vælg den korrekte sidenav baseret på path
  const sideNav = pathname.includes('/sale/rabbits') && !pathname.includes('/profile')
    ? (
      <Suspense fallback={<SideNavLoading />}>
        <RabbitSaleNav activeFilters={{}} />
      </Suspense>
    )
    : <MyNav />;
  
  return (
    <SideNavLayout sideNav={sideNav}>
      <Suspense>
        {children}
      </Suspense>
    </SideNavLayout>
  );
}