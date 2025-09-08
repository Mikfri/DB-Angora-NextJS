// src/hooks/blogs/useBlogWorkspace.ts
import { useState, useCallback } from 'react';
import { Blog_DTO, Blog_UpdateDTO } from '@/api/types/AngoraDTOs';
import { updateBlogAction } from '@/app/actions/blog/blogActions';
import { toast } from 'react-toastify';

export function useBlogWorkspace(initialBlog: Blog_DTO) {
    const [currentBlog, setCurrentBlog] = useState<Blog_DTO>(initialBlog);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedData, setEditedData] = useState<Blog_DTO>(initialBlog);

    // Handle save
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            // Konverter til UpdateDTO format
            const updateDTO: Blog_UpdateDTO = {
                title: editedData.title,
                subtitle: editedData.subtitle,
                content: editedData.content,
                visibilityLevel: editedData.visibilityLevel,
                tags: editedData.tags,
                metaDescription: editedData.metaDescription
            };

            const result = await updateBlogAction(currentBlog.id, updateDTO);
            
            if (result.success) {
                setCurrentBlog(result.data);
                setEditedData(result.data);
                setIsEditing(false);
                toast.success('Blog opdateret succesfuldt');
            } else {
                toast.error(result.error || 'Fejl ved opdatering af blog');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Der opstod en uventet fejl');
        } finally {
            setIsSaving(false);
        }
    }, [editedData, currentBlog.id]);

    // Handle cancel
    const handleCancelEdit = useCallback(() => {
        setEditedData(currentBlog);
        setIsEditing(false);
    }, [currentBlog]);

    return {
        currentBlog,
        setCurrentBlog,
        isEditing,
        isSaving,
        editedData,
        setEditedData,
        setIsEditing,
        handleSave,
        handleCancelEdit
    };
}