// src/app/sale/rabbits/profile/[earCombId]/rabbitSaleProfile.tsx
'use client'
import { Rabbit_ForsaleProfileDTO } from '@/api/types/AngoraDTOs';
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

interface Props {
    rabbitProfile: Rabbit_ForsaleProfileDTO;
}

export default function RabbitForsaleProfile({ rabbitProfile }: Props) {
    // Udpak data med nullchecking
    const hasSaleDetails = !!rabbitProfile?.saleDetailsProfile;
    const price = hasSaleDetails ? rabbitProfile.saleDetailsProfile.price : 0;
    const dateListed = hasSaleDetails ? rabbitProfile.saleDetailsProfile.dateListed : '';
    const saleDescription = hasSaleDetails ? rabbitProfile.saleDetailsProfile.saleDescription : '';
    
    // Udpak RabbitSaleDetails
    const hasRabbitSaleDetails = hasSaleDetails && !!rabbitProfile.saleDetailsProfile.rabbitSaleDetails;
    const homeEnvironment = hasRabbitSaleDetails ? rabbitProfile.saleDetailsProfile.rabbitSaleDetails?.homeEnvironment : 'Ikke angivet';
    const isNeutered = hasRabbitSaleDetails ? rabbitProfile.saleDetailsProfile.rabbitSaleDetails?.isNeutered : false;
    const isLitterTrained = hasRabbitSaleDetails ? rabbitProfile.saleDetailsProfile.rabbitSaleDetails?.isLitterTrained : false;
    
    // Vælg det bedste billede at vise
    const profileImage = rabbitProfile.saleDetailsProfile?.imageUrl || 
                         rabbitProfile.photos?.[0]?.filePath || 
                         '/images/default-rabbit.jpg';
    
    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50">
                <CardHeader className="flex gap-4">
                    <div className="relative w-32 h-32">
                        <Image
                            src={profileImage}
                            alt={`${rabbitProfile.nickName || 'Unavngivet kanin'}`}
                            className="object-cover rounded-lg"
                            width={128}
                            height={128}
                        />
                    </div>
                    
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{rabbitProfile.nickName || 'Unavngivet'}</h1>
                            <p className="text-zinc-400">
                                {rabbitProfile.saleDetailsProfile?.rabbitSaleDetails?.rabbitId || 'ID ikke tilgængelig'}
                            </p>
                        </div>
                        <div className="mt-2">
                            <span className="text-xl font-semibold text-amber-500">
                                {formatCurrency(price)}
                            </span>
                            {dateListed && (
                                <p className="text-xs text-zinc-400">
                                    Oprettet {formatDate(dateListed)}
                                </p>
                            )}
                        </div>
                    </div>
                </CardHeader>
                
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Kanin Information</h2>
                            <div className="space-y-2">
                                <p><span className="text-zinc-400">Race:</span> {rabbitProfile.race || 'Ikke angivet'}</p>
                                <p><span className="text-zinc-400">Farve:</span> {rabbitProfile.color || 'Ikke angivet'}</p>
                                <p><span className="text-zinc-400">Køn:</span> {rabbitProfile.gender || 'Ikke angivet'}</p>
                                <p><span className="text-zinc-400">Fødselsdato:</span> {formatDate(rabbitProfile.dateOfBirth || '')}</p>
                                <p><span className="text-zinc-400">Til avl:</span> {rabbitProfile.isForBreeding ? 'Ja' : 'Nej'}</p>
                            </div>
                            
                            <Divider className="my-4" />
                            
                            <h2 className="text-xl font-semibold mb-3">Salgs Detaljer</h2>
                            <div className="space-y-2">
                                <p>
                                    <span className="text-zinc-400">Boform:</span> {homeEnvironment}
                                </p>
                                <p>
                                    <span className="text-zinc-400">Neutraliseret:</span> {isNeutered ? 'Ja' : 'Nej'}
                                </p>
                                <p>
                                    <span className="text-zinc-400">Bakketrænet:</span> {isLitterTrained ? 'Ja' : 'Nej'}
                                </p>
                            </div>
                        </div>
                        
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Beskrivelse</h2>
                            <div className="bg-zinc-900/50 p-4 rounded-lg mb-4">
                                <p className="text-zinc-300 whitespace-pre-wrap">
                                    {saleDescription || 'Ingen beskrivelse tilgængelig.'}
                                </p>
                            </div>
                            
                            <h2 className="text-xl font-semibold mb-3">Kontakt Information</h2>
                            <div className="space-y-2">
                                <p><span className="text-zinc-400">Ejer:</span> {rabbitProfile.ownerFullName || 'Ikke angivet'}</p>
                                <p><span className="text-zinc-400">Telefon:</span> {rabbitProfile.ownerPhoneNumber || 'Ikke angivet'}</p>
                                <p><span className="text-zinc-400">Email:</span> {rabbitProfile.ownerEmail || 'Ikke angivet'}</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}