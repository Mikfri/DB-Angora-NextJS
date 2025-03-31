// src/app/page.tsx
import MyNav from '@/components/nav/side/variants/MyNav2';
import PageNavigationCard from '@/components/cards/pageNavigationCard';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forside | DenBlå-Angora',
  description: "Det nemme kaninregister. Sælg garn, uld, skind og andet, relateret til din kanin produktion. Find andre avleres parringsparate kaniner. Registrer bl.a. klip, vægt og andre informationer på dine kaniner",
  keywords: 'kaninregister, kaninavl, dansk angora klub, kaniner til salg, angora kaniner, angora uld, angora garn, kaninskind, kaninproduktion, Denblå Angora, Den Blå Angora, DenBlå-Angora',
  openGraph: {
    title: 'Forside | DenBlå-Angora',
    description: "Det nemme kaninregister. Sælg garn, uld, skind og andet, relateret til din kanin produktion. Find andre avleres parringsparate kaniner. Registrer bl.a. klip, vægt og andre informationer på dine kaniner",
    images: [{
      url: '/images/DB-Angora.png',
      width: 700,
      height: 700,
      alt: 'DenBlå-Angora Logo'
    }]
  }
};


export default function Home() {
  return (
    <SideNavLayout sideNav={<MyNav />}>
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
          </section>

          {/* News Section */}
          <section id="news" className="flex flex-col justify-center items-center gap-6 text-zinc-100">
            <h2 className="text-2xl font-bold text-primary">Nyheder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full">
              <PageNavigationCard
                href="/sale/rabbits"
                imageSrc="/images/sideNavigationCard_SaleRabbits.jpg"
                title="Ny funktion: Kaniner til salg"
                description="Find kaniner til salg, ud fra vores smarte filtrerings muligheder..."
              />
            </div>
          </section>
        </div>
      </div>
    </SideNavLayout>
  );
}