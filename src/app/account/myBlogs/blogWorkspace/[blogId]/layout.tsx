'use client';

import { BlogWorkspaceProvider, useBlogWorkspace } from '@/contexts/BlogWorkspaceContext';
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

// Wrapper for sidenav, så vi kan hente blog-data fra context
function BlogWorkspaceSideNav() {
  const { blog, isLoading, isPublishing, handlePublish, handleUnpublish } = useBlogWorkspace();
  if (isLoading || !blog) return <SideNavLoading />;
  return (
    <BlogWorkspaceNav
      blog={blog}
      onPublishClick={handlePublish}
      onUnpublishClick={handleUnpublish}
      isPublishing={isPublishing}
    />
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
            <BlogWorkspaceSideNav />
          </Suspense>
        }
      >
        {children}
      </SideNavLayout>
    </BlogWorkspaceProvider>
  );
}