// src/app/sale/page.tsx
import { Metadata } from 'next';
import SalePageContent from './salePageContent';

export const metadata: Metadata = {
  title: 'Til Salg',
  description: 'Se hvad sitets avlere har at byde på af kaniner og kanin relaterede varere. Den blå Angora',
  keywords: 'angora uld, kaniner, uld, til salg, DenBlå-Angora, Den blå angora',
  openGraph: {
    title: 'Til Salg',
    description: 'Se hvad sitets avlere har at byde på af kaniner og kanin relaterede varere. Den blå Angora',
    images: '/images/DB-Angora.png',
    url: 'https://www.db-angora.dk/sale',
  },
};

export default function SalePage() {
  return <SalePageContent showSecondaryNav={false} />;
}