// src/components/cards/bannerCard.tsx

/**
 * Aflangt horizontalt bannerkort, der kan bruges til at fremhæve vigtige oplysninger eller opfordringer til handling.
 * Kan indeholde en titel, beskrivelse og en valgfri knap.
 * Designet til at være iøjnefaldende og informativt, ideelt til at promovere kampagner, nye funktioner eller vigtige meddelelser.
 */

import Image from 'next/image';
import Link from 'next/link';

interface BannerCardProps {
    title: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
    ctaLabel?: string;
    ctaHref?: string;
}

export default function BannerCard({
    title,
    description,
    imageSrc,
    imageAlt = 'Banner',
    ctaLabel,
    ctaHref,
}: BannerCardProps) {
    return (
        <div
            className="unified-container overflow-hidden min-h-[180px] flex"
            style={{ background: 'var(--card-bg-gradient)' }}
        >
            {/* Tekstindhold */}
            <div className="flex-1 flex flex-col justify-center gap-3 p-6 z-10">
                <h1 className="site-title">{title}</h1>
                {description && (
                    <p className="section-description">{description}</p>
                )}
                {ctaLabel && ctaHref && (
                    <div className="mt-1">
                        <Link
                            href={ctaHref}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white text-sm font-semibold transition-colors duration-200"
                        >
                            {ctaLabel}
                        </Link>
                    </div>
                )}
            </div>

            {/* Billede — skjult på mobil */}
            {imageSrc && (
                <div className="relative hidden sm:block w-56 lg:w-72 shrink-0">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 640px) 0px, (max-width: 1024px) 224px, 288px"
                        className="object-cover"
                        priority
                    />
                    {/* Gradient der blender billedet ind mod teksten */}
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--container-bg)] to-transparent" />
                </div>
            )}
        </div>
    );
}