// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "./layoutWrapper";
import Providers from "@/components/providers/Providers";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: {
    default: "DenBlå-Angora",
    template: "%s | DenBlå-Angora"
  },
  description: "Det nemme kaninregister. Sælg garn, uld, skind og andet, relateret til din kanin produktion. Find andre avleres parringsparate kaniner. Registrer bl.a. klip, vægt og andre informationer på dine kaniner",
  metadataBase: new URL('https://db-angora.dk'),
  keywords: 'kaninregister, angorakaniner, dansk angora klub, kaniner til salg, angora uld, angora garn, kaninskind, kaninproduktion, kaninavl',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/DB-Angora.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/images/DB-Angora.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'da_DK',
    url: 'https://db-angora.dk',
    siteName: 'DenBlå-Angora',
    images: [{
      url: '/images/DB-Angora.png',
      width: 700,
      height: 700,
      alt: 'DenBlå-Angora Logo'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    images: [{
      url: '/images/DB-Angora.png',
      width: 700,
      height: 700,
      alt: 'DenBlå-Angora Logo'
    }]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da" className="h-full">
      <head>
        {/* Tilføj struktureret data for hele organisationen */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Den Blå Angora",
              "alternateName": ["DenBlå-Angora", "DB-Angora"],
              "description": "Et dansk kaninregister med fokus på avl og køb/salg af angorakaniner. Heraf uld, garn og skind.",
              "url": "https://db-angora.dk/",
              "logo": "https://db-angora.dk/images/DB-Angora.png",
              "image": "https://db-angora.dk/images/DB-Angora.png",
              "applicationCategory": "BusinessApplication", // eller evt "WebApplication" (generic), "LifeStyleApplication" (fritid/hobby). BusinessApplication (SaaS, CRM løsninger)
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "DKK",
                "availability": "https://schema.org/InStock"
              },
              "creator": {
                "@type": "Person",
                "name": "Mikkel Friborg",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Fynsvej 14",
                  "addressLocality": "Kirke Såby",
                  "postalCode": "4060",
                  "addressCountry": {
                    "@type": "Country",
                    "name": "DK"
                  }
                }
              },
              "audience": {
                "@type": "Audience",
                "name": "Strikke-entusiaster, kaninavlere og medlemmer af Dansk Angora Klub"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://db-angora.dk/annoncer/kaniner?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              // Tilføj evt. en dummy aggregateRating for at undgå advarsel
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "1"
              }
            })
          }}
        />

        {/* Organisation schema for Dansk Angora Klub partnership */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Dansk Angora Klub",
              "description": "Dansk forening for angorakanin avlere",
              "url": "https://db-angora.dk", // Da de bruger dit system
              "memberOf": {
                "@type": "SoftwareApplication",
                "name": "DenBlå-Angora"
              }
            })
          }}
        />

        {/* WebSite schema for bedre site-links */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "DenBlå-Angora",
              "url": "https://db-angora.dk",
              "description": "Det nemme kaninregister for avl og salg af håndlavede kanin relaterede produkter",
              "publisher": {
                "@type": "Person", // Ændret fra Organization til Person
                "name": "Mikkel Friborg"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://db-angora.dk/annoncer/kaniner?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-900">
        <Providers>
          <AuthGuard>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}