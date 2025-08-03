// src/app/annoncer/kaniner/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSaleDetailsBySlug } from '@/app/actions/sale/saleActions';
import RabbitSaleProfile from './rabbitSaleProfile';
import { ROUTES } from '@/constants/navigation';
import RabbitSaleProfileNav from '@/components/nav/side/index/RabbitSaleProfileNav';
import MyNav from '@/components/nav/side/index/MyNav';

// Opdateret type definition for Next.js 15
type PageProps = {
  params: Promise<{ slug: string }>; // ← Promise wrapper
}

/**
 * Genererer metadata for kanin salgsprofilen baseret på slug
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await params i Next.js 15
  const { slug } = await params;
  
  try {
    const result = await getSaleDetailsBySlug(slug);
    
    if (!result.success || !result.data) {
      return {
        title: 'Kanin ikke fundet | DenBlå-Angora',
        description: 'Kaninen kunne ikke findes'
      };
    }
    
    const profile = result.data;
    
    // Bestem det bedste billede at vise
    const profileImage = profile.imageUrl || null;
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://db-angora.dk' 
      : 'http://localhost:3000';
    const defaultImage = `${baseUrl}/images/DB-Angora.png`;
    const imageUrl = profileImage || defaultImage;

    // Opret SEO-venlig beskrivelse for kaniner
    const race = profile.entityProperties?.Race || 'Kanin';
    const color = profile.entityProperties?.Farve ? ` (${profile.entityProperties.Farve})` : '';
    const price = profile.price ? `${profile.price} kr` : '';
    const location = profile.city ? ` i ${profile.city}` : '';
    
    const description = `${race}${color} til salg for ${price}${location}. ${profile.description?.substring(0, 100) || 'Se flere detaljer på siden.'}`;

    // Brug ROUTES konstant for canonical URL
    const canonicalUrl = `${baseUrl}${ROUTES.SALE.RABBIT(slug)}`;

    return {
      title: `${profile.title || race} | DenBlå-Angora`,
      description,
      keywords: `${race}, angora kanin, kanin til salg, ${profile.entityProperties?.Farve || ''}, ${profile.city || ''}, dansk angora klub`,
      openGraph: {
        title: profile.title || `${race} til salg`,
        description,
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: profile.title || `${race} til salg`
        }],
        url: canonicalUrl,
        type: 'website',
        siteName: 'DenBlå-Angora'
      },
      twitter: {
        card: 'summary_large_image',
        title: profile.title || `${race} til salg`,
        description,
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: profile.title || `${race} til salg`
        }]
      },
      alternates: {
        canonical: canonicalUrl
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Kanin ikke fundet | DenBlå-Angora',
      description: 'Kaninen kunne ikke findes'
    };
  }
}

/**
 * Side komponent der viser en kanin salgsprofil med bredere sideNavs
 */
export default async function RabbitPage({ params }: PageProps) {
  // Await params i Next.js 15
  const { slug } = await params;
  
  try {
    const result = await getSaleDetailsBySlug(slug);
    
    if (!result.success || !result.data) {
      return notFound();
    }
    
    const profile = result.data;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 mb-6">
        {/* Venstre sidenav - 2/8 (25%) */}
        <aside className="lg:col-span-2">
          <div className="sticky top-24">
            <div className="bg-zinc-800/90 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 overflow-hidden shadow-lg">
              <div className="max-h-[calc(100vh-120px)] overflow-y-auto pt-0.5 pr-1.5 pb-2">
                <div className="pr-2 pl-0.5 py-1.5">
                  <MyNav />
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Hovedindhold - 4/8 (50%) */}
        <main className="lg:col-span-4">
          <RabbitSaleProfile profile={profile} />
        </main>
        
        {/* Højre sidenav - 2/8 (25%) */}
        <aside className="lg:col-span-2">
          <div className="sticky top-24">
            <div className="bg-zinc-800/90 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 overflow-hidden shadow-lg">
              <div className="max-h-[calc(100vh-120px)] overflow-y-auto pt-0.5 pr-1.5 pb-2">
                <div className="pr-2 pl-0.5 py-1.5">
                  <RabbitSaleProfileNav profile={profile} />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    );
  } catch (error) {
    console.error('Error fetching rabbit profile:', error);
    return notFound();
  }
}