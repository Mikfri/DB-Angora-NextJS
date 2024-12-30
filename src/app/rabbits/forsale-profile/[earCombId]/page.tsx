// src/app/rabbits/forsale-profile/[earCombId]/page.tsx
import { Metadata } from 'next'
import RabbitForsaleProfile from './rabbitForsaleProfile'
import { notFound } from 'next/navigation'
import { GetRabbitForsaleProfile } from '@/Services/AngoraDbService'

type Props = {
    params: Promise<{ earCombId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { earCombId } = await params
    try {
        const rabbit = await GetRabbitForsaleProfile(earCombId)
        return {
            title: `${rabbit.race} ${rabbit.color} - ${rabbit.nickName || 'Unavngivet'} | Til Salg`,
            description: `${rabbit.gender} ${rabbit.race} kanin til salg. Født: ${rabbit.dateOfBirth}`,
            openGraph: {
                images: rabbit.profilePicture ? [rabbit.profilePicture] : []
            }
        }
    } catch {
        return {
            title: 'Kanin ikke fundet',
            description: 'Den efterspurgte kanin kunne ikke findes'
        }
    }
}

export default async function Page({ params }: Props) {
    const { earCombId } = await params
    const profile = await GetRabbitForsaleProfile(earCombId).catch(() => notFound())
    return <RabbitForsaleProfile rabbitProfile={profile} />
}