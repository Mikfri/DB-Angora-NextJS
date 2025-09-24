'use client';

import { useMemo } from 'react';
import BlogWorkspaceNavBase from '../base/BlogWorkspaceNavBase';
import { BlogWorkspaceNavClient } from '../client/BlogWorkspaceNavClient';
import { NavAction } from '@/types/navigationTypes';
import { Blog_DTO } from '@/api/types/AngoraDTOs';

interface BlogWorkspaceNavProps {
    blog: Blog_DTO;
    onPublishClick?: () => void;
    onUnpublishClick?: () => void;
    onDeleteClick?: () => void;
    isPublishing?: boolean;
}

/**
 * Wrapper til BlogWorkspace navigation.
 * Kombinerer base, client og actions.
 */
export default function BlogWorkspaceNav({
    blog,
    onPublishClick,
    onUnpublishClick,
    onDeleteClick,
    isPublishing = false,
}: BlogWorkspaceNavProps) {
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
            onClick: onDeleteClick ?? (() => { }),
            color: 'danger',
            variant: 'flat',
            disabled: isPublishing,
        },
    ], [onPublishClick, onUnpublishClick, onDeleteClick, blog.isPublished, isPublishing]);
    return (
        <BlogWorkspaceNavBase title={`Blog: ${blog.title}`} footerActions={footerActions}>
            <BlogWorkspaceNavClient blog={blog} />
        </BlogWorkspaceNavBase>
    );
}