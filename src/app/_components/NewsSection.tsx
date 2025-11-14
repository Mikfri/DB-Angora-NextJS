import PageNavigationCard from '@/components/cards/pageNavigationCard';
import { ROUTES } from '@/constants/navigationConstants';

export default function NewsSection() {
  return (
    <section id="news" className="flex flex-col justify-center items-center gap-6 text-zinc-100">
      <h2 className="text-2xl font-bold text-primary">Nyheder</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        <PageNavigationCard
          href={ROUTES.SALE.RABBITS}
          imageSrc="/images/sideNavigationCard_SaleRabbits.jpg"
          title="Ny funktion: Kaniner til salg"
          description="Find kaniner til salg..."
        />
        {/* ...existing cards... */}
      </div>
    </section>
  );
}