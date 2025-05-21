// src/app/sale/rabbits/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { getItemsForSale, ForSaleParams } from '@/app/actions/sale/forsale'; 
import { Spinner } from "@heroui/react";
import SaleList from './rabbitSaleList';

type PageProps = {
  params: Promise<object>;
  searchParams?: Promise<{
    EntityType?: string; // Ny parameter til at filtrere efter entityType
    Race?: string;
    Color?: string;
    Gender?: string;
    MinPrice?: string;
    MaxPrice?: string;
    MinZipCode?: string;
    MaxZipCode?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  // Hent de faktiske values ud af søgeparametrene: 
  const sp = searchParams ? await searchParams : {};

  const filterDesc: string[] = [];
  if (sp.EntityType) {
    // Konverter entity type til dansk
    const entityTypeDanish = sp.EntityType.toLowerCase() === 'rabbit' 
      ? 'Kaniner' 
      : sp.EntityType.toLowerCase() === 'wool'
      ? 'Uld'
      : sp.EntityType;
    
    filterDesc.push(`Type: ${entityTypeDanish}`);
  }
  if (sp.Race) filterDesc.push(`Race: ${sp.Race}`);
  if (sp.Color) filterDesc.push(`Farve: ${sp.Color}`);

  const filterString = filterDesc.length > 0 ? ` - ${filterDesc.join(', ')}` : '';

  return {
    title: `Til salg${filterString}`,
    description: `Find produkter til salg hos DenBlå-Angora. ${filterString}`,
  };
}

// Centreret loading indikator - vises mens data hentes
function CenteredLoading() {
  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 flex justify-center items-center min-h-[300px]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-zinc-300">Indlæser produkter til salg...</p>
      </div>
    </div>
  );
}

// Define type for search params used by ItemLoader
type ItemSearchParams = Record<string, string | undefined>;

// ItemLoader component to handle data fetching within Suspense
async function ItemLoader({ searchParams }: { searchParams: ItemSearchParams }) {
  // Brug Server Action til at hente data
  const result = await getItemsForSale(searchParams as unknown as ForSaleParams);
  const items = result.success ? result.data : [];
  
  return <SaleList items={items} />;
}

export default async function Page({ searchParams }: PageProps) {
  const sp = searchParams ? await searchParams : {};
  
  return (
    <Suspense fallback={<CenteredLoading />}>
      <ItemLoader searchParams={sp as unknown as ItemSearchParams} />
    </Suspense>
  );
}