// src/components/nav/top/TopNavServer.tsx
import { TopNavClient } from "./TopNavClient";
import Image from 'next/image';
import Link from 'next/link';

// Hardcoded links med UNIKKE KEYS
const NAV_LINKS = [
  { href: '/sale', label: 'Til salg', enabled: true, key: 'sale' },
  { href: '#', label: 'Opdrætter & race katalog', enabled: false, key: 'breeders' },
  { href: '#', label: 'Pleje & pasning', enabled: false, key: 'care' }
];

export default function TopNav() {
  return (
    <div className="w-full">
      <div className="h-16 bg-zinc-900/70 backdrop-blur-md backdrop-saturate-150 border-b border-zinc-800">
        <div className="w-full h-full px-4 mx-auto flex items-center justify-between">
          {/* Branding - Rendered on server */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/DB-Angora.png"
                alt="DenBlå-Angora Logo"
                width={40}
                height={40}
                className="rounded-sm"
                priority
              />
              <p className="font-bold text-zinc-100">DenBlå-Angora</p>
            </Link>
            
            {/* Nav Links - Rendered on server */}
            <div className="hidden sm:flex ml-8 gap-6">
              {NAV_LINKS.map(link => (
                link.enabled ? (
                  <Link 
                    key={link.key} // BRUG UNIK KEY HER
                    href={link.href}
                    className="text-zinc-300 hover:text-zinc-100 nav-text"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span 
                    key={link.key} // BRUG UNIK KEY HER
                    className="cursor-not-allowed text-zinc-400/50 nav-text"
                    title="Under udvikling"
                  >
                    {link.label}
                  </span>
                )
              ))}
            </div>
          </div>
          
          {/* Auth section - Client side rendered for interactivity */}
          <TopNavClient />
        </div>
      </div>
    </div>
  );
}