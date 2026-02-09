// src/components/cards/blogFeaturedCard.tsx

'use client';
import { useState, memo } from 'react';
import { Card } from '@heroui/react';
import Image from 'next/image';
import { ROUTES } from '@/constants/navigationConstants';
import type { BlogCardPreviewDTO } from '@/api/types/AngoraDTOs';

interface Props {
	blog: BlogCardPreviewDTO;
	onClick?: () => void;
}

const BlogFeaturedCard = memo(function BlogFeaturedCard({ blog, onClick }: Props) {
	const [imageError, setImageError] = useState(false);

	const defaultImage = '/images/DB-Angora.png';
	const featuredImage = (!imageError && blog.featuredImageUrl) || defaultImage;

	const handleCardPress = () => {
		if (onClick) onClick();
		else window.location.href = ROUTES.BLOGS.BLOG(blog.slug);
	};

	return (
		<Card
			isPressable
			onPress={handleCardPress}
			className="w-full h-full transition-all duration-300 backdrop-blur-md backdrop-saturate-150 border select-none group overflow-hidden flex flex-col"
			style={{
				background: 'var(--card-bg-gradient)',
				borderColor: 'var(--card-border)',
				boxShadow: 'var(--card-shadow)',
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.boxShadow = 'var(--card-shadow)';
			}}
		>
			{/* Stort billede der fylder hele kortet */}
			<div className="relative w-full h-full min-h-[400px] lg:min-h-[600px] overflow-hidden">
				<Image
					src={featuredImage}
					alt={blog.title}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover transition-transform duration-500 group-hover:scale-105"
					onError={() => setImageError(true)}
					draggable={false}
					priority
				/>
				
				{/* Gradient overlay - stærkere i bunden for læsbar tekst */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
				
				{/* Titel og info overlay - nederst */}
				<div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
					<h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 line-clamp-3 group-hover:text-primary transition-colors duration-300">
						{blog.title}
					</h2>
					{blog.subtitle && (
						<p className="text-base lg:text-lg text-white/90 line-clamp-2 mb-4">
							{blog.subtitle}
						</p>
					)}
					<div className="flex items-center gap-4 text-sm text-white/80">
						<span>{blog.authorName}</span>
						<span>•</span>
						<span>{blog.viewCount || 0} visninger</span>
					</div>
				</div>
			</div>
		</Card>
	);
});

export default BlogFeaturedCard;