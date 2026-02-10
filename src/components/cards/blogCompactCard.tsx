// src/components/cards/blogCompactCard.tsx
'use client';
import { useState, memo } from 'react';
import { Card } from '@heroui/react';
import Image from 'next/image';
import { ROUTES } from '@/constants/navigationConstants';
import { MdChevronRight } from 'react-icons/md';
import type { BlogCardPreviewDTO } from '@/api/types/AngoraDTOs';

interface Props {
	blog: BlogCardPreviewDTO;
	onClick?: () => void;
}

const BlogCompactCard = memo(function BlogCompactCard({ blog, onClick }: Props) {
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
			className="transition-all duration-300 backdrop-blur-md backdrop-saturate-150 border select-none group overflow-hidden"
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
			{/* Horizontal layout: billede til venstre, indhold til højre */}
			<div className="grid grid-cols-10 items-stretch p-0">
				{/* Billede sektion - 30% bredde på mobile, 20% på desktop */}
				<div className="col-span-3 lg:col-span-3 h-full min-h-[120px] lg:min-h-[160px] relative overflow-hidden">
					<Image
						src={featuredImage}
						alt={blog.title}
						fill
						sizes="(max-width: 1024px) 30vw, 25vw"
						className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
						//style={{ transform: 'scale(1.3)' }}
						onError={() => setImageError(true)}
						draggable={false}
					/>
				</div>

				{/* Tekst sektion - 70% bredde på mobile, resterende på desktop */}
				<div className="col-span-7 lg:col-span-6 py-3 pl-4 lg:pl-6 pr-3 flex flex-col justify-center">
					<h3 className="text-base lg:text-xl font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
						{blog.title}
					</h3>
					{blog.subtitle && (
						<p className="text-sm text-muted line-clamp-2">
							{blog.subtitle}
						</p>
					)}
				</div>

				{/* Arrow ikon - kun synlig på desktop */}
				<div className="hidden lg:flex col-span-1 items-center justify-center">
					<MdChevronRight
						className="text-primary transition-transform duration-300 group-hover:translate-x-1"
						size={20}
					/>
				</div>
			</div>
		</Card>
	);
});

export default BlogCompactCard;