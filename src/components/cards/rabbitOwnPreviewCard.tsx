// src/components/cards/rabbitOwnPreviewCard.tsx
'use client';

import { Rabbit_OwnedPreviewDTO } from '@/api/types/AngoraDTOs';
import ClickableCard from '@/components/ui/custom/cards/ClickableCard';
import { Chip } from '@/components/ui/heroui';
import Image from 'next/image';
import { useState, ReactNode } from 'react';
import { formatDate } from '@/utils/formatters';
import { GiTombstone } from "react-icons/gi";
import { LuRabbit } from "react-icons/lu";
import { BsCalendarDate, BsGenderAmbiguous } from "react-icons/bs";
import { IoColorPaletteOutline } from "react-icons/io5";
import { ImPriceTag } from 'react-icons/im';
import { TbHeartSearch } from 'react-icons/tb';
import { PiDna } from 'react-icons/pi';

interface Props {
    rabbit: Rabbit_OwnedPreviewDTO;
    onClick?: () => void;
}

// Helper funktioner forbliver uændrede
const formatNullableValue = (value: string | null): string => {
    return value || 'Ikke angivet';
};

const formatInbreedingCoefficient = (coefficient: number | null | undefined): string => {
    if (coefficient === null || coefficient === undefined) return 'Ikke beregnet';
    return `${(coefficient * 100).toFixed(2)}%`;
};

// Type definition for status chips
type StatusChip = {
    key: string;
    color: "accent" | "default" | "success" | "warning" | "danger";
    icon: ReactNode;
    text: string;
}

export default function RabbitPreviewCard({ rabbit, onClick }: Props) {
    const [imageError, setImageError] = useState(false);
    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && rabbit.profilePhotoUrl) || defaultImage;

    // Forbered formaterede tekster
    const displayName = rabbit.nickName || 'Unavngivet kanin';

    // Generer et array af status chips
    const statusChips: StatusChip[] = [];

    // Tilføj alle relevante chips uanset om kaninen er død eller ej

    // Død chip (hvis relevant)
    if (rabbit.dateOfDeath) {
        statusChips.push({
            key: "deceased",
            color: "danger",
            icon: <GiTombstone className="mr-1" />,
            text: "Død"
        });
    }

    // Avl chip (hvis relevant)
    if (rabbit.isForBreeding) {
        statusChips.push({
            key: "breeding",
            color: "success",
            icon: <TbHeartSearch className="mr-1" />,
            text: "Til avl"
        });
    }

    // Salg chip (hvis relevant)
    if (rabbit.hasSaleDetails) {
        statusChips.push({
            key: "forsale",
            color: "success", // Ændret fra "warning" til "success" for at matche den grønne farve
            icon: <ImPriceTag className="mr-1" />, // Skiftet til ImPriceTag for at matche saleDetailsCard
            text: "Til salg"
        });
    }

    return (
        <ClickableCard
            onClick={onClick}
            className="w-full h-full flex flex-col hover:-translate-y-1"
        >
            {/* Billede */}
            <div className="relative w-full h-48 overflow-hidden">
                <Image
                    src={profileImage}
                    alt={`${displayName} profilbillede`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                    onError={() => setImageError(true)}
                    draggable={false}
                />

                {/* Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black/70 to-transparent" />

                {/* Status chips — nederst til højre */}
                {statusChips.length > 0 && (
                    <div className="absolute bottom-2 right-2 flex flex-col gap-0.5 z-10">
                        {statusChips.map((chip) => (
                            <Chip
                                key={chip.key}
                                color={chip.color}
                                variant="soft"
                                size="sm"
                                className="h-5 min-h-0"
                            >
                                {chip.icon}{chip.text}
                            </Chip>
                        ))}
                    </div>
                )}

                {/* Race tag — nederst til venstre */}
                <div className="absolute bottom-2 left-2 z-10">
                    <div className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        <LuRabbit size={11} />
                        <span className="truncate max-w-27.5">{rabbit.race}</span>
                    </div>
                </div>
            </div>

            {/* Tekst-indhold */}
            <ClickableCard.Content>
                <div className="space-y-1.5">
                    {/* Navn + øremærke */}
                    <div>
                        <p className="text-sm font-semibold text-foreground line-clamp-1 leading-snug">{displayName}</p>
                        <p className="text-xs text-muted">{rabbit.earCombId}</p>
                    </div>

                    {/* Kompakte info-rækker */}
                    <div className="space-y-0.5 text-xs text-muted">
                        <div className="flex items-center gap-1.5">
                            <BsCalendarDate size={11} className="shrink-0" />
                            <span>{formatDate(rabbit.dateOfBirth) || 'Fødselsdato ikke angivet'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <BsGenderAmbiguous size={11} className="shrink-0" />
                            <span>{formatNullableValue(rabbit.gender)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <IoColorPaletteOutline size={11} className="shrink-0" />
                            <span>{formatNullableValue(rabbit.color)}</span>
                        </div>
                        {rabbit.inbreedingCoefficient !== null && rabbit.inbreedingCoefficient !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <PiDna size={11} className="shrink-0" />
                                <span>Indavl: {formatInbreedingCoefficient(rabbit.inbreedingCoefficient)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </ClickableCard.Content>
        </ClickableCard>
    );
}
