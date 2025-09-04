// src/contexts/BlogWorkspaceContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Blog_DTO } from '@/api/types/AngoraDTOs';
import { fetchBlogByIdAction } from '@/app/actions/blog/blogActions';

interface BlogWorkspaceContextType {
  blog: Blog_DTO | null;
  isLoading: boolean;
  error: { message: string; status?: number } | null;
  refreshBlog: () => Promise<void>;
}

const BlogWorkspaceContext = createContext<BlogWorkspaceContextType | undefined>(undefined);

export function BlogWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const blogId = parseInt(params.blogId as string, 10);
  
  const [blog, setBlog] = useState<Blog_DTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);

  useEffect(() => {
    // Flyt loadBlog ind i useEffect
    const loadBlog = async () => {
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
    };

    loadBlog();
  }, [blogId]); // Nu er dependency array korrekt

  const refreshBlog = async () => {
    // For refreshBlog, opret en ny loadBlog funktion
    const loadBlog = async () => {
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
    };

    await loadBlog();
  };

  return (
    <BlogWorkspaceContext.Provider value={{
      blog,
      isLoading,
      error,
      refreshBlog
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