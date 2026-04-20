// src/components/ui/custom/gallery/ImageGallery.tsx
'use client';

import Image from 'next/image';
import { useState, useRef, useCallback } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

interface GalleryPhoto {
    id: string | number;
    filePath: string;
    fileName?: string | null;
}

interface Props {
    photos?: GalleryPhoto[] | null;
    fallbackUrl?: string | null;
    alt?: string;
}

export default function ImageGallery({ photos, fallbackUrl, alt = 'Billede' }: Props) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const thumbnailRef = useRef<HTMLDivElement>(null);

    const hasPhotos = photos && photos.length > 0;
    const hasMultiple = hasPhotos && photos.length > 1;

    const mainImageUrl = hasPhotos
        ? photos[selectedIndex].filePath
        : (fallbackUrl || '/images/DB-Angora.png');

    const prev = useCallback(() => {
        if (!hasPhotos) return;
        setSelectedIndex(i => (i - 1 + photos.length) % photos.length);
    }, [hasPhotos, photos]);

    const next = useCallback(() => {
        if (!hasPhotos) return;
        setSelectedIndex(i => (i + 1) % photos.length);
    }, [hasPhotos, photos]);

    const scrollThumbnails = (dir: 'left' | 'right') => {
        thumbnailRef.current?.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' });
    };

    return (
        <div className="space-y-3">
            {/* Hoofdbillede */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden group">
                <Image
                    src={mainImageUrl}
                    alt={alt}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                />

                {/* Prev/Next pile — kun ved flere billeder */}
                {hasMultiple && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Forrige billede"
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                            <IoChevronBackOutline size={20} />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Næste billede"
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                            <IoChevronForwardOutline size={20} />
                        </button>

                        {/* Counter badge */}
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-xs pointer-events-none">
                            ({selectedIndex + 1}/{photos.length})
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail strip — kun ved flere billeder */}
            {hasMultiple && (
                <div className="relative flex items-center gap-1">
                    {/* Scroll venstre */}
                    <button
                        onClick={() => scrollThumbnails('left')}
                        aria-label="Scroll thumbnails venstre"
                        className="shrink-0 bg-surface border border-divider hover:bg-surface-secondary text-foreground/70 rounded-full p-1 transition-colors"
                    >
                        <IoChevronBackOutline size={16} />
                    </button>

                    {/* Thumbnails */}
                    <div
                        ref={thumbnailRef}
                        className="flex gap-2 overflow-x-auto scroll-smooth pb-0.5 flex-1"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {photos.map((photo, index) => (
                            <button
                                key={photo.id}
                                onClick={() => setSelectedIndex(index)}
                                aria-label={`Billede ${index + 1}`}
                                className={`relative min-w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0
                                    ${index === selectedIndex
                                        ? 'border-primary shadow-md shadow-primary/20'
                                        : 'border-divider opacity-60 hover:opacity-100 hover:border-default'}`}
                            >
                                <Image
                                    src={photo.filePath}
                                    alt={photo.fileName || `Billede ${index + 1}`}
                                    className="object-cover"
                                    fill
                                    sizes="64px"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Scroll højre */}
                    <button
                        onClick={() => scrollThumbnails('right')}
                        aria-label="Scroll thumbnails højre"
                        className="shrink-0 bg-surface border border-divider hover:bg-surface-secondary text-foreground/70 rounded-full p-1 transition-colors"
                    >
                        <IoChevronForwardOutline size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
