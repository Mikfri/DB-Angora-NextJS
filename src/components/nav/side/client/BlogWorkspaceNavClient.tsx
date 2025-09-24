// src/components/nav/side/client/BlogWorkspaceNavClient.tsx
'use client';

import { ReactNode } from 'react';
import { Divider } from '@heroui/react';
import { FaRegEdit, FaUserCircle, FaCalendarAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { Blog_DTO } from '@/api/types/AngoraDTOs';

interface BlogWorkspaceNavClientProps {
  blog: Blog_DTO;
}

const SECTIONS = {
  INFO: 'Blog information',
  AUTHOR: 'Forfatter',
  STATUS: 'Status'
} as const;

const DEFAULT_TEXTS = {
  UNKNOWN: 'Ukendt',
  NOT_SET: 'Ikke angivet'
} as const;

/**
 * Client-side visning af blog workspace navigation.
 */
export function BlogWorkspaceNavClient({ blog }: BlogWorkspaceNavClientProps) {
  // Fallbacks
  const title = blog.title || DEFAULT_TEXTS.NOT_SET;
  const subtitle = blog.subtitle || DEFAULT_TEXTS.NOT_SET;
  const author = blog.authorName || DEFAULT_TEXTS.UNKNOWN; // <-- Rettet
  const created = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : DEFAULT_TEXTS.UNKNOWN; // <-- Rettet
  const published = blog.isPublished
    ? (blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'Planlagt')
    : 'Ikke publiceret';
  const visibility = blog.visibilityLevel === 'public' ? 'Offentlig' : 'Privat';

  return (
    <div className="w-full p-1 space-y-2">
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