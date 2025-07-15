// src/app/sale/rabbits/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Spinner } from "@heroui/react";
import SaleList from './rabbitSaleList';
import { getRabbitSaleItems } from '@/app/actions/sale/saleActions';
import { Rabbit_ForSaleFilterDTO } from '@/api/types/filterTypes';

type PageProps = {
  params: object;
  searchParams?: {
    Race?: string;
    Color?: string;
    Gender?: string;
    MinZipCode?: string;
    MaxZipCode?: string;
    Page?: string;
    PageSize?: string;
  };
};

// Generér metadata baseret på searchParams
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  // Hent de faktiske values ud af søgeparametrene
  const sp = searchParams || {};
  
  // Brug const i stedet for direkte adgang til at undgå flere kald til sp
  const race = sp.Race;
  const color = sp.Color;
  const gender = sp.Gender;

  const filterDesc: string[] = [];
  if (race) filterDesc.push(`Race: ${race}`);
  if (color) filterDesc.push(`Farve: ${color}`);
  if (gender) filterDesc.push(`Køn: ${gender}`);

  const filterString = filterDesc.length > 0 ? ` - ${filterDesc.join(', ')}` : '';

  return {
    title: `Kaniner til salg${filterString}`,
    description: `Find kaniner til salg hos DenBlå-Angora. ${filterString}`,
  };
}

// Centreret loading indikator - vises mens data hentes
function CenteredLoading() {
  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 flex justify-center items-center min-h-[300px]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-zinc-300">Indlæser kaniner til salg...</p>
      </div>
    </div>
  );
}

// ItemLoader component to handle data fetching within Suspense
async function ItemLoader({ searchParams }: { searchParams: PageProps['searchParams'] }) {
  // Cache searchParams values to avoid repeated access
  const pageParam = searchParams?.Page;
  const pageSizeParam = searchParams?.PageSize;
  const raceParam = searchParams?.Race;
  const colorParam = searchParams?.Color;
  const genderParam = searchParams?.Gender;
  const minZipParam = searchParams?.MinZipCode;
  const maxZipParam = searchParams?.MaxZipCode;
  
  // Opret standard søge-/filtreringsparametre med Rabbit_ForSaleFilterDTO
  const filter: Rabbit_ForSaleFilterDTO = {
    page: pageParam ? parseInt(pageParam) : 1,
    pageSize: pageSizeParam ? parseInt(pageSizeParam) : 12
  };

  // Tilføj kendte filter-værdier direkte
  if (raceParam) filter.race = raceParam;
  if (colorParam) filter.color = colorParam;
  if (genderParam) filter.gender = genderParam;
  
  if (minZipParam) {
    const minZip = parseInt(minZipParam);
    if (!isNaN(minZip)) filter.minZipCode = minZip;
  }
  
  if (maxZipParam) {
    const maxZip = parseInt(maxZipParam);
    if (!isNaN(maxZip)) filter.maxZipCode = maxZip;
  }

  // Brug Server Action til at hente data
  const result = await getRabbitSaleItems(filter);

  if (!result.success) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center">
        <p className="text-red-500">Der opstod en fejl: {result.error}</p>
      </div>
    );
  }

  // Forbered data til SaleList komponenten
  return (
    <SaleList 
      items={result.data.data} 
      paging={{
        currentPage: result.data.page,
        pageSize: result.data.pageSize,
        totalCount: result.data.totalCount,
        totalPages: result.data.totalPages,
        hasNextPage: result.data.hasNextPage,
        hasPreviousPage: result.data.hasPreviousPage
      }} 
    />
  );
}

export default async function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<CenteredLoading />}>
      <ItemLoader searchParams={searchParams} />
    </Suspense>
  );
}