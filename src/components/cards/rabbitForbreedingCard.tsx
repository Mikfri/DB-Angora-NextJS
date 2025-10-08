// src/components/cards/rabbitForbreedingCard.tsx
'use client';

import { Rabbit_ForbreedingPreviewDTO } from '@/api/types/AngoraDTOs';
import { Card, CardHeader, CardBody, Chip, Divider } from "@heroui/react";
import Image from 'next/image';
import { useState, ReactNode } from 'react';
import { formatDate } from '@/utils/formatters';
import { LuRabbit } from "react-icons/lu";
import { BsCalendarDate, BsGenderAmbiguous } from "react-icons/bs";
import { IoColorPaletteOutline } from "react-icons/io5";
import { SiMicrogenetics } from "react-icons/si";
import { TbHeartSearch } from 'react-icons/tb';

interface Props {
    rabbit: Rabbit_ForbreedingPreviewDTO;
    onClick?: () => void;
}

const formatNullableValue = (value: string | null | undefined): string => {
    return value || 'Ikke angivet';
};

const formatInbreedingCoefficient = (coefficient: number | null | undefined): string => {
    if (coefficient === null || coefficient === undefined) return 'Ikke beregnet';
    return `${(coefficient * 100).toFixed(2)}%`;
};

type StatusChip = {
    key: string;
    color: "primary" | "secondary" | "success" | "warning" | "danger";
    icon: ReactNode;
    text: string;
}

export default function RabbitForbreedingCard({ rabbit, onClick }: Props) {
    const [imageError, setImageError] = useState(false);
    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && rabbit.profilePicture) || defaultImage;

    const displayName = rabbit.nickName || 'Unavngivet kanin';

    // Status chips
    const statusChips: StatusChip[] = [];

    // Avl chip (altid relevant for denne type)
    statusChips.push({
        key: "breeding",
        color: "success",
        icon: <TbHeartSearch className="mr-1" />,
        text: "Til avl"
    });

    return (
        <Card
            isPressable={!!onClick}
            onPress={onClick}
            className="max-w-sm hover:shadow-lg transition-shadow bg-zinc-800/80 backdrop-blur-md 
            backdrop-saturate-150 border border-zinc-700/50"
        >
            <div className="relative w-full h-64">
                <Image
                    src={profileImage}
                    alt={`${displayName} profilbillede`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    onError={() => setImageError(true)}
                    draggable={false}
                />

                {/* Bund gradient for bedre læsbarhed af chips */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Status chips - nederst til højre */}
                <div className="absolute bottom-2 right-2 flex flex-col gap-0.5 z-10">
                    {statusChips.map((chip) => (
                        <Chip
                            key={chip.key}
                            color={chip.color}
                            variant="flat"
                            size="md"
                            startContent={chip.icon}
                            className="h-6 min-h-0 text-foreground-300"
                        >
                            {chip.text}
                        </Chip>
                    ))}
                </div>

                {/* Race/Farve tag - nederst til venstre */}
                <div className="absolute bottom-2 left-2 z-10">
                    <div className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-sm font-medium px-2 py-0.5 rounded-full shadow-sm">
                        <LuRabbit className="text-sm" />
                        <span className="truncate max-w-[120px]">{formatNullableValue(rabbit.race)}</span>
                    </div>
                </div>
            </div>

            <CardHeader className="pb-0 pt-3 px-4">
                <div className="flex flex-col">
                    <p className="text-md font-bold text-zinc-100">{displayName}</p>
                    <p className="text-xs text-zinc-400">{rabbit.earCombId}</p>
                </div>
            </CardHeader>

            <CardBody className="text-zinc-300 py-2 px-4">
                <div className="space-y-1">
                    {/* Hovedegenskaber med ikoner - kompakte rækker */}
                    <div className="flex items-center text-xs">
                        <BsCalendarDate className="text-zinc-400 mr-2 shrink-0" size={12} />
                        <div className="grid grid-cols-2 gap-x-2 w-full">
                            <span className="text-zinc-400">Fødselsdato:</span>
                            <span>{formatDate(rabbit.dateOfBirth) || 'Ikke angivet'}</span>
                        </div>
                    </div>

                    <Divider className="my-0.5 bg-zinc-700/30" />

                    <div className="flex items-center text-xs">
                        <IoColorPaletteOutline className="text-zinc-400 mr-2 shrink-0" size={12} />
                        <div className="grid grid-cols-2 gap-x-2 w-full">
                            <span className="text-zinc-400">Farve:</span>
                            <span>{formatNullableValue(rabbit.color)}</span>
                        </div>
                    </div>

                    <div className="flex items-center text-xs">
                        <BsGenderAmbiguous className="text-zinc-400 mr-2 shrink-0" size={12} />
                        <div className="grid grid-cols-2 gap-x-2 w-full">
                            <span className="text-zinc-400">Køn:</span>
                            <span>{formatNullableValue(rabbit.gender)}</span>
                        </div>
                    </div>

                    <div className="flex items-center text-xs">
                        <SiMicrogenetics className="text-zinc-400 mr-2 shrink-0" size={12} />
                        <div className="grid grid-cols-2 gap-x-2 w-full">
                            <span className="text-zinc-400">Indavl:</span>
                            <span>{formatInbreedingCoefficient(rabbit.inbreedingCoefficient)}</span>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}