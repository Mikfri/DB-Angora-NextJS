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

  // For kanin slug sider håndteres sideNav direkte i page.tsx
  const isRabbitSaleProfile = pathname.includes('/annoncer/kaniner/') && 
                              !pathname.endsWith('/kaniner') &&
                              !pathname.includes('/profile/');

  // Hvis vi er på en rabbit sale profile, pass through til page.tsx
  if (isRabbitSaleProfile) {
    return <>{children}</>;
  }

  // For alle andre sider, brug den normale sidenav logik
  const sideNav = pathname.includes(ROUTES.SALE.RABBITS)
    ? (
      <Suspense fallback={<SideNavLoading />}>
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