'use client';

import { Rabbit_SaleDetailsPreviewDTO } from '@/api/types/AngoraDTOs';
import { Card, CardHeader, CardBody, Tooltip, Divider } from "@heroui/react";
import { useState, memo } from 'react';
import { FaMars, FaVenus, FaRegHeart, FaHeart, FaBirthdayCake } from "react-icons/fa";
import { ImPriceTag } from 'react-icons/im';
import { IoLocationOutline } from 'react-icons/io5';
import { LuRabbit } from "react-icons/lu";
import Image from 'next/image';

interface Props {
    rabbit: Rabbit_SaleDetailsPreviewDTO;
    onClick?: () => void;
    onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
    initialFavorite?: boolean;
}

// Hjælpefunktioner til formatering af alder
const formatAge = (months: number) => {
    if (months >= 12) {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return `${years} ${years === 1 ? 'år' : 'år'}${remainingMonths > 0 ? ` ${remainingMonths} mdr` : ''}`;
    }
    return `${months} mdr`;
};

// Memorized komponent for bedre ydeevne
const RabbitForsaleCard = memo(function RabbitForsaleCard({ 
    rabbit, 
    onClick, 
    onFavoriteToggle,
    initialFavorite = false
}: Props) {
    const [imageError, setImageError] = useState(false);
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && rabbit.profilePicture) || defaultImage;

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
            onFavoriteToggle(rabbit.earCombId, newState);
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

    // Race chip med LuRabbit ikon
    const raceChip = (
        <div className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-sm font-medium px-2 py-1 rounded-full shadow-sm">
            <LuRabbit size={14} />
            <span className="truncate max-w-[120px]">{rabbit.race || 'Ukendt race'}</span>
        </div>
    );

    // Pris chip
    const priceChip = (
        <div className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-sm font-medium px-2 py-1 rounded-full shadow-sm">
            <ImPriceTag size={12} />
            <span>{rabbit.price} kr.</span>
        </div>
    );

    return (
        <Card
            isPressable
            onPress={handleCardPress}
            className="max-w-sm hover:shadow-lg transition-shadow bg-zinc-800/80 backdrop-blur-md 
                     backdrop-saturate-150 border border-zinc-700/50 select-none"
        >
            {/* Billede container med STØRRE HØJDE */}
            <div className="relative w-full h-64">
                <Image
                    src={profileImage}
                    alt={`${rabbit.race || 'Kanin'} profilbillede`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    onError={() => setImageError(true)}
                    draggable={false}
                />
                
                {/* Top gradient for favorit ikonen */}
                {/* <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/40 to-transparent" /> */}
                
                {/* Bund gradient for race og pris */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Race tag - nederst til venstre */}
                <div className="absolute bottom-2 left-2 z-10 select-none">
                    {raceChip}
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
            
            {/* Header sektion med kun ID og køn */}
            <CardHeader className="flex gap-3 py-2.5">
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between">
                        <p className="text-small text-zinc-300">{rabbit.earCombId}</p>
                        <Tooltip content={rabbit.gender === 'Buck' ? 'Han' : 'Hun'}>
                            <span>
                                {rabbit.gender === 'Buck' ? (
                                    <FaMars className="text-blue-400" size={16} />
                                ) : (
                                    <FaVenus className="text-pink-400" size={16} />
                                )}
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </CardHeader>
            
            {/* Body sektion med ikoner */}
            <CardBody className="text-zinc-300 py-0 pb-3 select-none">
                <div className="space-y-2">
                    <div className="flex items-center">
                        <FaBirthdayCake className="text-zinc-400 mr-2 shrink-0" size={14} />
                        <div className="grid grid-cols-2 gap-x-2 w-full">
                            <span className="text-zinc-400 text-sm">Alder:</span>
                            <span className="text-sm">{formatAge(rabbit.ageInMonths)}</span>
                        </div>
                    </div>
                    
                    {/* Lysere divider mellem alder og lokation */}
                    <Divider className="my-1.5 bg-zinc-700/50" />
                    
                    <div className="flex items-center">
                        <IoLocationOutline className="text-zinc-400 mr-2 shrink-0" size={16} />
                        <div className="grid grid-cols-2 gap-x-2 w-full">
                            <span className="text-zinc-400 text-sm">Lokation:</span>
                            <span className="text-sm truncate">{rabbit.zipCode} {rabbit.city}</span>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
});

export default RabbitForsaleCard;