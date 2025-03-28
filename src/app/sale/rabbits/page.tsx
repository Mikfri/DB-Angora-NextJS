// src/app/sale/rabbits/page.tsx
import { Metadata } from 'next';
import RabbitsForSale from './rabbitSaleList';
import { getRabbitsForSale } from '@/app/actions/rabbit/forsale'; // Server Action

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

export default async function Page({ searchParams }: PageProps) {
  const sp = searchParams ? await searchParams : {};

  // Brug Server Action
  const result = await getRabbitsForSale(sp);
  const rabbits = result.success ? result.data : [];
  
  return (
    <RabbitsForSale
      rabbits={rabbits}
    />
  );
}