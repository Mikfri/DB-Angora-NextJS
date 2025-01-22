// src/app/sale/rabbits/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import RabbitsForSale from './rabbitSaleList';

export const metadata: Metadata = {
  title: 'Kaniner til salg | DenBlå-Angora',
  description: 'Find kaniner til salg hos DenBlå-Angora. Se vores udvalg af kaniner til avl og kæledyr.',
  keywords: 'kaniner, til salg, avl, DenBlå-Angora, kaninregister',
  openGraph: {
    title: 'Kaniner til salg | DenBlå-Angora',
    description: 'Find kaniner til salg hos DenBlå-Angora. Se vores udvalg af kaniner til avl og kæledyr.',
    // images: '/images/kaniner-til-salg.jpg',
    url: 'https://www.db-angora.dk/sale/rabbits',
  },
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RabbitsForSale />
        </Suspense>
    );
}