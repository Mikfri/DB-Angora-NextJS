// src/components/cards/blogCompactCard.tsx
'use client';
import { useState, memo } from 'react';
import ClickableCard from '@/components/ui/custom/cards/ClickableCard';
import Image from 'next/image';
import { ROUTES } from '@/constants/navigationConstants';
import { MdChevronRight } from 'react-icons/md';
import type { BlogCardPreviewDTO } from '@/api/types/AngoraDTOs';

interface Props {
    blog: BlogCardPreviewDTO;
    onClick?: () => void;
    className?: string;
}

const BlogCompactCard = memo(function BlogCompactCard({ blog, onClick, className }: Props) {
    const [imageError, setImageError] = useState(false);

    const defaultImage = '/images/DB-Angora.png';
    const featuredImage = (!imageError && blog.profilePhotoUrl) || defaultImage;

    const handleCardPress = () => {
        if (onClick) onClick();
        else window.location.href = ROUTES.BLOGS.BLOG(blog.slug);
    };

    return (
        <ClickableCard
            onClick={handleCardPress}
            className={`hover:-translate-y-0.5 min-h-22 ${className ?? ''}`}
            style={{ flexDirection: 'row', alignItems: 'stretch' }}
        >
            {/* Thumbnail – card's overflow-hidden + rounded-3xl clipper hjørnerne */}
            <div className="w-28 lg:w-32 relative overflow-hidden shrink-0">
                <Image
                    src={featuredImage}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 1024px) 30vw, 20vw"
                    className="object-cover object-center"
                    onError={() => setImageError(true)}
                    draggable={false}
                />
            </div>

            {/* Tekst + pil */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 min-w-0">
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm lg:text-base font-bold line-clamp-2 mb-1 group-hover:text-primary transition-colors duration-300">
                        {blog.title}
                    </h3>
                    {blog.subtitle && (
                        <p className="text-xs text-muted line-clamp-2">
                            {blog.subtitle}
                        </p>
                    )}
                </div>
                <MdChevronRight
                    className="text-muted group-hover:text-primary transition-colors duration-300 shrink-0"
                    size={18}
                />
            </div>
        </ClickableCard>
    );
});

export default BlogCompactCard;
