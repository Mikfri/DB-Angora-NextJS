// src/app/page.tsx
import Head from 'next/head';
import MyNav from '@/components/sectionNav/variants/myNav';
import PageNavigationCard from '@/components/cards/pageNavigationCard';


export default function Home() {
  return (
    <>
      <MyNav />
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <div className="flex flex-col justify-center items-center gap-6 text-zinc-100">
          <Head>
            <title>DenBlå-Angora | Forside</title>
            <meta name="description" content="Velkommen til DenBlå-Angora. Find kaniner til salg og læs de seneste nyheder." />
            <meta name="keywords" content="kaninregister, kaniner, kaniner til salg, DenBlå-Angora" />
            <meta property="og:title" content="DenBlå-Angora | Forside" />
            <meta property="og:description" content="Velkommen til DenBlå-Angora. Find kaniner til salg og læs de seneste nyheder." />
            <meta property="og:image" content="/images/DB-Angora.png" />
            <meta property="og:url" content="https://www.db-angora.dk" />
            <link rel="canonical" href="https://www.db-angora.dk" />
          </Head>

          <h1 className="site-title">
            Velkommen til DenBlå-Angora
          </h1>
          <p>Dette er en tidlig alpha version af et kanin-register, hvor det er muligt at oprette slette og redigere kaniner af forskellige racer. Vi udruller løbende opdateringer ud så hold øje med siden.</p>
          {/* <Image
            src="/images/DB-Angora.png"
            alt="DenBlå-Angora Logo"
            width={125}
            height={125}
            className="rounded-sm"
          /> */}

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
    </>
  );
}

// export async function getStaticProps() {
//   // Placeholder data for now
//   const rabbits = [];
//   const news = [];

//   return {
//     props: {
//       rabbits,
//       news,
//     },
//   };
// }

