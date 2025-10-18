// src/app/account/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import PageNavigationCard from '@/components/cards/pageNavigationCard';
import { ROUTES } from '@/constants/navigationConstants';
import { isBreeder, isContentCreator, isModerator, isPremiumUser } from '@/types/authTypes';
import { Spinner } from '@heroui/react';

export default function AccountPage() {
    const { userIdentity, isLoading, checkAuth } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        checkAuth();
    }, [checkAuth]);

    // Viser loading spinner indtil siden er mounted og auth er tjekket
    if (!mounted || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    // Always show profile card if logged in
    const showProfile = !!userIdentity;
    const showMyRabbits =
        userIdentity?.claims?.['Rabbit:Read'] === 'Own' ||
        userIdentity?.claims?.['Rabbit:Read'] === 'Any';
    const showBreeding = userIdentity && isBreeder(userIdentity);
    const showTransfers = userIdentity && (isBreeder(userIdentity) || isModerator(userIdentity) || isPremiumUser(userIdentity));
    const showMyBlogs = userIdentity && isContentCreator(userIdentity);
    
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
                            description={<span className="text-xs">Se avlsdyr udvalgt af andre avlere som egnede til avl. Kontakt avleren for yderligere information</span>}
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