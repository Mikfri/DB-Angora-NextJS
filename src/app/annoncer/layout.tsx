// src/app/annoncer/layout.tsx
'use client'
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import RabbitSaleNav from '@/components/nav/side/index/RabbitSaleNav';
import MyNav from '@/components/nav/side/index/MyNav';
import { ROUTES } from '@/constants/navigation';

// Loading component for sidebar
function SideNavLoading() {
  return (
    <div className="w-full h-full bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50 p-4">
      <div className="animate-pulse">
        <div className="h-7 w-2/3 bg-zinc-700/60 rounded mb-6"></div>

        {/* Filter skeletons */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-5 bg-zinc-700/60 rounded w-1/3"></div>
              <div className="h-9 bg-zinc-700/40 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  // Tjek om vi skal vise sidenav - brug ROUTES konstanter og opdateret path
  const shouldHaveSideNav = !pathname.startsWith(`${ROUTES.SALE.RABBITS}/profile`);

  if (!shouldHaveSideNav) {
    return (
      <div className="container mx-auto px-4 lg:px-6 max-w-5xl py-6">
        {children}
      </div>
    );
  }

  // Vælg den korrekte sidenav baseret på path - brug opdaterede ROUTES konstanter
  const sideNav = pathname.includes(ROUTES.SALE.RABBITS) && !pathname.includes('/profile')
    ? (
      <Suspense fallback={<SideNavLoading />}>
        {/* Fjernet activeFilters prop da vi nu bruger Zustand */}
        <RabbitSaleNav />
      </Suspense>
    )
    : <MyNav />;

  return (
    <SideNavLayout sideNav={sideNav}>
      {children}
    </SideNavLayout>
  );
}