// src/components/cards/blogPreviewCard.tsx

/**
 * Dette card er for den almene besøgende af siden/læseren.
 * IKKE BLOG CONTENT-CREATOREN
 */


'use client';
import { useState, memo } from 'react';
import ClickableCard from '@/components/ui/custom/cards/ClickableCard';
import { Card, Tooltip, Avatar, Button } from '@/components/ui/heroui';
import Image from 'next/image';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { MdOutlineArticle, MdRemoveRedEye, MdTouchApp } from 'react-icons/md';
import { ROUTES } from '@/constants/navigationConstants';
import type { BlogCardPreviewDTO } from '@/api/types/AngoraDTOs';
import { formatBlogDate } from '@/utils/formatters';

interface Props {
	blog: BlogCardPreviewDTO;
	onClick?: () => void;
	onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
	initialFavorite?: boolean;
}


const BlogPreviewCard = memo(function BlogPreviewCard({
	blog,
	onClick,
	onFavoriteToggle,
	initialFavorite = false
}: Props) {
	const [imageError, setImageError] = useState(false);
	const [isFavorite, setIsFavorite] = useState(initialFavorite);

	const defaultImage = '/images/DB-Angora.png';
	const featuredImage = (!imageError && blog.profilePhotoUrl) || defaultImage;

	// Card click handler
	const handleCardPress = () => {
		if (onClick) onClick();
		else window.location.href = ROUTES.BLOGS.BLOG(blog.slug);
	};

	// Blog type chip
	const typeChip = (
		<div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600/90 to-blue-500/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-blue-400/20">
			<MdOutlineArticle size={14} />
			<span className="truncate max-w-[120px]">Blog</span>
		</div>
	);

	// Dato formattering
	const formatDate = (dateStr?: string | null) => {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		const currentYear = new Date().getFullYear();
		const dateYear = d.getFullYear();

		if (dateYear === currentYear) {
			// Samme år: "Jan 5"
			return d.toLocaleDateString('da-DK', { month: 'short', day: 'numeric' });
		} else {
			// Andet år: "Jan 5, 2025"
			return d.toLocaleDateString('da-DK', { month: 'short', day: 'numeric', year: 'numeric' });
		}
	};

	// Synlighed display mapper
	const visibilityDisplay = (level: string) => {
		switch (level) {
			case 'Public': return 'Offentlig';
			case 'Paid': return 'Betalt';
			default: return level;
		}
	};

	return (
		<div className="relative">
		<ClickableCard
			onClick={handleCardPress}
			className="w-full h-full flex flex-col transition-all duration-300 backdrop-saturate-150 border select-none group overflow-hidden hover:-translate-y-1"
		>
			{/* Billede container */}
			<div className="relative w-full h-64 overflow-hidden">
				<Image
					src={featuredImage}
					alt={blog.title}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					className="object-cover"
					onError={() => setImageError(true)}
					draggable={false}
				/>

				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

				{/* Type chip - nederst til venstre */}
				<div className="absolute bottom-3 left-3 z-10 select-none">
					{typeChip}
				</div>
			</div>

			{/* Header sektion med titel og forfatter */}
			<Card.Header className="flex flex-col items-start gap-2.5 py-4 px-5">
				<h3 className="text-lg font-bold line-clamp-2 text-left w-full leading-snug group-hover:text-primary transition-colors duration-300">
					{blog.title}
				</h3>

				<div className="flex flex-row items-center gap-2.5 w-full">
					<Avatar size="sm" className="border-2 border-primary/20 ring-2 ring-primary/5">
						<Avatar.Image src={blog.authorPhotoUrl ?? undefined} alt={blog.authorName ?? 'Ukendt forfatter'} />
						<Avatar.Fallback>{(blog.authorName ?? 'U').charAt(0)}</Avatar.Fallback>
					</Avatar>
					<div className="flex flex-col justify-center">
						<span className="text-sm font-medium text-body">
							{blog.authorName ?? 'Ukendt forfatter'}
						</span>
					</div>
				</div>

				{blog.subtitle && (
					<div className="text-sm text-primary/70 italic line-clamp-2 text-left w-full leading-relaxed">
						{blog.subtitle}
					</div>
				)}
			</Card.Header>

			{/* Body sektion med summary */}
			<Card.Content className="flex-1 py-0 px-5 pb-0">
				<div
					className="line-clamp-3 text-sm mb-4 leading-relaxed text-muted"
					dangerouslySetInnerHTML={{ __html: blog.contentSummary }}
				/>
			</Card.Content>

			{/* Stats footer - enhanced design */}
			<Card.Footer className="px-5 pb-4 pt-3 border-t border-divider flex flex-wrap items-center gap-3 text-xs">
				<span className="flex items-center gap-1.5 bg-content2/50 px-2.5 py-1 rounded-full">
					<MdRemoveRedEye size={14} className="text-primary" />
					<span className="text-muted">{visibilityDisplay(blog.visibilityLevel)}</span>
				</span>

				<span className="flex items-center gap-1 text-muted">
					{formatBlogDate(blog.publishDate ?? undefined)}
				</span>

				<span className="flex items-center gap-1.5 bg-content2/50 px-2.5 py-1 rounded-full ml-auto">
					<MdTouchApp size={14} className="text-primary" />
					<span className="text-muted">{blog.viewCount || 0}</span>
				</span>
			</Card.Footer>
		</ClickableCard>

		{/* Favorit knap - sibling af ClickableCard for at undgå nested buttons */}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					isIconOnly
					size="sm"
					variant="ghost"
					aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}
					className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 transition-all duration-200 border border-white/10 hover:border-white/30 shadow-lg hover:scale-110 select-none min-w-0 h-auto"
					onPress={() => {
						const newState = !isFavorite;
						setIsFavorite(newState);
						if (onFavoriteToggle) onFavoriteToggle(blog.slug, newState);
					}}
				>
					{isFavorite ? (
						<FaHeart className="text-red-500 drop-shadow-lg" size={18} />
					) : (
						<FaRegHeart className="text-white/90 hover:text-red-400" size={18} />
					)}
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>{isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}</Tooltip.Content>
		</Tooltip.Root>
		</div>
	);
});

export default BlogPreviewCard;
