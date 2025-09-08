
"use client";
// src/app/blogs/[slug]/blogPost.tsx

import Image from 'next/image';
import type { BlogPublicDTO } from '@/api/types/AngoraDTOs';
import { Avatar } from '@heroui/react';

interface Props {
  blog: BlogPublicDTO;
}

export default function BlogPost({ blog }: Props) {
  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      {blog.featuredImageUrl && (
        <Image
          src={blog.featuredImageUrl}
          alt={blog.title}
          width={800}
          height={256}
          className="w-full h-64 object-cover rounded-lg mb-8 shadow-lg"
        />
      )}
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">{blog.title}</h1>
        {blog.subtitle && (
          <h2 className="text-xl text-zinc-400 mb-6">{blog.subtitle}</h2>
        )}
        
        <div className="flex items-center gap-4 text-sm text-zinc-500 pb-6 border-b border-zinc-700">
          <Avatar
            src={blog.authorProfilePicture}
            name={blog.authorName}
            size="md"
            className="border border-zinc-600"
          />
          <div>
            <span className="text-zinc-300 font-medium">{blog.authorName}</span>
            <span className="mx-2">•</span>
            <span>{blog.publishDate ? new Date(blog.publishDate).toLocaleDateString('da-DK') : ''}</span>
          </div>
        </div>
      </header>

      {/* FORBEDRET CONTENT MED TYPOGRAPHY */}
      <div 
        className="prose prose-invert prose-zinc max-w-none mb-8
          prose-headings:text-zinc-100 
          prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
          prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 
          prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
          prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
          prose-ul:mb-6 prose-ol:mb-6
          prose-li:text-zinc-300 prose-li:mb-2
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-zinc-800/50 prose-blockquote:pl-6 prose-blockquote:py-4
          prose-strong:text-zinc-100 prose-strong:font-semibold
          prose-code:bg-zinc-700 prose-code:text-amber-300 prose-code:px-2 prose-code:rounded
        "
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />

      <footer className="mt-8 pt-6 border-t border-zinc-700">
        <div className="flex gap-4 text-sm text-zinc-400">
          <span>Synlighed: {blog.visibilityLevel}</span>
          <span>•</span>
          <span>Visninger: {blog.viewCount}</span>
        </div>
        {blog.tags && (
          <div className="mt-2 flex flex-wrap gap-2">
            {blog.tags.split(',').map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </footer>
    </article>
  );
}