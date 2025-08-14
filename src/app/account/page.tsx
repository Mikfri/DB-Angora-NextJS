// src/app/account/page.tsx

import PageNavigationCard from '@/components/cards/pageNavigationCard';
import { ROUTES } from '@/constants/navigationConstants';
import { getUserIdentity } from '@/app/actions/auth/session';
import { isBreeder, isModerator, isPremiumUser } from '@/types/authTypes';

export default async function AccountPage() {
    const userIdentity = await getUserIdentity();

    // Always show profile card if logged in
    const showProfile = !!userIdentity;
    const showMyRabbits = !!userIdentity;
    const showBreeding = userIdentity && isBreeder(userIdentity);
    const showTransfers = userIdentity && (isBreeder(userIdentity) || isModerator(userIdentity) || isPremiumUser(userIdentity));
    const showMyBlogs = !!userIdentity;

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="flex flex-col justify-center items-center gap-6">
                <h1 className="site-title">
                    Min side
                </h1>
                {/* Grid med 3 kolonner på desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
                    {showProfile && (
                        <PageNavigationCard
                            href={ROUTES.ACCOUNT.PROFILE}
                            imageSrc="/images/sideNavigationCard_UserProfile.jpg"
                            title="Min profil"
                            description={<span className="text-xs">Se og rediger dine konto oplysninger eller avler konto information</span>}
                        />
                    )}
                    {showMyRabbits && (
                        <PageNavigationCard
                            href={ROUTES.ACCOUNT.MY_RABBITS}
                            imageSrc="/images/sideNavigationCard_MyRabbits.jpg"
                            title="Mine kaniner"
                            description={<span className="text-xs">Administrer dine kaniner. Opret nye, rediger eksisterende eller slet kaniner fra dit register</span>}
                        />
                    )}
                    {showBreeding && (
                        <PageNavigationCard
                            href={ROUTES.ACCOUNT.RABBITS_FOR_BREEDING}
                            imageSrc="/images/sideNavigationCard_RabbitsForbreeding.jpg"
                            title="Find avlskaniner"
                            description={<span className="text-xs">Find kaniner tilgængelig for avl blandt sitets andre avlere. Kontakt avleren og hør nærmere (Delvist klar, kan ikke tilgå profil)</span>}
                        />
                    )}                    
                    {showTransfers && (
                        <PageNavigationCard
                            href={ROUTES.ACCOUNT.TRANSFER_REQUESTS}
                            imageSrc="/images/sideNavigationCard_OwnershipExchanges.jpg"
                            title="Ejerskifts transaktioner"
                            description={<span className="text-xs">Se indkommende og udgående ejeskabsoverdragelser af kaniner</span>}
                        />
                    )}
                    {showMyBlogs && (
                        <PageNavigationCard
                            href={ROUTES.ACCOUNT.MY_BLOGS}
                            imageSrc="/images/sideNavigationCard_MyBlogs.jpeg"
                            title="Mine blogs"
                            description={<span className="text-md">Se og administrer dine blogindlæg og kladder</span>}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}