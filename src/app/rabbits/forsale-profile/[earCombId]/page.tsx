// src/app/rabbits/forsale-profile/[earCombId]/page.tsx
import { Metadata } from 'next'
import { GetRabbitForsaleProfile } from "@/services/AngoraDbService";
import RabbitForsaleProfile from './rabbitForsaleProfile'; 
import { notFound } from 'next/navigation';

interface PageProps {
    params: { earCombId: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { earCombId } = params;
    
    try {
        const rabbit = await GetRabbitForsaleProfile(earCombId);
        return {
            title: `${rabbit.race} ${rabbit.color} - ${rabbit.nickName || 'Unavngivet'} | Til Salg`,
            description: `${rabbit.gender} ${rabbit.race} kanin til salg. Født: ${rabbit.dateOfBirth}`,
            openGraph: {
                images: rabbit.profilePicture ? [rabbit.profilePicture] : [],
            },
        }
    } catch {
        return {
            title: 'Kanin ikke fundet',
            description: 'Den efterspurgte kanin kunne ikke findes'
        }
    }
}

export default async function RabbitForsaleProfilePage({ params }: PageProps) {
    const { earCombId } = params;
    
    try {
        const rabbitProfile = await GetRabbitForsaleProfile(earCombId);
        return <RabbitForsaleProfile rabbitProfile={rabbitProfile} />;
    } catch {
        notFound();
    }
}