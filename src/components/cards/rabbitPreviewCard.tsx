// src/components/cards/rabbitPreviewCard.tsx
'use client';

import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';
import { Card, CardHeader, CardBody } from "@heroui/react";
import Image from 'next/image';
import { useState } from 'react';
import { formatDate } from '@/lib/utils/formatters';

interface Props {
    rabbit: Rabbit_PreviewDTO;
    onClick?: () => void;
}

export default function RabbitPreviewCard({ rabbit, onClick }: Props) {
    const [imageError, setImageError] = useState(false);
    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && rabbit.profilePicture) || defaultImage;

    return (
        <Card
            isPressable={!!onClick}
            onPress={onClick}
            className="max-w-sm hover:shadow-lg transition-shadow bg-zinc-800/80 backdrop-blur-md 
            backdrop-saturate-150 border border-zinc-700/50"
        >
            <div className="relative w-full h-48">
                <Image
                    src={profileImage}
                    alt={`${rabbit.nickName || 'Unnamed'} profile picture`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover"
                    onError={() => setImageError(true)}
                />
            </div>
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-md font-bold text-zinc-100">{rabbit.nickName}</p>
                    <p className="text-small text-zinc-400">{rabbit.earCombId}</p>
                </div>
            </CardHeader>
            <CardBody className="text-zinc-300">
                <p>Fødselsdato: {formatDate(rabbit.dateOfBirth)}</p>
                <p>Død-pr: {formatDate(rabbit.dateOfDeath)}</p>
                <p>Race: {rabbit.race}</p>
                <p>Farve: {rabbit.color}</p>
                <p>Køn: {rabbit.gender}</p>
                <p>Til avl: {rabbit.isForBreeding}</p>
            </CardBody>
        </Card>
    );
}