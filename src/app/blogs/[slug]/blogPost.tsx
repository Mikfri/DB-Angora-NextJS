// src/app/blogs/[slug]/blogPost.tsx
"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Avatar } from '@heroui/react';
import type { BlogPublicDTO } from '@/api/types/AngoraDTOs';
import ImageModal from '@/components/modals/image/imageModal';

interface Props {
  blog: BlogPublicDTO;
}

export default function BlogPost({ blog }: Props) {
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Gør ALLE billeder i content klikbare
  useEffect(() => {
    const imgs = contentRef.current?.querySelectorAll('img');
    if (imgs) {
      imgs.forEach(img => {
        img.style.cursor = 'pointer';
        img.onclick = () => setModalImageUrl(img.src);
      });
    }
    return () => {
      imgs?.forEach(img => (img.onclick = null));
    };
  }, [blog.content, modalImageUrl]);

  // Dato formattering
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('da-DK', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      {/* Header med titel, undertitel og forfatter */}
      <header className="mb-8">
        {/* Titel - bruger text-heading fra globals.css */}
        <h1 className="text-4xl font-bold text-heading mb-4">
          {blog.title}
        </h1>

        {/* Undertitel - bruger text-muted */}
        {blog.subtitle && (
          <p className="text-xl text-muted mb-6">
            {blog.subtitle}
          </p>
        )}

        {/* Forfatter og metadata */}
        <div className="flex items-center gap-4 pb-6 border-b border-divider">
          <Avatar
            src={blog.authorProfilePicture ?? undefined}
            name={blog.authorName}
            size="lg"
            className="border-2 border-divider"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {/* Bruger text-heading */}
              <span className="text-lg font-semibold text-heading">
                {blog.authorName}
              </span>
            </div>
            {/* Bruger text-muted */}
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>{formatDate(blog.publishDate)}</span>
              <span>•</span>
              <span>{blog.viewCount} visninger</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured image */}
      {blog.featuredImageUrl && (
        <Image
          src={blog.featuredImageUrl}
          alt={blog.title}
          width={800}
          height={450}
          className="w-full h-auto object-cover rounded-lg mb-8 shadow-lg cursor-pointer transition hover:brightness-90"
          onClick={() => blog.featuredImageUrl && setModalImageUrl(blog.featuredImageUrl)}
          priority
        />
      )}

      {/* Genbrug ImageModal */}
      <ImageModal
        isOpen={!!modalImageUrl}
        onClose={() => setModalImageUrl(null)}
        imageUrl={modalImageUrl}
        alt={blog.title}
      />

      {/* Blog content - BRUGER blog-content class fra globals.css */}
      <div
        ref={contentRef}
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Footer med tags og metadata */}
      <footer className="mt-8 pt-6 border-t border-divider">
        {blog.tags && (
          <div className="mb-4">
            {/* Bruger text-heading */}
            <h3 className="text-sm font-semibold text-heading mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.split(',').map((tag, index) => (
                <span 
                  key={index} 
                  /* Bruger bg-content2 og text-body fra HeroUI tokens */
                  className="px-3 py-1 bg-content2 text-body rounded-full text-sm hover:bg-content3 transition-colors"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Bruger text-muted */}
        <div className="flex gap-4 text-sm text-muted">
          <span>Synlighed: {blog.visibilityLevel === 'Public' ? 'Offentlig' : 'Betalt indhold'}</span>
        </div>
      </footer>
    </article>
  );
}