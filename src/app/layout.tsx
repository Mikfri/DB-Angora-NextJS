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
  title: "DenBlå-Angora",
  description: "Det nemme kaninregister. Find kaniner til salg eller avl",
  icons: {
    icon: [
      { url: '/images/DB-Angora.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/DB-Angora.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/images/DB-Angora.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/images/DB-Angora.png',
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