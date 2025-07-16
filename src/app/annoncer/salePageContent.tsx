// src/app/annoncer/salePageContent.tsx
'use client'
import { useNav } from "@/components/providers/Providers";
import { useEffect, useMemo } from "react";
import PageNavigationCard from '@/components/cards/pageNavigationCard';
import MyNav from '@/components/nav/side/index/MyNav';
import { ROUTES } from '@/constants/navigation';

interface Props {
    showSecondaryNav?: boolean;
}

export default function SalePageContent({ showSecondaryNav = false }: Props) {
    const { setPrimaryNav, setSecondaryNav } = useNav();

    // Memoize nav components
    const primaryNav = useMemo(() => (
        <MyNav />
    ), []);

    // Set up navigation
    useEffect(() => {
        setPrimaryNav(primaryNav);
        if (showSecondaryNav) {
            setSecondaryNav(primaryNav);
        }
        return () => {
            setPrimaryNav(null);
            setSecondaryNav(null);
        };
    }, [primaryNav, setPrimaryNav, setSecondaryNav, showSecondaryNav]);

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="flex flex-col justify-center items-center gap-6">
                <h1 className="site-title">
                    Til salg
                </h1>
                <p className="text-zinc-100">Se hvad vi har til salg hos DenBlå-Angora. Kaniner, uld og mere.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full p-4">
                    <PageNavigationCard
                        href={ROUTES.SALE.RABBITS}
                        imageSrc="/images/sideNavigationCard_SaleRabbits.jpg"
                        title="Kaniner"
                        description="Find kaniner til salg, ud fra vores smarte filtrerings muligheder. Filtrer bl.a. efter race, farve, alder, køn og postnummer"
                    />
                    <PageNavigationCard
                        href={ROUTES.SALE.WOOL}
                        imageSrc="/images/sideNavigationCard_SaleWool.jpg"
                        title="Uld"
                        description="Køb hjemmeproduceret uld. 1'ste, 2'den og 3'de sortering, kartet eller u-kartet, farvet eller ikke farvet. Rent eller som blandingsprodukt. Heraf 'Satin-angora'- eller 'Angora' uld, direkte fra sitets registrerede avlere. Gå på opdagelse iblandt avlernes sortementer, det bedste Danmark har at byde på! (Under udvikling)"
                        isDisabled={true}
                        disabledMessage="Uld-sektion kommer snart! Vi arbejder på at gøre den klar."
                    />
                </div>
            </div>
        </div>
    );
}