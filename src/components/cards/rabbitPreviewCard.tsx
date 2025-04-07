// src/components/cards/rabbitPreviewCard.tsx
'use client';

import { Rabbit_PreviewDTO } from '@/api/types/AngoraDTOs';
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import Image from 'next/image';
import { useState } from 'react';
import { formatDate } from '@/lib/utils/formatters';

interface Props {
    rabbit: Rabbit_PreviewDTO;
    onClick?: () => void;
}

// Helper til at formatere boolske værdier
const formatBoolean = (value: boolean | null): string => {
    if (value === null || value === undefined) return 'Ikke angivet';
    return value ? 'Ja' : 'Nej';
};

// Helper til at vise om en værdi er tilgængelig
const formatNullableValue = (value: string | null): string => {
    return value || 'Ikke angivet';
};

export default function RabbitPreviewCard({ rabbit, onClick }: Props) {
    const [imageError, setImageError] = useState(false);
    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && rabbit.profilePicture) || defaultImage;

    // Forbered formaterede tekster
    const displayName = rabbit.nickName || 'Unavngivet kanin';
    const statusChip = rabbit.dateOfDeath ? (
        <Chip color="danger" variant="flat" size="sm">Død</Chip>
    ) : rabbit.isForBreeding ? (
        <Chip color="success" variant="flat" size="sm">Til avl</Chip>
    ) : rabbit.hasSaleDetails ? (
        <Chip color="warning" variant="flat" size="sm">Til salg</Chip>
    ) : null;

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
                    alt={`${displayName} profilbillede`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover"
                    onError={() => setImageError(true)}
                />
                {/* Status overlay */}
                {statusChip && (
                    <div className="absolute top-2 right-2">
                        {statusChip}
                    </div>
                )}
            </div>
            
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-md font-bold text-zinc-100">{displayName}</p>
                    <p className="text-small text-zinc-400">{rabbit.earCombId}</p>
                </div>
            </CardHeader>
            
            <CardBody className="text-zinc-300">
                <div className="space-y-1">
                    {/* Egenskaber med tydeligere formatering */}
                    <div className="grid grid-cols-2 gap-x-2">
                        <span className="text-zinc-400 text-sm">Fødselsdato:</span>
                        <span className="text-sm">{formatDate(rabbit.dateOfBirth) || 'Ikke angivet'}</span>
                        
                        {rabbit.dateOfDeath && (
                            <>
                                <span className="text-zinc-400 text-sm">Dødsdato:</span>
                                <span className="text-sm">{formatDate(rabbit.dateOfDeath)}</span>
                            </>
                        )}
                        
                        <span className="text-zinc-400 text-sm">Race:</span>
                        <span className="text-sm">{formatNullableValue(rabbit.race)}</span>
                        
                        <span className="text-zinc-400 text-sm">Farve:</span>
                        <span className="text-sm">{formatNullableValue(rabbit.color)}</span>
                        
                        <span className="text-zinc-400 text-sm">Køn:</span>
                        <span className="text-sm">{formatNullableValue(rabbit.gender)}</span>
                        
                        <span className="text-zinc-400 text-sm">Til avl:</span>
                        <span className="text-sm">{formatBoolean(rabbit.isForBreeding)}</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}