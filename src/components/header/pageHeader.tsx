// src/components/header/pageHeader.tsx
'use client'
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/': 'Forside',
  '/rabbits/for-sale': 'Kaniner til salg',
  '/rabbits/for-breeding': 'Avlskaniner',
  '/rabbits/own': 'Mine kaniner',
  '/rabbits/profile': 'Kanin profil',
  '/rabbits/create': 'Opret kanin'
};

export default function PageHeader() {
  const pathname = usePathname();
  const baseRoute = pathname.split('/').slice(0, 3).join('/');
  const title = pathname.startsWith('/rabbits/profile/') 
    ? 'Kanin profil'
    : pageTitles[pathname] || pageTitles[baseRoute] || 'DenBlå-Angora';

  return (
    <h1 className="text-2xl font-bold text-zinc-100">
      {title}
    </h1>
  );
}