// src/components/cards/rabbitForsaleCard.tsx
'use client';
import { Rabbit_SaleDetailsPreviewDTO } from '@/api/types/AngoraDTOs';
import { Card, CardFooter, Image } from "@heroui/react";
import { useState } from 'react';
import { FaMars, FaVenus, FaRegHeart, FaHeart, FaPaw, FaPalette } from "react-icons/fa";

interface Props {
    rabbit: Rabbit_SaleDetailsPreviewDTO;
    onClick?: () => void;
}

export default function RabbitForsaleCard({ rabbit, onClick }: Props) {
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
                className="w-[300px] bg-zinc-700/50 backdrop-blur-md 
                          backdrop-saturate-150
                          transition-all duration-200
                          overflow-hidden dark group"
                classNames={{
                    base: "border-b-2 border-zinc-800/80 hover:shadow-lg hover:shadow-black/40",
                }}
            >
                <div className="relative w-full h-[300px] overflow-hidden select-none">
                    {/* Billedet */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            alt={`${rabbit.ageInMonths || 'Unavngiven'}`}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out
                                group-hover:scale-110"
                            src={profileImage}
                            onError={() => setImageError(true)}
                        />
                    </div>

                    {/* Footer med gradient */}
                    <div className="absolute bottom-0 left-0 right-0 z-10
                        bg-gradient-to-t from-zinc-700/50 via-black/50 to-transparent">
                        <div className="p-4 pt-8 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <FaPaw className="text-white/70" size={16} />
                                <h4 className="text-white font-medium text-lg">
                                    {rabbit.race || 'Ukendt race'}
                                </h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaPalette className="text-white/70" size={14} />
                                <p className="text-sm text-white/80">
                                    {rabbit.price} kr
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Header med gradient */}
                    {/* <div className="absolute top-0 left-0 right-0 h-18 z-10 bg-gradient-to-b from-black/70 to-transparent">
                        <div className="p-4">
                            <h4 className="text-white font-medium text-lg">
                                {rabbit.race || 'Ukendt race'}
                            </h4>
                            <p className="text-sm text-white/90">
                                {rabbit.color}
                            </p>
                        </div>
                    </div> */}

                </div>

                {/* Footer med basis info */}
                <CardFooter className="p-4">
                    <div className="flex flex-col gap-3 w-full select-none">
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
        </div>
    );
}