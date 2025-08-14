// src/app/annoncer/page.tsx
import { Metadata } from 'next';
import SalePageContent from './salePageContent';

export const metadata: Metadata = {
  title: 'Salg',
  description: 'Se hvad sitets avlere har at byde på af kaniner og kanin relaterede varer',
  keywords: 'angora uld, kaninregister, kaniner, uld, til salg, Den Blå Angora',
  openGraph: {
    title: 'Salg | Den Blå Angora',
    description: 'Se hvad sitets avlere har at byde på af kaniner og kanin relaterede varer',
    images: '/images/DB-Angora.png',
    url: 'https://www.db-angora.dk/annoncer',
  },
};

export default function SalePage() {
  return <SalePageContent />;
}