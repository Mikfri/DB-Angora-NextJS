import { Metadata } from 'next';
import { Suspense } from 'react';
import RabbitsForSale from './rabbitSaleList';
import { getRabbitsForSale, ForSaleParams } from '@/app/actions/rabbit/forsale';
import { Spinner } from "@heroui/react";

type PageProps = {
  params: Promise<object>;
  searchParams?: Promise<{
    Race?: string;
    Color?: string;
    Gender?: string;
    RightEarId?: string;
    BornAfter?: string;
    MinZipCode?: string;
    MaxZipCode?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  // Hent de faktiske values ud af søgeparametrene: 
  const sp = searchParams ? await searchParams : {};

  const filterDesc: string[] = [];
  if (sp.Race) filterDesc.push(`Race: ${sp.Race}`);
  if (sp.Color) filterDesc.push(`Farve: ${sp.Color}`);
  if (sp.Gender) filterDesc.push(`Køn: ${sp.Gender}`);

  const filterString = filterDesc.length > 0 ? ` - ${filterDesc.join(', ')}` : '';

  return {
    title: `Kaniner til salg${filterString}`,
    description: `Find kaniner til salg hos DenBlå-Angora. ${filterString}`,
  };
}

// Separate LoadingFallback component
function LoadingFallback() {
  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-zinc-300">Indlæser kaniner til salg...</p>
      </div>
    </div>
  );
}

// Define type for search params used by RabbitLoader
type RabbitSearchParams = Record<string, string | undefined>;

// RabbitLoader component to handle data fetching within Suspense
async function RabbitLoader({ searchParams }: { searchParams: RabbitSearchParams }) {
  // Brug Server Action
  const result = await getRabbitsForSale(searchParams as unknown as ForSaleParams);
  const rabbits = result.success ? result.data : [];
  
  return <RabbitsForSale rabbits={rabbits} />;
}

export default async function Page({ searchParams }: PageProps) {
  const sp = searchParams ? await searchParams : {};
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RabbitLoader searchParams={sp as unknown as RabbitSearchParams} />
    </Suspense>
  );
}