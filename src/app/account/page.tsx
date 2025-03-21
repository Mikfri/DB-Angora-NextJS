// src/app/account/page.tsx
import PageNavigationCard from '@/components/cards/pageNavigationCard';


export default async function AccountPage() {
       
    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="flex flex-col justify-center items-center gap-6">
                <h1 className="site-title">
                    Min side
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full">
                    <PageNavigationCard
                        href="/account/myRabbits"
                        imageSrc="/images/sideNavigationCard_MyRabbits.jpg"
                        title="Mine kaniner"
                        description="Administrer dine kaniner. Opret nye, rediger eksisterende eller slet kaniner fra dit register"
                    />
                    <PageNavigationCard
                        href="/account/rabbitsForbreeding"
                        imageSrc="/images/sideNavigationCard_RabbitsForbreeding.jpg"
                        title="Find avlskaniner"
                        description="Find kaniner tilgængelig for avl blandt sitets andre avlere. Kontakt avleren og hør nærmere (Delvist klar, kan ikke tilgå profil)"
                    />
                    <PageNavigationCard
                        href="/account/profile"
                        imageSrc="/images/sideNavigationCard_UserProfile.jpg"
                        title="Min profil"
                        description="Se og rediger din profil information. Email, password og andre indstillinger (Delvist klar, ikke muligt at redigere)"
                    />
                    <PageNavigationCard
                        href="/account/transferRequests"
                        imageSrc="/images/sideNavigationCard_OwnershipExchanges.jpg"
                        title="Ejerskifts transaktioner"
                        description="Se indkommende og udgående ejeskabsoverdragelser af kaniner"
                    // Fjernet isDisabled og onDisabledClick for at gøre kortet aktivt
                    />
                </div>
            </div>
        </div>
    );
}