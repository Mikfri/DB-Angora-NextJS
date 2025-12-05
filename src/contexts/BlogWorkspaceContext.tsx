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

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Blog_DTO, Blog_UpdateDTO } from '@/api/types/AngoraDTOs';
import { deleteBlogAction, fetchBlogByIdAction, publishBlogAction, unpublishBlogAction, updateBlogAction } from '@/app/actions/blog/blogActions';
import { toast } from 'react-toastify';

interface BlogWorkspaceContextType {
  blog: Blog_DTO | null;
  isLoading: boolean;
  isPublishing: boolean;
  isEditing: boolean;
  isSaving: boolean;
  editedData: Blog_DTO | null;
  error: { message: string; status?: number } | null;
  // Auto-save status
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  setIsEditing: (editing: boolean) => void;
  setEditedData: (data: Blog_DTO) => void;
  updateField: <K extends keyof Blog_DTO>(key: K, value: Blog_DTO[K]) => void;
  refreshBlog: () => Promise<void>;
  handlePublish: () => Promise<void>;
  handleUnpublish: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleSave: () => Promise<void>;
  handleCancelEdit: () => void;
}

const BlogWorkspaceContext = createContext<BlogWorkspaceContextType | undefined>(undefined);

const AUTO_SAVE_DELAY = 3000; // 3 sekunder

export function BlogWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const blogId = parseInt(params.blogId as string, 10);

  const [blog, setBlog] = useState<Blog_DTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<Blog_DTO | null>(null);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);
  
  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

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
        setEditedData(result.data);
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

  // Auto-save funktion
  const performAutoSave = useCallback(async () => {
    if (!blog || !editedData || isSavingRef.current) return;

    isSavingRef.current = true;
    setAutoSaveStatus('saving');

    try {
      const updateData: Blog_UpdateDTO = {
        title: editedData.title,
        subtitle: editedData.subtitle,
        content: editedData.content,
        tags: editedData.tags,
        visibilityLevel: editedData.visibilityLevel,
        category: editedData.category,
        authorId: editedData.authorId
      };

      const result = await updateBlogAction(blog.id, updateData);
      
      if (result.success) {
        setBlog(result.data);
        setHasUnsavedChanges(false);
        setAutoSaveStatus('saved');
        setLastSaved(new Date());
        
        // Reset til idle efter 2 sek
        setTimeout(() => {
          setAutoSaveStatus(prev => prev === 'saved' ? 'idle' : prev);
        }, 2000);
      } else {
        setAutoSaveStatus('error');
      }
    } catch {
      setAutoSaveStatus('error');
    } finally {
      isSavingRef.current = false;
    }
  }, [blog, editedData]);

  // Trigger auto-save med debounce
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    setHasUnsavedChanges(true);
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, AUTO_SAVE_DELAY);
  }, [performAutoSave]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Advarsel ved lukning med ugemte ændringer
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Opdater et enkelt felt og trigger auto-save
  const updateField = useCallback(<K extends keyof Blog_DTO>(key: K, value: Blog_DTO[K]) => {
    setEditedData(prev => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
    triggerAutoSave();
  }, [triggerAutoSave]);

  // Refresh blog data
  const refreshBlog = useCallback(async () => {
    await loadBlog();
  }, [loadBlog]);

  // Handle manual save
  const handleSave = useCallback(async () => {
    if (!blog || !editedData) return;

    // Clear auto-save timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setIsSaving(true);
    try {
      const updateData: Blog_UpdateDTO = {
        title: editedData.title,
        subtitle: editedData.subtitle,
        content: editedData.content,
        tags: editedData.tags,
        visibilityLevel: editedData.visibilityLevel,
        category: editedData.category,
        authorId: editedData.authorId
      };

      const result = await updateBlogAction(blog.id, updateData);
      if (result.success) {
        setBlog(result.data);
        setEditedData(result.data);
        setIsEditing(false);
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        toast.success('Blog gemt!');
      } else {
        toast.error(result.error || 'Fejl ved gemning');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Der opstod en uventet fejl');
    } finally {
      setIsSaving(false);
    }
  }, [blog, editedData]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    if (blog) {
      setEditedData(blog);
    }
    setIsEditing(false);
    setHasUnsavedChanges(false);
  }, [blog]);

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

    try {
      const result = await deleteBlogAction(blog.id);
      if (result.success) {
        toast.success(result.message || 'Blog slettet!');
        window.location.href = '/account/myBlogs';
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
      isEditing,
      isSaving,
      editedData,
      error,
      autoSaveStatus,
      lastSaved,
      hasUnsavedChanges,
      setIsEditing,
      setEditedData,
      updateField,
      refreshBlog,
      handlePublish,
      handleUnpublish,
      handleDelete,
      handleSave,
      handleCancelEdit
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