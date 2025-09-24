import { useState, useCallback } from 'react';
import { Blog_DTO, Blog_UpdateDTO } from '@/api/types/AngoraDTOs';
import { updateBlogAction, publishBlogAction, unpublishBlogAction } from '@/app/actions/blog/blogActions';
import { toast } from 'react-toastify';

export function useBlogWorkspace(initialBlog: Blog_DTO) {
    const [currentBlog, setCurrentBlog] = useState<Blog_DTO>(initialBlog);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [editedData, setEditedData] = useState<Blog_DTO>(initialBlog);

    // Handle save
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
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

    // Handle publish
    const handlePublish = useCallback(async () => {
        setIsPublishing(true);
        try {
            const result = await publishBlogAction(currentBlog.id);
            if (result.success) {
                setCurrentBlog(result.data);
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
    }, [currentBlog.id]);

    // Handle unpublish
    const handleUnpublish = useCallback(async () => {
        setIsPublishing(true);
        try {
            const result = await unpublishBlogAction(currentBlog.id);
            if (result.success) {
                setCurrentBlog(result.data);
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
    }, [currentBlog.id]);

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
        isPublishing,
        editedData,
        setEditedData,
        setIsEditing,
        handleSave,
        handleCancelEdit,
        handlePublish,
        handleUnpublish,
    };
}