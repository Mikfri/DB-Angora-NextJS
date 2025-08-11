// src/app/blogs/layout.tsx

'use client';
import { Suspense } from 'react';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import BlogNav from '@/components/nav/side/index/BlogNav';

// Loading component for sidebar
function SideNavLoading() {
  return (
    <div className="w-full h-full bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50 p-4">
      <div className="animate-pulse">
        <div className="h-7 w-2/3 bg-zinc-700/60 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
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

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const sideNav = (
    <Suspense fallback={<SideNavLoading />}>
      <BlogNav />
    </Suspense>
  );

  return (
    <SideNavLayout sideNav={sideNav}>
      {children}
    </SideNavLayout>
  );
}
