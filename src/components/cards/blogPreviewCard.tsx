// src/components/cards/blogPreviewCard.tsx
'use client';
import { useState, memo } from 'react';
import { Card, CardHeader, CardBody, Tooltip, Avatar } from '@heroui/react';
import Image from 'next/image';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { MdOutlineArticle } from 'react-icons/md';
import { ROUTES } from '@/constants/navigationConstants';
import type { Blog_CardDTO } from '@/api/types/AngoraDTOs';

interface Props {
	blog: Blog_CardDTO;
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

	// Handler til favorit knap (samme som SaleDetailsCard)
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
		<div className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-sm font-medium px-2 py-1 rounded-full shadow-sm">
			<MdOutlineArticle size={16} />
			<span className="truncate max-w-[120px]">Blog</span>
		</div>
	);

	// Dato formattering
	const formatDate = (dateStr?: string | null) => {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('da-DK', { year: 'numeric', month: 'short', day: 'numeric' });
	};

	return (
		<Card
			isPressable
			onPress={handleCardPress}
			className="max-w-sm hover:shadow-lg transition-shadow bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50 select-none"
		>
			{/* Billede container */}
			<div className="relative w-full h-64">
				<Image
					src={featuredImage}
					alt={blog.title}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					className="object-cover"
					onError={() => setImageError(true)}
					draggable={false}
				/>
				{/* Favorit knap - overlay, samme tilgang som SaleDetailsCard */}
				<div
					className="absolute top-2 right-2 z-20 favorite-button select-none"
					aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}
				>
					<Tooltip content={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}>
						<div
							className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-white/10 cursor-pointer"
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
								<FaHeart className="text-red-500" size={16} />
							) : (
								<FaRegHeart className="text-white/80 hover:text-red-400" size={16} />
							)}
						</div>
					</Tooltip>
				</div>
				{/* Bund gradient for type chip */}
				<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
				{/* Type chip - nederst til venstre */}
				<div className="absolute bottom-2 left-2 z-10 select-none">
					{typeChip}
				</div>
			</div>

			{/* Header sektion med titel og forfatter */}
			<CardHeader className="flex flex-col items-start gap-1 py-2.5 px-4">
				<h3 className="text-md font-bold text-zinc-100 line-clamp-2 text-left w-full">{blog.title}</h3>
				<div className="flex flex-row items-start gap-2 w-full">
					<Avatar
						src={blog.authorProfilePicture ?? undefined}
						name={blog.authorName ?? 'Ukendt forfatter'}
						size="sm"
						className="border border-zinc-700 mt-0.5"
					/>
					<div className="flex flex-col">
						<div className="flex items-center gap-2 text-xs text-zinc-400">
							<span>{blog.authorName ?? 'Ukendt forfatter'}</span>
							<span>•</span>
							<span>{formatDate(blog.publishDate ?? undefined)}</span>
						</div>
						<div className="text-xs text-zinc-500 italic text-left">Synlighed: {blog.blogVisibility}</div>
					</div>
				</div>
				{blog.subTitle && (
					<div className="text-xs text-zinc-400 italic line-clamp-1 text-left w-full">{blog.subTitle}</div>
				)}
			</CardHeader>

			{/* Body sektion med summary */}
			<CardBody className="text-zinc-300 py-2 px-4">
				<div
					className="line-clamp-3 text-sm mb-2"
					dangerouslySetInnerHTML={{ __html: blog.contentSummary }}
				/>
			</CardBody>
		</Card>
	);
});

export default BlogPreviewCard;
// src/components/cards/blogPreviewCard.tsx