// src/app/page.tsx (Server Component med metadata)
import { Metadata } from 'next';
import HomeContent from './HomeContent';

export const metadata: Metadata = {
  title: 'Forside | Den Blå Angora',
  description: "Det nemme kaninregister. Sælg garn, uld, skind og andet, relateret til din kanin produktion. Find andre avleres parringsparate kaniner. Registrer bl.a. klip, vægt og andre informationer på dine kaniner",
  keywords: 'kaninregister, kaninavl, dansk angora klub, kaniner til salg, angora kaniner, angora uld, angora garn, kaninskind, kaninproduktion, Denblå Angora, Den Blå Angora, DenBlå-Angora',
  openGraph: {
    title: 'Forside | Den Blå Angora',
    description: "Det nemme kaninregister. Sælg garn, uld, skind og andet, relateret til din kanin produktion. Find andre avleres parringsparate kaniner. Registrer bl.a. klip, vægt og andre informationer på dine kaniner",
    images: [{
      url: '/images/DB-Angora.png',
      width: 700,
      height: 700,
      alt: 'Den Blå Angora Logo'
    }]
  },
};

export default function Home() {
  return <HomeContent />;
}