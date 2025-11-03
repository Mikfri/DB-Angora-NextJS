// src/components/nav/side/index/BlogWorkspaceNav.tsx
'use client';

import BlogWorkspaceNavBase from '@/components/nav/side/base/BlogWorkspaceNavBase';
import { BlogWorkspaceNavClient } from '@/components/nav/side/client/BlogWorkspaceNavClient';

export default function BlogWorkspaceNav() {
  return (
    <BlogWorkspaceNavBase title="Blog workspace">
      <BlogWorkspaceNavClient />
    </BlogWorkspaceNavBase>
  );
}