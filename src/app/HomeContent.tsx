// src/app/HomeContent.tsx (Client Component med interaktivitet)
'use client'
import PageNavigationCard from '@/components/cards/pageNavigationCard';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import MyNav from '@/components/nav/side/index/MyNav';
import { ROUTES } from '@/constants/navigation';

export default function HomeContent() {
  return (
    <SideNavLayout sideNav={<MyNav />}>
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <div className="flex flex-col gap-12">
          {/* Welcome Section - statisk SEO-venligt indhold */}
          <section id="welcome" className="flex flex-col justify-center items-center gap-6 text-zinc-100">
            <h1 className="site-title">
              Velkommen til DenBlå-Angora
            </h1>
            <p className="max-w-3xl text-center">
              Dette er en tidlig alpha version af et kanin-register, hvor det er muligt at oprette slette og redigere kaniner af forskellige racer. Vi udruller løbende opdateringer ud så hold øje med siden.
            </p>
          </section>

          {/* News Section - interaktive cards */}
          <section id="news" className="flex flex-col justify-center items-center gap-6 text-zinc-100">
            <h2 className="text-2xl font-bold text-primary">Nyheder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
              
              {/* Kaniner til salg card */}
              <PageNavigationCard
                href={ROUTES.SALE.RABBITS}
                imageSrc="/images/sideNavigationCard_SaleRabbits.jpg"
                title="Ny funktion: Kaniner til salg"
                description="Find kaniner til salg, ud fra vores smarte filtrerings muligheder..."
              />

              <PageNavigationCard
                href={ROUTES.SALE.WOOL}
                imageSrc="/images/sideNavigationCard_SaleWool.jpg"
                title="Kommende: Uld til salg"
                description="Snart kan du også købe og sælge angora uld direkte på platformen..."
                isDisabled={true}
                onDisabledClick={() => {
                  console.log('Uld-sektion er endnu ikke tilgængelig');
                }}
              />

              <PageNavigationCard
                href={ROUTES.BREEDERS}
                imageSrc="/images/sideNavigationCard_RabbitsForbreeding.jpg"
                title="Kommende: Opdrætter katalog"
                description="Udforsk vores katalog over registrerede opdrættere og deres specialer..."
                isDisabled={true}
                onDisabledClick={() => {
                  console.log('Opdrætter-sektion er endnu ikke tilgængelig');
                }}
              />

            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="flex flex-col justify-center items-center gap-6 text-zinc-100">
            <h2 className="text-2xl font-bold text-primary">Kommende funktioner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
              
              <PageNavigationCard
                href={ROUTES.CARE}
                imageSrc="/images/default-rabbit.jpg"
                title="Pleje & pasning guide"
                description="Få adgang til omfattende guides om kanin pleje, ernæring og sundhed..."
                isDisabled={true}
                onDisabledClick={() => {
                  console.log('Pleje-sektion er endnu ikke tilgængelig');
                }}
              />

              <PageNavigationCard
                href={ROUTES.ACCOUNT.RABBITS_FOR_BREEDING}
                imageSrc="/images/sideNavigationCard_RabbitsForbreeding.jpg"
                title="Avls-matching system"
                description="Find den perfekte parringspartner til dine kaniner baseret på genetik og egenskaber..."
                isDisabled={true}
                onDisabledClick={() => {
                  console.log('Avls-matching er endnu ikke tilgængelig');
                }}
              />

            </div>
          </section>
        </div>
      </div>
    </SideNavLayout>
  );
}