"use client";
// src/app/blogs/[slug]/blogPost.tsx

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import type { BlogPublicDTO } from '@/api/types/AngoraDTOs';

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

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      {/* Klikbart hovedbillede */}
      {blog.featuredImageUrl && (
        <Image
          src={blog.featuredImageUrl}
          alt={blog.title}
          width={800}
          height={256}
          className="w-full h-64 object-cover rounded-lg mb-8 shadow-lg cursor-pointer transition hover:brightness-90"
          onClick={() => blog.featuredImageUrl && setModalImageUrl(blog.featuredImageUrl)}
          priority
        />
      )}

      {/* Modal for ALLE billeder - NU MED NEXT.JS IMAGE */}
      {modalImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setModalImageUrl(null)}
        >
          <div className="relative w-full h-full max-w-[90vw] max-h-[90vh]">
            <Image
              src={modalImageUrl}
              alt="Fuld størrelse"
              fill
              sizes="90vw"
              className="object-contain rounded-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
              quality={95}
            />
          </div>
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-zinc-300 transition-colors"
            onClick={() => setModalImageUrl(null)}
            aria-label="Luk billede"
          >
            ×
          </button>
        </div>
      )}

      {/* Blog content med klikbare billeder */}
      <div
        ref={contentRef}
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