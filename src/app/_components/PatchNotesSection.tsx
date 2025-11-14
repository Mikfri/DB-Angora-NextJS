// src/app/_components/PatchNotesSection.tsx

'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import BlogPreviewCard from '@/components/cards/blogPreviewCard';
import type { BlogsLatestByCategoryDTO } from '@/api/types/AngoraDTOs';
import ImageModal from '@/components/modals/image/imageModal';

interface Props {
  data: BlogsLatestByCategoryDTO | null;
}

export default function PatchNotesSection({ data }: Props) {
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Gør ALLE billeder i content klikbare (geninitialiseres når modal lukkes)
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
  }, [data?.latest?.content, modalImageUrl]); // Tilføj modalImageUrl her

  if (!data || !data.latest) {
    return (
      <section id="updates" className="flex flex-col justify-center items-center gap-6 text-zinc-100">
        <h2 className="text-2xl font-bold text-primary">Opdateringer</h2>
        <p className="text-zinc-400">Ingen opdateringer tilgængelige.</p>
      </section>
    );
  }

  const { latest, next } = data;

  return (
    <>
      <section id="updates" className="flex flex-col gap-6 text-zinc-100">
        <h2 className="text-2xl font-bold text-primary text-center">Opdateringer</h2>

        <article className="max-w-4xl mx-auto w-full">
          {latest.featuredImageUrl && (
            <Image
              src={latest.featuredImageUrl}
              alt={latest.title}
              width={800}
              height={256}
              className="w-full h-64 object-cover rounded-lg mb-8 shadow-lg cursor-pointer transition hover:brightness-90"
              onClick={() => latest.featuredImageUrl && setModalImageUrl(latest.featuredImageUrl)}
              priority
            />
          )}

          <div
            ref={contentRef}
            className="prose prose-invert prose-zinc max-w-none mb-8
            prose-headings:text-zinc-100 
            prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
            prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 
            prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
            prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4"
            dangerouslySetInnerHTML={{ __html: latest.content }}
          />

          <footer className="mt-8 pt-6 border-t border-zinc-700">
            <div className="flex gap-4 text-sm text-zinc-400">
              <span>Synlighed: {latest.visibilityLevel}</span>
              <span>•</span>
              <span>Visninger: {latest.viewCount}</span>
            </div>
          </footer>
        </article>

        {next && next.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mx-auto">
            {next.map(blog => (
              <BlogPreviewCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      {/* Brug ImageModal til fuld størrelse visning */}
      <ImageModal
        isOpen={!!modalImageUrl}
        onClose={() => setModalImageUrl(null)}
        imageUrl={modalImageUrl}
        alt={latest.title}
      />
    </>
  );
}