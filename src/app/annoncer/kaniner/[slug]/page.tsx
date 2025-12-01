// src/app/annoncer/kaniner/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSaleDetailsBySlug } from '@/app/actions/sale/saleActions';
import RabbitSaleProfile from './rabbitSaleProfile';
import { ROUTES } from '@/constants/navigationConstants';

// Opdateret type definition for Next.js 15
type KaninerPageProps = {
  params: Promise<{ slug: string }>; // ← Promise wrapper
}

/**
 * Genererer metadata for kanin salgsprofilen baseret på slug
 */
export async function generateMetadata({ params }: KaninerPageProps): Promise<Metadata> {
  // Await params i Next.js 15
  const { slug } = await params;

  try {
    const result = await getSaleDetailsBySlug(slug);

    if (!result.success || !result.data) {
      return {
        title: 'Kanin ikke fundet',
        description: 'Kaninen kunne ikke findes'
      };
    }

    const profile = result.data;
    const imageUrl = profile.imageUrl || '/images/DB-Angora.png';

    // Opret SEO-venlig beskrivelse for kaniner
    const race = profile.entityProperties?.Race || 'Kanin';
    const color = profile.entityProperties?.Farve ? ` (${profile.entityProperties.Farve})` : '';
    const price = profile.price ? `${profile.price} kr` : '';
    const location = profile.city ? ` i ${profile.city}` : '';

    const description = `${race}${color} til salg for ${price}${location}. ${profile.description?.substring(0, 100) || 'Se flere detaljer på siden.'}`;

    // Brug ROUTES konstant for canonical URL
    const canonicalUrl = ROUTES.SALE.RABBIT(slug);

    return {
      title: `${profile.title || race}`,
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
        siteName: 'Den Blå Angora'
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
      title: 'Kanin ikke fundet',
      description: 'Kaninen kunne ikke findes'
    };
  }
}

/**
 * Side komponent der viser en kanin salgsprofil
 * layoutWrapper.tsx håndterer navs via RabbitSaleProfileProvider
 */
export default async function RabbitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getSaleDetailsBySlug(slug);
  if (!result.success || !result.data) return notFound();
  
  const profile = result.data;

  // Product schema for denne specifikke kanin
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": profile.title || 'Kanin til salg',
    "description": profile.description || `${profile.entityProperties?.Race || 'Kanin'} til salg`,
    "category": "Pet",
    "image": profile.imageUrl || '/images/DB-Angora.png',
    "offers": {
      "@type": "Offer",
      "price": profile.price || 0,
      "priceCurrency": "DKK",
      "availability": "https://schema.org/InStock",
      "url": `/annoncer/kaniner/${slug}`,
      "seller": { "@type": "Person", "name": profile.sellerName || "Privat sælger" }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <RabbitSaleProfile profile={profile} />
    </>
  );
}