// src/app/annoncer/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSaleDetailsBySlug } from '@/app/actions/sales/salesActions';
import SaleProfile from './SaleProfile';
import { ROUTES } from '@/constants/navigationConstants';

type SaleProfilePageProps = {
    params: Promise<{ slug: string }>;
}

const ENTITY_TYPE_LABELS: Record<string, string> = {
    'Rabbit':       'Kanin',
    'WoolCardedSD': 'Kardet uld',
    'WoolRawSD':    'Rå uld',
    'YarnSD':       'Garn',
    'PeltSD':       'Skind',
};

export async function generateMetadata({ params }: SaleProfilePageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const result = await getSaleDetailsBySlug(slug);

        if (!result.success || !result.data) {
            return { title: 'Annonce ikke fundet', description: 'Annoncen kunne ikke findes' };
        }

        const profile = result.data;
        const saleDetails = profile.saleDetails;
        const entityLabel = ENTITY_TYPE_LABELS[saleDetails?.entityType] ?? saleDetails?.entityType ?? 'Annonce';
        const imageUrl = profile.profilePhotoUrl || profile.photos?.[0]?.filePath || '/images/DB-Angora.png';

        const price = saleDetails?.price != null ? `${saleDetails.price} kr` : '';
        const location = profile.city ? ` i ${profile.city}` : '';
        const description = `${entityLabel} til salg for ${price}${location}. ${saleDetails?.description?.substring(0, 100) || 'Se flere detaljer på siden.'}`;
        const canonicalUrl = ROUTES.SALE.SALEPROFILE(slug);

        return {
            title: saleDetails?.title || `${entityLabel} til salg`,
            description,
            openGraph: {
                title: saleDetails?.title || `${entityLabel} til salg`,
                description,
                images: [{ url: imageUrl, width: 1200, height: 630, alt: saleDetails?.title || `${entityLabel} til salg` }],
                url: canonicalUrl,
                type: 'website',
                siteName: 'Den Blå Angora',
            },
            twitter: {
                card: 'summary_large_image',
                title: saleDetails?.title || `${entityLabel} til salg`,
                description,
                images: [{ url: imageUrl, width: 1200, height: 630, alt: saleDetails?.title || `${entityLabel} til salg` }],
            },
            alternates: { canonical: canonicalUrl },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return { title: 'Annonce ikke fundet', description: 'Annoncen kunne ikke findes' };
    }
}

export default async function SaleProfilePage({ params }: SaleProfilePageProps) {
    const { slug } = await params;
    const result = await getSaleDetailsBySlug(slug);
    if (!result.success || !result.data) return notFound();

    const profile = result.data;
    const saleDetails = profile.saleDetails;
    const entityLabel = ENTITY_TYPE_LABELS[saleDetails?.entityType] ?? saleDetails?.entityType ?? 'Annonce';
    const imageUrl = profile.profilePhotoUrl || profile.photos?.[0]?.filePath || '/images/DB-Angora.png';

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": saleDetails?.title || `${entityLabel} til salg`,
        "description": saleDetails?.description || `${entityLabel} til salg`,
        "image": imageUrl,
        "offers": {
            "@type": "Offer",
            "price": saleDetails?.price || 0,
            "priceCurrency": "DKK",
            "availability": "https://schema.org/InStock",
            "url": ROUTES.SALE.SALEPROFILE(slug),
            "seller": { "@type": "Person", "name": profile.sellerName || "Privat sælger" },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <SaleProfile profile={profile} />
        </>
    );
}
