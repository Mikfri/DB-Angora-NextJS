// src/app/sale/rabbits/profile/[earCombId]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import RabbitForsaleProfile from './rabbitSaleProfile';
import { GetRabbitForsaleProfile } from '@/api/endpoints/rabbitController';

type PageProps = {
    params: Promise<{ earCombId: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Genererer metadata til siden baseret på kanin-data
 * Dette bruges til SEO og social media previews
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { earCombId } = await props.params;
    
    try {
        const rabbit = await GetRabbitForsaleProfile(earCombId);
        
        // Bestem det bedste billede at vise med prioriteret rækkefølge
        const profileImage = 
            (rabbit.saleDetailsProfile?.imageUrl) || 
            (rabbit.photos?.[0]?.filePath) || 
            null;
            
        // Base URL for billeder
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://db-angora.dk' 
            : 'http://localhost:3000';
            
        // Default billede hvis intet andet findes
        const defaultImage = `${baseUrl}/images/DB-Angora.png`;
        
        // Opret billede URL
        const imageUrl = profileImage 
            ? `${baseUrl}/${profileImage}` 
            : defaultImage;

        return {
            title: `${rabbit.race}, ${rabbit.gender} | Til Salg`,
            description: `${rabbit.race} kanin, af farven ${rabbit.color} til salg. Født: ${rabbit.dateOfBirth}`,
            openGraph: {
                title: `${rabbit.race} ${rabbit.color} - ${rabbit.nickName || 'Unavngivet'} | Til Salg`,
                description: `${rabbit.gender} ${rabbit.race} kanin til salg. Født: ${rabbit.dateOfBirth}`,
                images: [{
                    url: imageUrl,
                    width: 700,
                    height: 700,
                    alt: `${rabbit.nickName || 'Unavngivet'}`
                }],
                url: `${baseUrl}/sale/rabbits/profile/${earCombId}`
            },
            twitter: {
                card: 'summary_large_image',
                images: [{
                    url: imageUrl,
                    width: 700,
                    height: 700,
                    alt: `${rabbit.nickName || 'Unavngivet'}`
                }]
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Kanin ikke fundet',
            description: 'Den efterspurgte kanin kunne ikke findes'
        };
    }
}

/**
 * Side komponent der viser en enkelt kanin til salg
 */
export default async function Page(props: PageProps) {
    const { earCombId } = await props.params;
    
    try {
        const profile = await GetRabbitForsaleProfile(earCombId);
        
        // Hvis vi ikke fik nogen profil data, vis 404
        if (!profile) {
            return notFound();
        }
        
        return <RabbitForsaleProfile rabbitProfile={profile} />;
    } catch (error) {
        console.error('Error fetching rabbit profile:', error);
        return notFound();
    }
}