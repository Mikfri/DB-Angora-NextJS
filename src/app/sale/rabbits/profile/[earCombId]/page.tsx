// src/app/sale/rabbits/profile/[earCombId]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GetRabbitForsaleProfile } from '@/Services/AngoraDbService'
import RabbitForsaleProfile from './rabbitSaleProfile';

type PageProps = {
    params: Promise<{ earCombId: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata( props: PageProps): Promise<Metadata> {
    const { earCombId } = await props.params;
    try {
        const rabbit = await GetRabbitForsaleProfile(earCombId);
        return {
            title: `${rabbit.race}, ${rabbit.gender} | Til Salg`,
            description: `${rabbit.race} kanin, af farven ${rabbit.color} til salg. Født: ${rabbit.dateOfBirth}`,
            openGraph: {
                title: `${rabbit.race} ${rabbit.color} - ${rabbit.nickName || 'Unavngivet'} | Til Salg`,
                description: `${rabbit.gender} ${rabbit.race} kanin til salg. Født: ${rabbit.dateOfBirth}`,
                images: rabbit.profilePicture ? [{
                    url: `https://db-angora.dk/${rabbit.profilePicture}`,
                    width: 700,
                    height: 700,
                    alt: `${rabbit.nickName || 'Unavngivet'}`
                }] : [{
                    url: 'https://db-angora.dk/images/DB-Angora.png',
                    width: 700,
                    height: 700,
                    alt: 'DenBlå-Angora Logo'
                }],
                url: `https://db-angora.dk/sale/rabbits/profile/${earCombId}`
            },
            twitter: {
                card: 'summary_large_image',
                images: rabbit.profilePicture ? [{
                    url: `https://db-angora.dk/${rabbit.profilePicture}`,
                    width: 700,
                    height: 700,
                    alt: `${rabbit.nickName || 'Unavngivet'}`
                }] : [{
                    url: 'https://db-angora.dk/images/DB-Angora.png',
                    width: 700,
                    height: 700,
                    alt: 'DenBlå-Angora Logo'
                }]
            }
        };
    } catch {
        return {
            title: 'Kanin ikke fundet',
            description: 'Den efterspurgte kanin kunne ikke findes'
        };
    }
}

export default async function Page(props: PageProps) {
    const { earCombId } = await props.params;
    const profile = await GetRabbitForsaleProfile(earCombId).catch(() => notFound());
    return <RabbitForsaleProfile rabbitProfile={profile} />;
}