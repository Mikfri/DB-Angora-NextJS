// src/app/rabbits/forsale-profile/[earCombId]/rabbitForsaleProfile.tsx
'use client'
import { Rabbit_ForsaleProfileDTO } from '@/Types/backendTypes';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import Image from 'next/image';

interface Props {
    rabbitProfile: Rabbit_ForsaleProfileDTO;
}

export default function RabbitForsaleProfile({ rabbitProfile }: Props) {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50">
                <CardHeader className="flex gap-4">
                    <div className="relative w-32 h-32">
                        <Image
                            src={rabbitProfile.profilePicture || '/images/default-rabbit.jpg'}
                            alt={`${rabbitProfile.nickName || 'Unavngivet kanin'}`}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{rabbitProfile.nickName || 'Unavngivet'}</h1>
                        <p className="text-zinc-400">{rabbitProfile.earCombId}</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Kanin Information</h2>
                            <p>Race: {rabbitProfile.race}</p>
                            <p>Farve: {rabbitProfile.color}</p>
                            <p>Køn: {rabbitProfile.gender}</p>
                            <p>Fødselsdato: {rabbitProfile.dateOfBirth}</p>
                            <p>Til salg: {rabbitProfile.forSale}</p>
                            <p>Til avl: {rabbitProfile.forBreeding}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Kontakt Information</h2>
                            <p>Ejer: {rabbitProfile.ownerFullName}</p>
                            <p>Telefon: {rabbitProfile.ownerPhoneNumber}</p>
                            <p>Email: {rabbitProfile.ownerEmail}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}