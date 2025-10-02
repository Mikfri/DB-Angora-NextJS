'use client';

import { useCallback, useMemo, useState } from 'react';
import BlogWorkspaceNavBase from '../base/BlogWorkspaceNavBase';
import { BlogWorkspaceNavClient } from '../client/BlogWorkspaceNavClient';
import { NavAction } from '@/types/navigationTypes';
import { Blog_DTO } from '@/api/types/AngoraDTOs';
import DeleteBlogModal from '@/components/modals/blog/deleteBlogModal';
import { useBlogWorkspace } from '@/contexts/BlogWorkspaceContext';

interface BlogWorkspaceNavProps {
    blog: Blog_DTO;
    onPublishClick?: () => void;
    onUnpublishClick?: () => void;
    isPublishing?: boolean;
}

export default function BlogWorkspaceNav({
    blog,
    onPublishClick,
    onUnpublishClick,
    isPublishing = false,
}: BlogWorkspaceNavProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { handleDelete } = useBlogWorkspace();

    const handleDeleteClick = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);

    const handleDeleteCancel = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        setIsDeleting(true);
        await handleDelete();
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
    }, [handleDelete]);

    const footerActions = useMemo((): NavAction[] => [
        {
            label: 'Publicer',
            onClick: onPublishClick ?? (() => { }),
            color: 'success',
            variant: 'flat',
            disabled: isPublishing || blog.isPublished,
        },
        {
            label: 'Træk tilbage',
            onClick: onUnpublishClick ?? (() => { }),
            color: 'warning',
            variant: 'flat',
            disabled: isPublishing || !blog.isPublished,
        },
        {
            label: 'Slet',
            onClick: handleDeleteClick,
            color: 'danger',
            variant: 'flat',
            disabled: isPublishing,
        },
    ], [onPublishClick, onUnpublishClick, handleDeleteClick, blog.isPublished, isPublishing]);

    return (
        <>
            <BlogWorkspaceNavBase title={`Blog: ${blog.title}`} footerActions={footerActions}>
                <BlogWorkspaceNavClient blog={blog} />
            </BlogWorkspaceNavBase>
            <DeleteBlogModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                blogTitle={blog.title ?? ''}
                isDeleting={isDeleting}
            />
        </>
    );
}