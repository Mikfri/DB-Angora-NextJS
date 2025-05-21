// src/components/cards/saleDetailsCard.tsx
'use client';

import { SaleDetailsCardDTO } from '@/api/types/AngoraDTOs';
import { Card, CardHeader, CardBody, Tooltip, Divider } from "@heroui/react";
import { useState, memo } from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { ImPriceTag } from 'react-icons/im';
import { IoLocationOutline } from 'react-icons/io5';
import { LuRabbit } from "react-icons/lu";
import { GiWool } from "react-icons/gi";
import { BsClock } from "react-icons/bs";
import Image from 'next/image';

interface Props {
    item: SaleDetailsCardDTO;
    onClick?: () => void;
    onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
    initialFavorite?: boolean;
}

// Memorized komponent for bedre ydeevne
const SaleDetailsCard = memo(function SaleDetailsCard({ 
    item, 
    onClick, 
    onFavoriteToggle,
    initialFavorite = false
}: Props) {
    const [imageError, setImageError] = useState(false);
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    
    // Ændr dette til at bruge det eksisterende default billede
    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && item.imageUrl) || defaultImage;

    // Resten af komponenten forbliver uændret...
    
    // Handler til favorit knap med kritisk fix
    const handleFavoriteClick = (event: React.MouseEvent) => {
        // Disse linjer stopper event bubbling, forebygger navigation og tekst-selektion
        event.stopPropagation();
        event.preventDefault();
        
        // Forhindrer tekst-selektion
        if (window.getSelection) {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
            }
        }
        
        const newState = !isFavorite;
        setIsFavorite(newState);
        
        if (onFavoriteToggle) {
            onFavoriteToggle(item.entityId, newState);
        }

        // Returnér false for at forhindre videre event propagation
        return false;
    };

    // Håndter card press for navigation (anbefalet tilgang med HeroUI)
    const handleCardPress = () => {
        if (onClick) {
            onClick();
        }
    };

    // Bestem ikon baseret på entityType
    const getEntityIcon = () => {
        // Default til rabbit hvis entityType mangler (migration kompatibilitet)
        const entityType = item.entityType?.toLowerCase() || 'rabbit';
        
        switch (entityType) {
            case 'rabbit':
                return <LuRabbit size={14} />;
            case 'wool':
                return <GiWool size={14} />;
            default:
                return <LuRabbit size={14} />; // Default ikon hvis typen er ukendt
        }
    };

    // Type chip med passende ikon
    const typeChip = (
        <div className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-sm font-medium px-2 py-1 rounded-full shadow-sm">
            {getEntityIcon()}
            <span className="truncate max-w-[120px]">{item.title || 'Ukendt'}</span>
        </div>
    );

    // Pris chip
    const priceChip = (
        <div className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-sm font-medium px-2 py-1 rounded-full shadow-sm">
            <ImPriceTag size={12} />
            <span>{item.price} kr.</span>
        </div>
    );

    // Beregn hvor længe siden annoncen blev oprettet
    const calculateTimeSince = () => {
        if (!item.dateListed) return 'Ukendt';
        
        const listedDate = new Date(item.dateListed);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - listedDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'I dag';
        } else if (diffDays === 1) {
            return 'I går';
        } else if (diffDays < 7) {
            return `${diffDays} dage siden`;
        } else if (diffDays < 31) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'uge' : 'uger'} siden`;
        } else {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? 'måned' : 'måneder'} siden`;
        }
    };

    return (
        <Card
            isPressable
            onPress={handleCardPress}
            className="max-w-sm hover:shadow-lg transition-shadow bg-zinc-800/80 backdrop-blur-md 
                     backdrop-saturate-150 border border-zinc-700/50 select-none"
        >
            {/* Billede container */}
            <div className="relative w-full h-64">
                <Image
                    src={profileImage}
                    alt={`${item.title || 'Salgsobjekt'} billede`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    onError={() => setImageError(true)}
                    draggable={false}
                />
                
                {/* Bund gradient for type og pris */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Type tag - nederst til venstre */}
                <div className="absolute bottom-2 left-2 z-10 select-none">
                    {typeChip}
                </div>
                
                {/* Pris tag - nederst til højre */}
                <div className="absolute bottom-2 right-2 z-10 select-none">
                    {priceChip}
                </div>

                {/* Favorit knap - øverst til højre */}
                <div 
                    className="absolute top-2 right-2 z-20 favorite-button select-none"
                    aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}
                >
                    <Tooltip content={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}>
                        <div
                            className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm
                                   hover:bg-white/10 cursor-pointer"
                            onClick={handleFavoriteClick}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                            onMouseUp={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
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
            </div>
            
            {/* Header sektion med ID */}
            <CardHeader className="flex gap-3 py-2.5">
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between">
                        <p className="text-small text-zinc-300">ID: {item.entityId}</p>
                    </div>
                </div>
            </CardHeader>
            
            {/* Body sektion med ikoner */}
            <CardBody className="text-zinc-300 py-0 pb-3 select-none">
                <div className="space-y-2">
                    <div className="flex items-center">
                        <BsClock className="text-zinc-400 mr-2 shrink-0" size={14} />
                        <div className="grid grid-cols-2 gap-x-2 w-full">
                            <span className="text-zinc-400 text-sm">Oprettet:</span>
                            <span className="text-sm">{calculateTimeSince()}</span>
                        </div>
                    </div>
                    
                    {/* Lysere divider mellem tid og lokation */}
                    <Divider className="my-1.5 bg-zinc-700/50" />
                    
                    <div className="flex items-center">
                        <IoLocationOutline className="text-zinc-400 mr-2 shrink-0" size={16} />
                        <div className="grid grid-cols-2 gap-x-2 w-full">
                            <span className="text-zinc-400 text-sm">Lokation:</span>
                            <span className="text-sm truncate">{item.zipCode} {item.city}</span>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
});

export default SaleDetailsCard;