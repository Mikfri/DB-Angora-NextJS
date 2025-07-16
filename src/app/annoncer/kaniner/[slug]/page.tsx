// src/app/sale/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSaleDetailsBySlug } from '@/app/actions/sale/saleActions';
import SaleProfile from './saleProfile';

type PageProps = {
  params: { slug: string };
}

/**
 * Genererer metadata for salgsprofilen baseret på slug
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await params før vi tilgår dets properties
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  
  try {
    const result = await getSaleDetailsBySlug(slug);
    
    if (!result.success || !result.data) {
      return {
        title: 'Ikke fundet',
        description: 'Salgsopslaget kunne ikke findes'
      };
    }
    
    const profile = result.data;
    
    // Bestem det bedste billede at vise med prioriteret rækkefølge
    const profileImage = profile.imageUrl || null;
            
    // Base URL for billeder
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://db-angora.dk' 
      : 'http://localhost:3000';
            
    // Default billede hvis intet andet findes
    const defaultImage = `${baseUrl}/images/DB-Angora.png`;
        
    // Opret billede URL
    const imageUrl = profileImage 
      ? profileImage  // Bemærk: imageUrl fra API er allerede en fuld URL
      : defaultImage;

    // Skab en beskrivelse baseret på entitetstype
    let description = '';
    
    if (profile.entityType) {
      switch (profile.entityType.toLowerCase()) {
        case 'rabbit':
          description = `${profile.entityProperties?.Race || 'Kanin'} til salg for ${profile.price} kr. ${profile.description?.substring(0, 100) || ''}`;
          break;
        case 'wool':
          description = `Angora uld til salg for ${profile.price} kr. ${profile.description?.substring(0, 100) || ''}`;
          break;
        default:
          description = `${profile.title || 'Vare'} til salg for ${profile.price} kr.`;
      }
    } else {
      description = `${profile.title || 'Vare'} til salg for ${profile.price} kr.`;
    }

    return {
      title: profile.title || 'Til Salg',
      description,
      openGraph: {
        title: profile.title || 'Til Salg',
        description,
        images: [{
          url: imageUrl,
          width: 700,
          height: 700,
          alt: profile.title || 'Salgsopslag'
        }],
        url: `${baseUrl}/sale/${slug}`
      },
      twitter: {
        card: 'summary_large_image',
        images: [{
          url: imageUrl,
          width: 700,
          height: 700,
          alt: profile.title || 'Salgsopslag'
        }]
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Ikke fundet',
      description: 'Salgsopslaget kunne ikke findes'
    };
  }
}

/**
 * Side komponent der viser en salgsprofil baseret på slug
 */
export default async function Page({ params }: PageProps) {
  // Await params før vi tilgår dets properties
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  
  try {
    const result = await getSaleDetailsBySlug(slug);
    
    if (!result.success || !result.data) {
      return notFound();
    }
    
    return <SaleProfile profile={result.data} />;
  } catch (error) {
    console.error('Error fetching sale profile:', error);
    return notFound();
  }
}