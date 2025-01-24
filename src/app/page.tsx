// src/app/page.tsx
import MyNav from '@/components/sectionNav/variants/myNav';
import PageNavigationCard from '@/components/cards/pageNavigationCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DenBlå-Angora | Forside',
  description: "Det nemme kaninregister. Sælg dit garn, uld, skind eller kanin. Find andre avleres parringsparate kaniner over hele landet. Registrer, klip, vægt og andre informationer på dine kaniner",
  keywords: 'kaninregister, kaniner, kaniner til salg, DenBlå-Angora',
  openGraph: {
    title: 'DenBlå-Angora | Forside',
    description: "Det nemme kaninregister. Sælg dit garn, uld, skind eller kanin. Find andre avleres parringsparate kaniner over hele landet. Registrer, klip, vægt og andre informationer på dine kaniner",
    images: [{
      url: '/images/DB-Angora.png',
      width: 540,
      height: 680,
      alt: 'DenBlå-Angora Logo'
    }]
  }
};


export default function Home() {
  return (
    <>
      <MyNav />
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <div className="flex flex-col gap-12">
          {/* Welcome Section */}
          <section id="welcome" className="flex flex-col justify-center items-center gap-6 text-zinc-100">
            <h1 className="site-title">
              Velkommen til DenBlå-Angora
            </h1>
            <p className="max-w-3xl text-center">
              Dette er en tidlig alpha version af et kanin-register, hvor det er muligt at oprette slette og redigere kaniner af forskellige racer. Vi udruller løbende opdateringer ud så hold øje med siden.
            </p>
            {/* <Image
              src="/images/DB-Angora.png"
              alt="DenBlå-Angora Logo"
              width={125}
              height={125}
              className="rounded-sm"
            /> */}
          </section>

          {/* News Section */}
          <section id="news" className="flex flex-col justify-center items-center gap-6 text-zinc-100">
            <h2 className="text-2xl font-bold text-primary">Nyheder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full">
              <PageNavigationCard
                href="/sale/rabbits"
                imageSrc="/images/sideNavigationCard_SaleRabbits.jpg"
                title="Ny funktion: Kaniner til salg"
                description="Find kaniner til salg, ud fra vores smarte filtrerings muligheder. Filtrer bl.a. efter race, farve, alder, køn og postnummer"
              />
              {/* <PageNavigationCard
                href="/sale/wool"
                imageSrc="/images/sideNavigationCard_SaleWool.jpg"
                title="Kommende funktion: Uld til salg"
                description="Køb hjemmeproduceret uld. 1'ste, 2'den og 3'de sortering, kartet eller u-kartet, farvet eller ikke farvet. Rent eller som blandingsprodukt. Heraf 'Satin-angora'- eller 'Angora' uld, direkte fra sitets registrerede avlere. Gå på opdagelse iblandt avlernes sortementer, det bedste Danmark har at byde på! (Under udvikling)"
                isDisabled
              /> */}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}