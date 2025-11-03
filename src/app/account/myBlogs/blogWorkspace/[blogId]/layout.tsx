// src/app/account/myBlogs/blogWorkspace/[blogId]/layout.tsx
'use client';

import { BlogWorkspaceProvider } from '@/contexts/BlogWorkspaceContext';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import BlogWorkspaceNav from '@/components/nav/side/index/BlogWorkspaceNav';
import { Suspense } from 'react';

// Loading component for sidenav
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

export default function BlogWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlogWorkspaceProvider>
      <SideNavLayout
        sideNav={
          <Suspense fallback={<SideNavLoading />}>
            <BlogWorkspaceNav />
          </Suspense>
        }
      >
        {children}
      </SideNavLayout>
    </BlogWorkspaceProvider>
  );
}