'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import MyNav from '@/components/nav/side/index/MyNav';
import { useNav } from '@/components/providers/Providers';
import { ROUTES } from '@/constants/navigationConstants';

// Sidenav loading skeleton
function SideNavLoading() {
  return (
    <div className="w-full h-full bg-zinc-800/50 animate-pulse">
      <div className="p-4">
        <div className="h-8 w-3/4 bg-zinc-700 rounded mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-6 bg-zinc-700 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Paths that should NOT use the default sidenav
const noSideNavPaths = [
  ROUTES.ACCOUNT.PROFILE,
  ROUTES.ACCOUNT.MY_RABBITS,
  ROUTES.ACCOUNT.BLOG_WORKSPACE_BASE,
  //ROUTES.ACCOUNT.RABBIT_PROFILE_BASE,
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { primaryNav } = useNav();

  // Skal denne side have sidenav?
  const shouldShowSideNav = !noSideNavPaths.some(path =>
    pathname === path || pathname.startsWith(path)
  );

  if (!shouldShowSideNav) {
    return children;
  }

  const sideNav = primaryNav || <MyNav />;

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