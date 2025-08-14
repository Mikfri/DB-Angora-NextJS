'use client';

import { Rabbit_ChildPreviewDTO } from '@/api/types/AngoraDTOs';
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import Image from 'next/image';
import { useState } from 'react';
import { formatDate } from '@/utils/formatters';
import NextLink from 'next/link';

interface Props {
    child: Rabbit_ChildPreviewDTO;
    compact?: boolean; // Ny prop til kompakt visning
}

export default function RabbitChildPreviewCard({ child, compact = false }: Props) {
    const [imageError, setImageError] = useState(false);
    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && child.profilePicture) || defaultImage;

    // Forbered formaterede tekster
    const displayName = child.nickName || 'Unavngivet';

    return (
        <Card
            as={NextLink}
            href={`/account/myRabbits/rabbitProfile/${child.earCombId}`}
            className={`hover:shadow-lg transition-shadow bg-zinc-800/80 backdrop-blur-md 
            backdrop-saturate-150 border border-zinc-700/50 ${compact ? 'h-full' : ''}`}
        >
            {/* Billede sektion - mindre højde i kompakt tilstand */}
            <div className={`relative w-full ${compact ? 'h-28' : 'h-36'}`}>
                <Image
                    src={profileImage}
                    alt={`${displayName} profilbillede`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover"
                    onError={() => setImageError(true)}
                />
            </div>
            
            <CardHeader className={`flex flex-col ${compact ? 'p-2' : 'p-3'}`}>
                <p className={`${compact ? 'text-sm' : 'text-md'} font-bold text-zinc-100 truncate`} title={displayName}>
                    {displayName}
                </p>
                <p className="text-xs font-mono text-blue-400 truncate" title={child.earCombId}>
                    {child.earCombId}
                </p>
            </CardHeader>
            
            {/* I kompakt tilstand viser vi kun køn og farve */}
            <CardBody className={`text-zinc-300 ${compact ? 'p-2 pt-0' : 'p-3 pt-0'}`}>
                {compact ? (
                    // Kompakt visning - kun køn og farve på én linje
                    <div className="flex flex-wrap gap-2 justify-between">
                        {/* Køn */}
                        <div>
                            {child.gender ? (
                                <Chip 
                                    size="sm" 
                                    color={child.gender === 'Han' ? 'primary' : 'secondary'}
                                    variant="flat"
                                >
                                    {child.gender}
                                </Chip>
                            ) : (
                                <span className="text-xs text-zinc-400">Ukendt køn</span>
                            )}
                        </div>
                        
                        {/* Farve - kun hvis der er nok plads */}
                        {child.color && (
                            <div className="text-xs truncate max-w-[80px]" title={child.color}>
                                {child.color}
                            </div>
                        )}
                    </div>
                ) : (
                    // Fuld visning med alle detaljer
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {/* Køn */}
                        <span className="text-zinc-400 text-xs">Køn:</span>
                        <span className="text-xs">
                            {child.gender ? (
                                <Chip 
                                    size="sm" 
                                    color={child.gender === 'Han' ? 'primary' : 'secondary'}
                                    variant="flat"
                                >
                                    {child.gender}
                                </Chip>
                            ) : 'Ikke angivet'}
                        </span>
                        
                        {/* Fødselsdato */}
                        <span className="text-zinc-400 text-xs">Født:</span>
                        <span className="text-xs">{formatDate(child.dateOfBirth) || 'Ikke angivet'}</span>
                        
                        {/* Farve */}
                        <span className="text-zinc-400 text-xs">Farve:</span>
                        <span className="text-xs truncate" title={child.color || ''}>
                            {child.color || 'Ikke angivet'}
                        </span>
                        
                        {/* Anden forælder */}
                        <span className="text-zinc-400 text-xs">Anden forælder:</span>
                        <span className="text-xs font-mono truncate" title={child.otherParentId || ''}>
                            {child.otherParentId || 'Ikke angivet'}
                        </span>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}