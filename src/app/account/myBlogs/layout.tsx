// src/app/account/myBlogs/layout.tsx
'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import BlogOwnNav from '@/components/nav/side/index/BlogOwnNav';
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

export default function MyBlogsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Sluk sidenav hvis vi er på blogWorkspace
  const isWorkspaceRoute = pathname.startsWith(ROUTES.ACCOUNT.BLOG_WORKSPACE_BASE);

  if (isWorkspaceRoute) {
    return children;
  }

  return (
    <SideNavLayout
      sideNav={
        <Suspense fallback={<SideNavLoading />}>
          <BlogOwnNav />
        </Suspense>
      }
    >
      {children}
    </SideNavLayout>
  );
}