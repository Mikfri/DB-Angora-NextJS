// src/components/cards/rabbitForsaleCard.tsx
'use client';

import { Rabbit_ForsalePreviewDTO } from '@/Types/AngoraDTOs';
import { Card, CardFooter, Image } from "@heroui/react";
import { useState } from 'react';
import { FaMars, FaVenus, FaRegHeart, FaHeart } from "react-icons/fa";

interface Props {
    rabbit: Rabbit_ForsalePreviewDTO;
    onClick?: () => void;
}

export default function RabbitForsaleCard({ rabbit, onClick }: Props) {
    const [imageError, setImageError] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && rabbit.profilePicture) || defaultImage;

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when clicking favorite
        setIsFavorite(!isFavorite);
    };

    return (
        <Card
            isPressable={!!onClick}
            onPress={onClick}
            isHoverable
            radius="lg"
            shadow="none"
            className="w-[300px] bg-zinc-700/50 backdrop-blur-md 
                      backdrop-saturate-150
                      transition-all duration-200
                      overflow-hidden dark group"
            classNames={{
                base: "border-b-2 border-zinc-800/80 hover:shadow-lg hover:shadow-black/40",
            }}
        >
            <div className="relative w-full h-[300px] overflow-hidden">
                {/* Billedet */}
                <div className="absolute inset-0 z-0">
                    <Image
                        alt={`${rabbit.nickName || 'Unavngiven'}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out
                                 group-hover:scale-110"
                        src={profileImage}
                        onError={() => setImageError(true)}
                    />
                </div>

                {/* Header med gradient */}
                <div className="absolute top-0 left-0 right-0 h-18 z-10 bg-gradient-to-b from-black/70 to-transparent">
                    <div className="p-4 flex justify-between items-start">
                        <div>
                            <h4 className="text-white font-medium text-lg">
                                {rabbit.race || 'Ukendt race'}
                            </h4>
                            <p className="text-sm text-white/90">
                                {rabbit.color}
                            </p>
                        </div>
                        {/* Favorite ikon */}
                        <div 
                            onClick={handleFavoriteClick}
                            className="p-2 hover:scale-110 transition-transform cursor-pointer"
                            role="button"
                            aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}
                        >
                            {isFavorite ? (
                                <FaHeart size={24} className="text-red-500" />
                            ) : (
                                <FaRegHeart size={24} className="text-white/70 hover:text-red-500" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer med basis info */}
            <CardFooter className="p-4">
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            {rabbit.gender === 'Buck' ? (
                                <FaMars size={16} className="text-blue-400" />
                            ) : (
                                <FaVenus size={16} className="text-pink-400" />
                            )}
                            <p className="text-sm text-white/90">{rabbit.gender}</p>
                        </div>
                        <p className="text-tiny text-white/90 uppercase tracking-wider">
                            {rabbit.earCombId}
                        </p>
                    </div>
                    <div className="text-sm text-white/70">
                        {rabbit.zipCode} {rabbit.city}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}