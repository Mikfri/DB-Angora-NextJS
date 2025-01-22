// src/components/header/pageHeader.tsx
'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const pageTitles: Record<string, string> = {
  '/': 'Forside',
  '/account': 'Min side',
  '/account/profile': 'Min profil',
  '/account/rabbitsForbreeding': 'Find avlskaniner',
  '/account/myRabbits': 'Mine kaniner',
  '/account/myRabbits/create': 'Opret kanin',
  '/account/myRabbits/rabbitProfile': 'Kanin profil',

  '/sale': 'Salg',
  '/sale/rabbits': 'Kaniner til salg',
  '/sale/rabbits/profile': 'Kanin profil',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean); // URL splittes i segmenter uden empty strings
  
  //Håndter root path
  const initialSegments = [{ 
    path: '/', 
    label: 'Forside',
    isProfilePage: false 
  }];

// reduce har 3 parametre: acc/accumulator, segment/current value, index/current index
const filteredSegments = pathSegments.reduce((acc, segment, index) => {
  // Hvis segment matcher et rabbit ID format (f.eks. 4977-213), ignoreres det og acc returneres uændret
  if (segment.match(/^([A-Z]?\d{2,4}-\d{3,6}|\d+)$/)) {
    return acc;
  }
  // Bygger stien op til og med det nuværende segment
  const path = '/' + pathSegments.slice(0, index + 1).join('/');
  // Finder label for stien fra pageTitles eller bruger segmentet som label
  const label = pageTitles[path] || segment;
  // Tjekker om segmentet er 'rabbitProfile' for at markere det som en profilside
  const isProfilePage = segment === 'rabbitProfile';
  // Tilføjer det nuværende segment til acc og returnerer det opdaterede acc
  return [...acc, { path, label, isProfilePage }];
}, initialSegments as Array<{ path: string; label: string; isProfilePage: boolean }>);
// Initialiserer acc som en tom array af objekter med path, label og isProfilePage

  return (
    <nav className="text-sm">
      {filteredSegments.map((breadcrumb, index) => (
        <span key={breadcrumb.path}>
          {breadcrumb.isProfilePage ? (
            <span className="text-zinc-300">{breadcrumb.label}</span>
          ) : (
            <Link href={breadcrumb.path} 
              className="text-zinc-300 hover:text-zinc-100 hover:underline">
              {breadcrumb.label}
            </Link>
          )}
          {index < filteredSegments.length - 1 && (
            <span className="mx-2 text-zinc-500">»</span>
          )}
        </span>
      ))}
    </nav>
  );
}