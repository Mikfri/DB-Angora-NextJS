// src/app/page.tsx (Server Component med metadata)
import { Metadata } from 'next';
import HomeContent from './HomeContent';

export const metadata: Metadata = {
  title: 'Forside | DenBlå-Angora',
  description: "Det nemme kaninregister. Sælg garn, uld, skind og andet, relateret til din kanin produktion. Find andre avleres parringsparate kaniner. Registrer bl.a. klip, vægt og andre informationer på dine kaniner",
  keywords: 'kaninregister, kaninavl, dansk angora klub, kaniner til salg, angora kaniner, angora uld, angora garn, kaninskind, kaninproduktion, Denblå Angora, Den Blå Angora, DenBlå-Angora',
  openGraph: {
    title: 'Forside | DenBlå-Angora',
    description: "Det nemme kaninregister. Sælg garn, uld, skind og andet, relateret til din kanin produktion. Find andre avleres parringsparate kaniner. Registrer bl.a. klip, vægt og andre informationer på dine kaniner",
    images: [{
      url: '/images/DB-Angora.png',
      width: 700,
      height: 700,
      alt: 'DenBlå-Angora Logo'
    }]
  },
  // Tilføj structured data for bedre SEO
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'DenBlå-Angora',
      description: 'Det nemme kaninregister for angora kaniner',
      url: 'https://db-angora.dk',
      sameAs: [
        // Tilføj sociale medier links hvis relevant
      ]
    })
  }
};

export default function Home() {
  return <HomeContent />;
}