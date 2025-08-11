
"use client";
// src/app/blogs/[slug]/blogPost.tsx

import Image from 'next/image';
import type { Blog_DTO } from '@/api/types/AngoraDTOs';
import { Avatar } from '@heroui/react';

interface Props {
  blog: Blog_DTO;
}

export default function BlogPost({ blog }: Props) {
  return (
    <article className="max-w-3xl mx-auto py-8">
      {blog.featuredImageUrl && (
        <Image
          src={blog.featuredImageUrl}
          alt={blog.title}
          width={800}
          height={256}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}
      <h1 className="text-3xl font-bold text-zinc-100 mb-2">{blog.title}</h1>
      {blog.subTitle && (
        <h2 className="text-xl text-zinc-400 mb-4">{blog.subTitle}</h2>
      )}
      <div className="flex items-center gap-3 text-sm text-zinc-500 mb-4">
        <Avatar
          src={blog.authorProfilePicture}
          name={blog.authorName}
          size="md"
          className="border border-zinc-700"
        />
        <span>{blog.authorName}</span>
        <span>•</span>
        <span>{blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : ''}</span>
      </div>
      <div className="prose prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: blog.content }} />
      <div className="text-xs text-zinc-400 mt-8">
        Synlighed: {blog.visibilityLevel} • Visninger: {blog.viewCount}
      </div>
      {blog.tags && (
        <div className="mt-2 text-xs text-zinc-500">
          Tags: {blog.tags}
        </div>
      )}
    </article>
  );
}