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
  description: "Det nemme kaninregister. Sælg garn, uld, skind og andet, relateret til din kanin produktion. Find andre avleres parringsparate kaniner. Registrer bl.a. klip, vægt og andre informationer på dine kaniner",
  metadataBase: new URL('https://db-angora.vercel.app'),
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
    url: 'https://db-angora.vercel.app',
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