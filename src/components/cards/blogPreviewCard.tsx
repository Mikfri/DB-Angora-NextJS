// src/components/cards/blogPreviewCard.tsx

/*
Dette card er for den almene besøgende af siden/læseren.
IKKE BLOG CONTENT-CREATOREN*/

'use client';
import { useState, memo } from 'react';
import { Card, CardHeader, CardBody, Tooltip, Avatar } from '@heroui/react';
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
	const featuredImage = (!imageError && blog.featuredImageUrl) || defaultImage;

	// Handler til favorit knap
	const handleFavoriteClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();
		if (window.getSelection) {
			const selection = window.getSelection();
			if (selection) selection.removeAllRanges();
		}
		const newState = !isFavorite;
		setIsFavorite(newState);
		if (onFavoriteToggle) {
			onFavoriteToggle(blog.id.toString(), newState);
		}
		return false;
	};

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
		<Card
			isPressable
			onPress={handleCardPress}
			className="max-w-sm transition-all duration-300 backdrop-blur-md backdrop-saturate-150 border select-none group overflow-hidden hover:-translate-y-1"
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

				{/* Favorit knap - overlay */}
				<div
					className="absolute top-3 right-3 z-20 favorite-button select-none transition-transform duration-200 hover:scale-110"
					aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}
				>
					<Tooltip content={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}>
						<div
							className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 cursor-pointer transition-all duration-200 border border-white/10 hover:border-white/30 shadow-lg"
							onClick={handleFavoriteClick}
							onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}
							onMouseUp={e => e.stopPropagation()}
							onPointerDown={e => e.stopPropagation()}
							onPointerUp={e => e.stopPropagation()}
							onTouchStart={e => e.stopPropagation()}
							onTouchEnd={e => e.stopPropagation()}
							role="button"
							tabIndex={0}
						>
							{isFavorite ? (
								<FaHeart className="text-red-500 drop-shadow-lg" size={18} />
							) : (
								<FaRegHeart className="text-white/90 hover:text-red-400" size={18} />
							)}
						</div>
					</Tooltip>
				</div>

				{/* Type chip - nederst til venstre */}
				<div className="absolute bottom-3 left-3 z-10 select-none">
					{typeChip}
				</div>
			</div>

			{/* Header sektion med titel og forfatter */}
			<CardHeader className="flex flex-col items-start gap-2.5 py-4 px-5">
				<h3 className="text-lg font-bold line-clamp-2 text-left w-full leading-snug group-hover:text-primary transition-colors duration-300">
					{blog.title}
				</h3>

				<div className="flex flex-row items-center gap-2.5 w-full">
					<Avatar
						src={blog.authorProfilePicture ?? undefined}
						name={blog.authorName ?? 'Ukendt forfatter'}
						size="sm"
						className="border-2 border-primary/20 ring-2 ring-primary/5"
					/>
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
			</CardHeader>

			{/* Body sektion med summary */}
			<CardBody className="py-0 px-5 pb-4">
				<div
					className="line-clamp-3 text-sm mb-4 leading-relaxed text-muted"
					dangerouslySetInnerHTML={{ __html: blog.contentSummary }}
				/>

				{/* Stats footer - enhanced design */}
				<div className="flex items-center gap-3 text-xs border-t pt-3 mt-2 divider">
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
				</div>
			</CardBody>
		</Card>
	);
});

export default BlogPreviewCard;