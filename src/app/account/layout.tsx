// src/app/account/layout.tsx
'use client'
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import MyNav from '@/components/nav/side/index/MyNav';
import { useNav } from '@/components/providers/Providers';

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

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { primaryNav } = useNav();
  
  // Stier der skal have custom layout (ingen standard sidenav)
  // Bemærk: rabbitProfile er fjernet fra denne liste da den nu håndteres af sin egen layout
  const noSideNavPaths = [
    '/account/profile',
    '/account/myRabbits'
  ];
  
  // Vi bør specifikt ekskludere rabbitProfile stier fra dette layout
  if (pathname.startsWith('/account/myRabbits/rabbitProfile')) {
    return children;
  }
  
  // For de resterende stier, tjek om de er i noSideNavPaths
  const shouldHaveSideNav = !noSideNavPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Ingen sidenav for markerede stier
  if (!shouldHaveSideNav) {
    return children;
  }
  
  // Brug den rigtige sidenav
  const sideNav = primaryNav || <MyNav />;
  
  // For alle andre sider, brug sidenav layout med suspense boundary
  return (
    <SideNavLayout 
      sideNav={
        <Suspense fallback={<SideNavLoading />}>
          {sideNav}
        </Suspense>
      }
    >
      {children}
    </SideNavLayout>
  );
}