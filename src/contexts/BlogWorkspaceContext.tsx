/**
 * BlogWorkspaceContext.tsx
 * 
 * Formål:
 * Denne fil definerer en React Context og Provider til at håndtere state og data for et blog workspace.
 * 
 * Ansvar:
 * - Henter og holder styr på blog data baseret på blogId fra URL.
 * - Eksponerer loading state, fejlbeskeder og publish/unpublish-funktionalitet.
 * - Tilbyder en refreshBlog metode til at genindlæse blog data.
 * - Gør blog workspace data og actions tilgængelig for alle child-komponenter via useBlogWorkspace hook.
 * 
 * Brug:
 * Wrap din blog workspace-side med <BlogWorkspaceProvider> for at få adgang til blog data og funktioner.
 */

'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Blog_DTO } from '@/api/types/AngoraDTOs';
import { deleteBlogAction, fetchBlogByIdAction, publishBlogAction, unpublishBlogAction } from '@/app/actions/blog/blogActions';
import { toast } from 'react-toastify';

interface BlogWorkspaceContextType {
  blog: Blog_DTO | null;
  isLoading: boolean;
  isPublishing: boolean;
  error: { message: string; status?: number } | null;
  refreshBlog: () => Promise<void>;
  handlePublish: () => Promise<void>;
  handleUnpublish: () => Promise<void>;
  handleDelete: () => Promise<void>;

}

const BlogWorkspaceContext = createContext<BlogWorkspaceContextType | undefined>(undefined);

export function BlogWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const blogId = parseInt(params.blogId as string, 10);

  const [blog, setBlog] = useState<Blog_DTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);

  // Load blog data
  const loadBlog = useCallback(async () => {
    if (isNaN(blogId) || blogId <= 0) {
      setError({ message: 'Ugyldigt blog ID', status: 400 });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchBlogByIdAction(blogId);

      if (result.success) {
        setBlog(result.data);
      } else {
        setError({
          message: result.error,
          status: result.status
        });
      }
    } catch {
      setError({
        message: 'Der opstod en uventet fejl',
        status: 500
      });
    } finally {
      setIsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    loadBlog();
  }, [loadBlog]);

  // Refresh blog data
  const refreshBlog = useCallback(async () => {
    await loadBlog();
  }, [loadBlog]);

  // Handle publish
  const handlePublish = useCallback(async () => {
    if (!blog) return;
    setIsPublishing(true);
    try {
      const result = await publishBlogAction(blog.id);
      if (result.success) {
        setBlog(result.data);
        toast.success('Blog publiceret!');
      } else {
        toast.error(result.error || 'Fejl ved publicering');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Der opstod en uventet fejl');
    } finally {
      setIsPublishing(false);
    }
  }, [blog]);

  // Handle unpublish
  const handleUnpublish = useCallback(async () => {
    if (!blog) return;
    setIsPublishing(true);
    try {
      const result = await unpublishBlogAction(blog.id);
      if (result.success) {
        setBlog(result.data);
        toast.success('Blog trukket tilbage!');
      } else {
        toast.error(result.error || 'Fejl ved tilbagetrækning');
      }
    } catch (error) {
      console.error('Unpublish error:', error);
      toast.error('Der opstod en uventet fejl');
    } finally {
      setIsPublishing(false);
    }
  }, [blog]);

  const handleDelete = useCallback(async () => {
    if (!blog) return;
    // Brug en confirm dialog eller modal for sikkerhed
    const confirmed = window.confirm('Er du sikker på, at du vil slette dette blogindlæg og alle relaterede fotos? Denne handling kan ikke fortrydes.');
    if (!confirmed) return;

    try {
      const result = await deleteBlogAction(blog.id);
      if (result.success) {
        toast.success(result.message);
        // Redirect eller opdater UI efter sletning
        window.location.href = '/account/myBlogs'; // Eksempel redirect
      } else {
        toast.error(result.error || 'Fejl ved sletning');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Der opstod en uventet fejl');
    }
  }, [blog]);

  return (
    <BlogWorkspaceContext.Provider value={{
      blog,
      isLoading,
      isPublishing,
      error,
      refreshBlog,
      handlePublish,
      handleUnpublish,
      handleDelete
    }}>
      {children}
    </BlogWorkspaceContext.Provider>
  );
}

export function useBlogWorkspace() {
  const context = useContext(BlogWorkspaceContext);
  if (context === undefined) {
    throw new Error('useBlogWorkspace must be used within a BlogWorkspaceProvider');
  }
  return context;
}