// src/components/cards/saleDetailsCard.tsx
'use client';

import Image from 'next/image';
import { SaleDetailsPublicCardDTO } from '@/api/types/AngoraDTOs';
import ClickableCard from '@/components/ui/custom/cards/ClickableCard';
import { Tooltip, Button } from '@/components/ui/heroui';
import { useState, memo } from 'react';
import { formatRelativeDate } from '@/utils/formatters';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoLocationOutline } from 'react-icons/io5';
import { CiDeliveryTruck } from "react-icons/ci";

interface Props {
    item: SaleDetailsPublicCardDTO;
    onClick?: () => void;
    onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
    initialFavorite?: boolean;
}

const SaleDetailsCard = memo(function SaleDetailsCard({
    item,
    onClick,
    onFavoriteToggle,
    initialFavorite = false
}: Props) {
    const [imageError, setImageError] = useState(false);
    const [isFavorite, setIsFavorite] = useState(initialFavorite);

    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && item.profilePhotoUrl) || defaultImage;

    const handleCardPress = () => {
        if (onClick) onClick();
    };
    
    const formattedRelativeDate = formatRelativeDate(item.dateListed);

    return (
        <div className="relative hover:-translate-y-1 transition-transform duration-300">
        <ClickableCard
            onClick={handleCardPress}
            className="max-w-sm"
        >
            {/* Billede container */}
            <div className="relative w-full h-48 overflow-hidden">
                <Image
                    src={profileImage}
                    alt={`${item.title || 'Salgsobjekt'} billede`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    onError={() => setImageError(true)}
                    draggable={false}
                />
                {item.canBeShipped && (
                    <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-full bg-green-700/80 backdrop-blur-sm px-2 py-0.5 text-white">
                        <CiDeliveryTruck size={16} />
                        <span className="text-xs">Kan sendes</span>
                    </div>
                )}
            </div>

            {/* Tekst-indhold */}
            <ClickableCard.Content>
                <div className="space-y-1">
                    {/* Lokation + dato */}
                    <div className="flex items-center gap-1 text-xs text-muted">
                        <IoLocationOutline size={12} className="shrink-0" />
                        <span>{item.zipCode} {item.city}</span>
                        <span>·</span>
                        <span>{formattedRelativeDate}</span>
                    </div>

                    {/* Titel */}
                    <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                        {item.title}
                    </p>

                    {/* Pris */}
                    <p className="text-base font-bold text-foreground">
                        {item.price} kr.
                    </p>


                </div>
            </ClickableCard.Content>
        </ClickableCard>

        {/* Favorit knap - sibling af ClickableCard for at undgå nested buttons */}
        <Tooltip.Root>
            <Tooltip.Trigger>
                <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}
                    className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 transition-all duration-200 border border-white/10 hover:border-white/30 shadow-lg hover:scale-110 select-none"
                    onPress={() => {
                        const newState = !isFavorite;
                        setIsFavorite(newState);
                        if (onFavoriteToggle) onFavoriteToggle(item.slug, newState);
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

export default SaleDetailsCard;
