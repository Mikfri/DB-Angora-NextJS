// src/app/layout.tsx (server component)
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "./layoutWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "DenBlå-Angora",
    template: "%s | DenBlå-Angora"
  },
  description: "Det nemme kaninregister. Sælg dit garn, uld, skind eller kanin og find parringsparate kaniner over hele landet. Registrer klip, vægt og andre informationer på dine kaniner",
  metadataBase: new URL('https://www.db-angora.dk'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/DB-Angora.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/DB-Angora.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/images/DB-Angora.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/images/DB-Angora.png',
  },
  openGraph: {
    type: 'website',
    locale: 'da_DK',
    url: 'https://www.db-angora.dk',
    siteName: 'DenBlå-Angora',
    images: [{
      url: '/images/DB-Angora.png',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/DB-Angora.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}