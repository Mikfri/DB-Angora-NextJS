import { Metadata } from 'next';
import React from "react";

export const metadata: Metadata = {
  title: 'Om Den Blå Angora | Dansk Kaninregister',
  description: 'Læs om DenBlå-Angora – et dansk kaninregister med fokus på avl, køb og salg af angorakaniner, uld, garn og skind. Bag projektet står passionerede kaninavlere og udviklere.',
  keywords: 'om denblå-angora, kaninregister, angorakaniner, dansk angora klub, kaninavl, uld, garn, skind',
  openGraph: {
    title: 'Om: Den Blå Angora',
    description: 'Læs: om Den Blå Angora – et dansk kaninregister med fokus på avl, køb og salg af angorakaniner, uld, garn og skind.',
    url: 'https://db-angora.dk/about',
    images: [{
      url: '/images/DB-Angora.png',
      width: 700,
      height: 700,
      alt: 'DenBlå-Angora Logo'
    }]
  }
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="text-3xl font-bold mb-4">Om: Den Blå Angora</h1>
      <p className="mb-2">
        Den Blå Angora er et dansk kaninregister, som er under udvikling - pt i en ALFA version. Sitet er udvikles i samarbejde med Dansk Angora Klubs dedikerede kaninavlere. 
        Platformen gør det nemt at registrere, avle og handle med angorakaniner samt dele viden.
      </p>
      <p className="mb-2">
        Siden er også for folk som har interesse i at købe håndlavede kaninrelaterede produkter, såsom uld, garn og skind.
      </p>
      <p className="mb-2">
        Systemet er bygget med moderne webteknologi: C# backend library med tilhørende API, hvor frontenden er lavet i NextJS. 
        Vi prioriterer brugervenlighed, sikkerhed og et stærkt fællesskab for alle medlemmer.
      </p>
      <p className="mb-2">
        Har du spørgsmål eller ønsker du at bidrage, er du altid velkommen til at kontakte os på <a href="mailto:kontakt@db-angora.dk" className="underline">kontakt@db-angora.dk</a>.
      </p>
    </main>
  );
}