// src/components/nav/side/client/BlogWorkspaceNavClient.tsx
'use client';

import { ReactNode, useState } from 'react';
import { Divider, Button } from '@heroui/react';
import { FaRegEdit, FaUserCircle, FaCalendarAlt, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { useBlogWorkspace } from '@/contexts/BlogWorkspaceContext';
import DeleteBlogModal from '@/components/modals/blog/deleteBlogModal';

const SECTIONS = {
  INFO: 'Blog information',
  AUTHOR: 'Forfatter',
  STATUS: 'Status'
} as const;

const DEFAULT_TEXTS = {
  UNKNOWN: 'Ukendt',
  NOT_SET: 'Ikke angivet'
} as const;

export function BlogWorkspaceNavClient() {
  const {
    blog,
    isPublishing,
    handlePublish,
    handleUnpublish,
    handleDelete,
  } = useBlogWorkspace();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!blog) return null;

  // Fallbacks
  const title = blog.title || DEFAULT_TEXTS.NOT_SET;
  const subtitle = blog.subtitle || DEFAULT_TEXTS.NOT_SET;
  const author = blog.authorName || DEFAULT_TEXTS.UNKNOWN;
  const created = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : DEFAULT_TEXTS.UNKNOWN;
  const published = blog.isPublished
    ? (blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'Planlagt')
    : 'Ikke publiceret';
  const visibility = blog.visibilityLevel === 'public' ? 'Offentlig' : 'Privat';

  // Delete handler
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete();
    // Modal lukkes automatisk når bloggen er slettet (redirect)
  };

  return (
    <>
      <div className="w-full p-1 space-y-2">
        {/* Action section header */}
        <div>
          <h3 className="text-[13px] font-medium text-zinc-400 mb-1">Handlinger</h3>
          <div className="flex flex-col gap-2 mb-3">
            <Button
              color="primary"
              variant="bordered"
              fullWidth
              size="sm"
              onPress={handlePublish}
              disabled={isPublishing || blog.isPublished}
            >
              Publicer
            </Button>
            <Button
              color="primary"
              variant="bordered"
              fullWidth
              size="sm"
              onPress={handleUnpublish}
              disabled={isPublishing || !blog.isPublished}
            >
              Træk tilbage
            </Button>
            <Button
              color="danger"
              variant="bordered"
              fullWidth
              size="sm"
              startContent={<FaTrash />}
              onPress={handleDeleteClick}
            >
              Slet blog
            </Button>
          </div>
          <Divider className="bg-zinc-200/5 my-0.5" />
        </div>

        {/* Blog info */}
        <div>
          <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTIONS.INFO}</h3>
          <div className="space-y-1">
            <InfoRow icon={<FaRegEdit className="text-lg text-default-500" />} label="Titel" value={title} />
            <InfoRow icon={<FaRegEdit className="text-lg text-default-500" />} label="Undertitel" value={subtitle} />
          </div>
        </div>
        <Divider className="bg-zinc-200/5 my-0.5" />

        {/* Author */}
        <div>
          <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTIONS.AUTHOR}</h3>
          <div className="space-y-1">
            <InfoRow icon={<FaUserCircle className="text-lg text-default-500" />} label="Forfatter" value={author} />
            <InfoRow icon={<FaCalendarAlt className="text-lg text-default-500" />} label="Oprettet" value={created} />
          </div>
        </div>
        <Divider className="bg-zinc-200/5 my-0.5" />

        {/* Status */}
        <div>
          <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">{SECTIONS.STATUS}</h3>
          <div className="space-y-1">
            <InfoRow
              icon={blog.isPublished ? <FaEye className="text-lg text-green-500" /> : <FaEyeSlash className="text-lg text-zinc-500" />}
              label="Publiceret"
              value={published}
            />
            <InfoRow
              icon={<FaCalendarAlt className="text-lg text-default-500" />}
              label="Synlighed"
              value={visibility}
            />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteBlogModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        blogTitle={title}
        isDeleting={false} // BlogWorkspaceContext håndterer ikke isDeleting, så sæt til false eller tilføj til context
      />
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="py-0.5">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 min-w-[110px]">
          {icon}
          <span className="text-xs font-medium text-zinc-300">{label}</span>
        </div>
        <div className="text-sm text-zinc-100">{value}</div>
      </div>
    </div>
  );
}