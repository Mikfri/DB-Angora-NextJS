import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "./layoutWrapper";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "DenBlå-Angora",
    template: "%s | DenBlå-Angora"
  },
  description: "Det nemme kaninregister. Sælg garn, uld, skind og andet, relateret til din kanin produktion. Find andre avleres parringsparate kaniner. Registrer bl.a. klip, vægt og andre informationer på dine kaniner",
  metadataBase: new URL('https://db-angora.dk'),
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
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}