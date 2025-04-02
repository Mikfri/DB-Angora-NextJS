// src/components/cards/rabbitForsaleCard.tsx
'use client';
import { Rabbit_SaleDetailsPreviewDTO } from '@/api/types/AngoraDTOs';
import { Card, CardFooter, Image } from "@heroui/react";
import { useState, memo } from 'react';
import { FaMars, FaVenus, FaRegHeart, FaHeart, FaBirthdayCake } from "react-icons/fa";
import { GiRabbit } from "react-icons/gi";
import { ImPriceTag } from 'react-icons/im';
import { IoLocationOutline } from 'react-icons/io5';

interface Props {
    rabbit: Rabbit_SaleDetailsPreviewDTO;
    onClick?: () => void;
}

// Memorize the card component to prevent unnecessary re-renders
const RabbitForsaleCard = memo(function RabbitForsaleCard({ rabbit, onClick }: Props) {
    const [imageError, setImageError] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && rabbit.profilePicture) || defaultImage;

    return (
        <div className="relative">
            {/* Favorite button positioned above card */}
            <div
                className="absolute top-4 right-4 z-20 p-2 
                          rounded-full bg-black/20 backdrop-blur-sm
                          hover:bg-white/10 cursor-pointer transition-all"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                }}
                role="button"
                aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}
            >
                {isFavorite ? (
                    <FaHeart className="text-red-500" size={20} />
                ) : (
                    <FaRegHeart className="text-white/70 hover:text-red-500" size={20} />
                )}
            </div>

            <Card
                isPressable={!!onClick}
                onPress={onClick}
                isHoverable
                radius="lg"
                shadow="none"
                className="w-[300px] bg-zinc-700/90 backdrop-blur-md 
                          backdrop-saturate-150
                          transition-all duration-200
                          overflow-hidden dark group"
                classNames={{
                    base: "border-b-2 border-zinc-800/80 hover:shadow-lg hover:shadow-black/40",
                }}
            >
                {/* Image Container - optimized for faster loading */}
                <div className="relative w-full h-[240px] overflow-hidden select-none rounded-t-xl">
                    {/* Billede */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            alt={`${rabbit.race || 'Kanin'}`}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out
                                group-hover:scale-110"
                            src={profileImage}
                            onError={() => setImageError(true)}
                            loading="lazy" // Add lazy loading to defer offscreen images
                        />
                    </div>

                    {/* Gradient overlay for bedre kontrast */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-900/80 to-transparent z-10"></div>
                    {/* Pris tag */}
                    <div className="absolute bottom-4 right-4 z-10 bg-emerald-600/90 backdrop-blur-sm py-1 px-3 rounded-full">
                        <div className="flex items-center gap-1.5">
                            <ImPriceTag className="text-white" size={12} />
                            <p className="text-sm text-white font-bold">
                                {rabbit.price} kr.
                            </p>
                        </div>
                    </div>

                    {/* Race tag */}
                    <div className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-sm py-1 px-3 rounded-full">
                        <div className="flex items-center gap-1.5">
                            <GiRabbit className="text-white" size={14} />
                            <p className="text-sm text-white">
                                {rabbit.race || 'Ukendt'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Container */}
                <CardFooter className="p-4">
                    <div className="flex flex-col gap-2.5 w-full select-none">
                        {/* ID & Køn */}
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-white/90 uppercase tracking-wider font-medium">
                                {rabbit.earCombId}
                            </p>
                            <div className="flex items-center">
                                {rabbit.gender === 'Buck' ? (
                                    <FaMars className="text-blue-400" size={18} />
                                ) : (
                                    <FaVenus className="text-pink-400" size={18} />
                                )}
                            </div>
                        </div>

                        {/* Separator linje */}
                        <div className="border-t border-zinc-500/50"></div>

                        {/* Info items */}
                        <div className="flex flex-col gap-1.5">
                            {/* Alder */}
                            <div className="flex items-center gap-2 text-sm text-white/90">
                                <FaBirthdayCake className="text-white/70" size={14} />
                                <span>
                                    {rabbit.ageInMonths >= 12 ? (
                                        <>
                                            {Math.floor(rabbit.ageInMonths / 12)} år
                                            {rabbit.ageInMonths % 12 > 0 && ` ${rabbit.ageInMonths % 12} mdr`}
                                        </>
                                    ) : (
                                        `${rabbit.ageInMonths} mdr`
                                    )}
                                </span>
                            </div>

                            {/* Lokation */}
                            <div className="flex items-center gap-2 text-sm text-white/90">
                                <IoLocationOutline className="text-white/70" size={16} />
                                <span>{rabbit.zipCode} {rabbit.city}</span>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
});

// Better export for named component
export default RabbitForsaleCard;