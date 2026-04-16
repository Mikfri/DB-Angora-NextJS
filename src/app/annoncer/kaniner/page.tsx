// src/app/annoncer/kaniner/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Spinner } from "@/components/ui/heroui";
import SaleList from './rabbitSaleList';
import { getRabbitSaleItems } from '@/app/actions/sales/salesActions';
import { RabbitSaleFilterDTO } from '@/api/types/RabbitSaleDTOs';
import BannerCard from '@/components/cards/bannerCard';
import SaleCategoryCards from '@/components/cards/saleCategoryCards';

type SearchParamsType = {
  Race?: string;
  Color?: string;
  Gender?: string;
  City?: string;
  MinZipCode?: string;
  MaxZipCode?: string;
  MinPrice?: string;
  MaxPrice?: string;
  CanBeShipped?: string;
  SortBy?: string;
  Page?: string;
  PageSize?: string;
};

type KaninerPageProps = {
  params: Promise<object>;
  searchParams?: Promise<SearchParamsType>;
};

// Generér metadata baseret på searchParams
export async function generateMetadata({ searchParams }: KaninerPageProps): Promise<Metadata> {
  // Await searchParams og type-cast korrekt
  const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;
  
  // Destrukturer parametre fra den awaitede værdi
  const { Race, Color, Gender } = params;
  
  const filterDesc: string[] = [];
  if (Race) filterDesc.push(`Race: ${Race}`);
  if (Color) filterDesc.push(`Farve: ${Color}`);
  if (Gender) filterDesc.push(`Køn: ${Gender}`);

  const filterString = filterDesc.length > 0 ? ` - ${filterDesc.join(', ')}` : '';

  return {
    title: `Salg-kaniner ${filterString}`,
    description: `Find kaniner til salg på Den Blå Angora: ${filterString}`,
  };
}

// Centreret loading indikator - vises mens data hentes
function CenteredLoading() {
  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 flex justify-center items-center min-h-75">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="accent" />
        <p className="text-zinc-300">Indlæser kaniner til salg...</p>
      </div>
    </div>
  );
}

// ItemLoader component to handle data fetching within Suspense
async function ItemLoader({ searchParams }: { searchParams: KaninerPageProps['searchParams'] }) {
  // Await searchParams og type-cast korrekt
  const params = (await (searchParams || Promise.resolve({}))) as SearchParamsType;
  
  // Destrukturer parametre fra den awaitede værdi
  const { 
    Page: pageParam, 
    PageSize: pageSizeParam,
    Race: raceParam,
    Color: colorParam,
    Gender: genderParam,
    MinZipCode: minZipParam,
    MaxZipCode: maxZipParam,
    MinPrice: minPriceParam,
    MaxPrice: maxPriceParam,
    CanBeShipped: canBeShippedParam,
    SortBy: sortByParam,
    City: cityParam,
  } = params;
  
  const page = pageParam ? parseInt(pageParam) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam) : 12;
  const filter: RabbitSaleFilterDTO = {};

  if (raceParam) filter.race = raceParam;
  if (colorParam) filter.color = colorParam;
  if (genderParam) filter.gender = genderParam;
  if (sortByParam) filter.sortBy = sortByParam;
  if (cityParam) filter.city = cityParam;
  if (canBeShippedParam === 'true') filter.canBeShipped = true;

  if (minZipParam) {
    const val = parseInt(minZipParam);
    if (!isNaN(val)) filter.minZipCode = val;
  }
  if (maxZipParam) {
    const val = parseInt(maxZipParam);
    if (!isNaN(val)) filter.maxZipCode = val;
  }
  if (minPriceParam) {
    const val = parseFloat(minPriceParam);
    if (!isNaN(val)) filter.minPrice = val;
  }
  if (maxPriceParam) {
    const val = parseFloat(maxPriceParam);
    if (!isNaN(val)) filter.maxPrice = val;
  }

  // Brug Server Action til at hente data
  const result = await getRabbitSaleItems(filter, page, pageSize);

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

export default async function Page({ searchParams }: KaninerPageProps) {
  return (
    <div className="space-y-6">
      <BannerCard
        title="Kaniner til salg"
        description="Udforsk angora-kaniner fra passionerede avlere i hele Danmark. Find din næste avler- eller kæledyrskanin direkte fra kilden."
        imageSrc="/images/sideNavigationCard_SaleRabbits.jpg"
        imageAlt="Kaniner til salg fra DB-Angora"
      />

      <SaleCategoryCards />

      <Suspense fallback={<CenteredLoading />}>
        <ItemLoader searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
