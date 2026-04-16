// src/app/annoncer/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Spinner } from '@heroui/react';
import SalePageContent from './salePageContent';

type SearchParamsType = {
  EntityType?: string;
  MinPrice?: string;
  MaxPrice?: string;
  CanBeShipped?: string;
  City?: string;
  MinZipCode?: string;
  MaxZipCode?: string;
  SortBy?: string;
  Page?: string;
  PageSize?: string;
};

type SalePageProps = {
  params: Promise<object>;
  searchParams?: Promise<SearchParamsType>;
};

export const metadata: Metadata = {
  title: 'Til salg',
  description: 'Se hvad sitets avlere har til salg - kaniner, uld, garn og mere fra Den Blå Angora',
  keywords: 'angora uld, kaninregister, kaniner, uld, til salg, Den Blå Angora',
  openGraph: {
    title: 'Til salg | Den Blå Angora',
    description: 'Se hvad sitets avlere har til salg - kaniner, uld, garn og mere',
    images: '/images/DB-Angora.png',
    url: 'https://www.db-angora.dk/annoncer',
  },
};

function CenteredLoading() {
  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 flex justify-center items-center min-h-[300px]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="accent" />
        <p className="text-zinc-300">Indlæser annoncer...</p>
      </div>
    </div>
  );
}

export default function SalePage({ searchParams }: SalePageProps) {
  return (
    <Suspense fallback={<CenteredLoading />}>
      <SalePageContent searchParams={searchParams} />
    </Suspense>
  );
}

