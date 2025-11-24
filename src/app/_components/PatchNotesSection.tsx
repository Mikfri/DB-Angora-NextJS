// src/app/_components/PatchNotesSection.tsx

'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import BlogPreviewCard from '@/components/cards/blogPreviewCard';
import type { BlogsLatestByCategoryDTO } from '@/api/types/AngoraDTOs';
import ImageModal from '@/components/modals/image/imageModal';
import { Avatar } from '@heroui/react';

interface Props {
  data: BlogsLatestByCategoryDTO | null;
}

export default function PatchNotesSection({ data }: Props) {
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Gør ALLE billeder i content klikbare (geninitialiseres når modal lukkes)
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Delegated click handler — finder <img> via event.target
    const onClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const img = target.closest('img') as HTMLImageElement | null;
      if (!img) return;
      // kun hvis img er inde i vores container
      if (!container.contains(img)) return;
      setModalImageUrl(img.src);
    };

    container.addEventListener('click', onClickHandler, false);

    // Giv billeder cursor:pointer via class (gør det én gang)
    container.querySelectorAll('img').forEach(img => (img.style.cursor = 'pointer'));

    return () => {
      container.removeEventListener('click', onClickHandler, false);
    };
  }, [data?.latest?.content]);

  if (!data || !data.latest) {
    return (
      <section id="updates" className="flex flex-col justify-center items-center gap-6">
        <h2 className="text-heading text-2xl">Opdateringer</h2>
        <p className="text-muted">Ingen opdateringer tilgængelige.</p>
      </section>
    );
  }

  const { latest, next } = data;

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
    <>
      <section id="updates" className="flex flex-col gap-6">
        <h2 className="text-heading text-2xl text-center">Opdateringer</h2>

        <article className="max-w-4xl mx-auto w-full">
          {/* Header med titel, undertitel og forfatter */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-heading mb-4">
              {latest.title}
            </h1>
            {latest.subtitle && (
              <p className="text-lg text-muted mb-6">
                {latest.subtitle}
              </p>
            )}
            <div className="flex items-center gap-4 pb-6 border-b border-divider">
              <Avatar
                src={latest.authorProfilePicture ?? undefined}
                name={latest.authorName}
                size="lg"
                className="border-2 border-divider"
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-heading">
                    {latest.authorName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>{formatDate(latest.publishDate)}</span>
                  <span>•</span>
                  <span>{latest.viewCount} visninger</span>
                </div>
              </div>
            </div>
          </header>

          {/* Klikbart hovedbillede */}
          {latest.featuredImageUrl && (
            <Image
              src={latest.featuredImageUrl}
              alt={latest.title}
              width={800}
              height={450}
              className="w-full h-auto object-cover rounded-lg mb-8 shadow-lg cursor-pointer transition hover:brightness-90"
              onClick={() => latest.featuredImageUrl && setModalImageUrl(latest.featuredImageUrl)}
              priority
            />
          )}

          <div
            ref={contentRef}
            className="blog-content mb-8"
            dangerouslySetInnerHTML={{ __html: latest.content }}
          />

          <footer className="mt-8 pt-6 border-t border-divider">
            <div className="flex gap-4 text-sm text-muted">
              <span>Synlighed: {latest.visibilityLevel === 'Public' ? 'Offentlig' : 'Betalt indhold'}</span>
            </div>
            {latest.tags && (
              <div className="mt-2 flex flex-wrap gap-2">
                {latest.tags.split(',').map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-content2 text-body rounded-full text-sm hover:bg-content3 transition-colors">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
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