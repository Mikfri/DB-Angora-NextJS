// src/app/sale/page.tsx
import Head from 'next/head';
import PageNavigationCard from '@/components/cards/pageNavigationCard';
import MyNav from '@/components/sectionNav/variants/myNav';

export default function SalePage() {
  return (
    <div className="flex">
      <MyNav />
      <div className="flex-1">
        <Head>
          <title>Til Salg | DenBlå-Angora</title>
          <meta name="description" content="Se hvad vi har til salg hos DenBlå-Angora. Kaniner, uld og mere." />
          <meta name="keywords" content="kaniner, uld, til salg, DenBlå-Angora" />
          <meta property="og:title" content="Til Salg | DenBlå-Angora" />
          <meta property="og:description" content="Se hvad vi har til salg hos DenBlå-Angora. Kaniner, uld og mere." />
          <meta property="og:image" content="/images/DB-Angora.png" />
          <meta property="og:url" content="https://www.db-angora.dk/sale" />
          <link rel="canonical" href="https://www.db-angora.dk/sale" />
        </Head>
        <div className="p-4 flex flex-col justify-center items-center mt-20 gap-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-950 to-sky-800 bg-clip-text text-transparent">
            Til salg
          </h1>
          <p className="text-zinc-100">Se hvad vi har til salg hos DenBlå-Angora. Kaniner, uld og mere.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full p-4">
            <PageNavigationCard
              href="/sale/rabbits"
              imageSrc="/images/sideNavigationCard_SaleRabbits.jpg"
              title="Kaniner"
              description="Find kaniner til salg, ud fra vores smarte filtrerings muligheder. Filtrer bl.a. efter race, farve, alder, køn og postnummer"
            />
            <PageNavigationCard
              href="/sale/wool"
              imageSrc="/images/sideNavigationCard_SaleWool.jpg"
              title="Uld"
              description="Køb hjemmeproduceret uld. 1'ste, 2'den og 3'de sortering, kartet eller u-kartet, farvet eller ikke farvet. Rent eller som blandingsprodukt. Heraf 'Satin-angora'- eller 'Angora' uld, direkte fra sitets registrerede avlere. Gå på opdagelse iblandt avlernes sortementer, det bedste Danmark har at byde på! (Under udvikling)"
              isDisabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}