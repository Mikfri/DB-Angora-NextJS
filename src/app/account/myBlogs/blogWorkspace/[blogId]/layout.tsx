// src/app/account/myBlogs/blogWorkspace/[blogId]/layout.tsx
import { BlogWorkspaceProvider } from '@/contexts/BlogWorkspaceContext';

export default function BlogWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlogWorkspaceProvider>
      {children}
    </BlogWorkspaceProvider>
  );
}