// src/components/cards/rabbitForsaleCard.tsx
'use client';

import { Rabbit_ForsalePreviewDTO } from '@/types/backendTypes';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
    rabbit: Rabbit_ForsalePreviewDTO;
    onClick?: () => void;
}

export default function RabbitForsaleCard({ rabbit, onClick }: Props) {
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
                    alt={`${rabbit.nickName} profile picture`}
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
                <p>Fødselsdato: {rabbit.dateOfBirth}</p>
                <p>Race: {rabbit.race}</p>
                <p>Farve: {rabbit.color}</p>
                <p>Køn: {rabbit.gender}</p>
                <p>Postnummer: {rabbit.zipCode}</p>
                <p>By: {rabbit.city}</p>
                <p>Ejer: {rabbit.userOwner}</p>
            </CardBody>
        </Card>
    );
}