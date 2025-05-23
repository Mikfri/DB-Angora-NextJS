// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitProfile.tsx
"use client";
import { Rabbit_ProfileDTO, Rabbit_SaleDetailsDTO, SaleDetailsProfileDTO } from '@/api/types/AngoraDTOs';
import { useRabbitProfile as useProfileHook } from '@/hooks/rabbits/useRabbitProfile';
import { useRabbitProfile as useProfileContext } from '@/contexts/RabbitProfileContext';
import RabbitDetails from './rabbitDetails';
import RabbitChildren from './rabbitChildren';
import RabbitSaleSection from './rabbitSaleSection';
import RabbitPedigree from './rabbitPedigree';
import { Tabs, Tab } from "@heroui/react";
import { useNav } from "@/components/providers/Providers";
import { useCallback, useEffect, useMemo } from 'react';
import MyNav from "@/components/nav/side/index/MyNav";
import DeleteRabbitModal from '@/components/modals/rabbit/deleteRabbitModal';
import TransferOwnershipModal from '@/components/modals/rabbit/transferRabbitModal';

// Import ikoner for hver tab
import { RiInformationLine } from "react-icons/ri";  // Info/detaljer ikon
import { PiArrowsSplitLight } from "react-icons/pi"; // Afkom ikon
import { RiPriceTag3Line, RiPriceTag3Fill } from "react-icons/ri";  // Tilføj fyldt prisikon
import { FaTreeCity } from "react-icons/fa6"; // eller et andet passende ikon for stamtavle

export default function RabbitProfile({ rabbitProfile: initialRabbitProfile }: { rabbitProfile: Rabbit_ProfileDTO }) {
    // Hent hooks-funktioner fra useNav
    const { setSecondaryNav } = useNav();

    // Hent refreshProfile fra context
    const { refreshProfile } = useProfileContext();

    // Hent hooks-funktioner fra custom hook
    const {
        currentProfile,
        setCurrentProfile,
        isEditing,
        isSaving,
        isDeleting,
        isTransferring,
        showTransferModal,
        isDeleteModalOpen,
        editedData,
        setEditedData,
        setIsEditing,
        handleSave,
        handleCancelEdit,
        handleDeleteConfirm,
        handleDeleteCancel,
        handleCloseTransferModal,
        handleTransferSubmit
    } = useProfileHook(initialRabbitProfile);

    // Wrapper handleSave med refreshProfile
    const handleSaveWithRefresh = useCallback(async () => {
        await handleSave();
        // Opdater context efter gemning for at sikre sidenavigationen opdateres
        await refreshProfile();
    }, [handleSave, refreshProfile]);

    // Handler til salgsdetaljer - opdateret til at bruge saleDetailsProfile
    const handleSaleDetailsChange = useCallback((saleDetails: Rabbit_SaleDetailsDTO | null, fullSaleDetailsProfile?: SaleDetailsProfileDTO | null) => {
        setCurrentProfile(prevProfile => {
            // Hvis vi har et fuldt saleDetailsProfile objekt, brug det direkte
            if (fullSaleDetailsProfile) {
                return {
                    ...prevProfile,
                    saleDetailsProfile: fullSaleDetailsProfile
                } as Rabbit_ProfileDTO;
            }

            // Ellers, hvis vi kun har salgsdetaljer for kaninen
            else if (saleDetails) {
                // Type assertion for at sikre alle påkrævede felter eksisterer
                const updatedSaleDetailsProfile: SaleDetailsProfileDTO = {
                    id: prevProfile.saleDetailsProfile?.id || 0,
                    dateListed: prevProfile.saleDetailsProfile?.dateListed || new Date().toISOString().split('T')[0],
                    city: prevProfile.saleDetailsProfile?.city || '',
                    zipCode: prevProfile.saleDetailsProfile?.zipCode || 0,
                    viewCount: prevProfile.saleDetailsProfile?.viewCount || 0,
                    imageUrl: prevProfile.saleDetailsProfile?.imageUrl || '',
                    price: prevProfile.saleDetailsProfile?.price || 0,
                    title: prevProfile.saleDetailsProfile?.title || `Kanin: ${prevProfile.nickName || prevProfile.earCombId}`,
                    saleDescription: prevProfile.saleDetailsProfile?.saleDescription || '',
                    rabbitSaleDetails: saleDetails,
                    woolSaleDetails: null
                };

                return {
                    ...prevProfile,
                    saleDetailsProfile: updatedSaleDetailsProfile
                } as Rabbit_ProfileDTO;
            } else {
                // Hvis vi fjerner salgsdetaljer, sæt saleDetailsProfile til null
                return {
                    ...prevProfile,
                    saleDetailsProfile: null
                } as Rabbit_ProfileDTO;
            }
        });
    }, [setCurrentProfile]);

    // Sekundær navigation
    const secondaryNavComponent = useMemo(() => (
        <MyNav key="secondary-nav" />
    ), []);

    useEffect(() => {
        setSecondaryNav(secondaryNavComponent);
        return () => {
            setSecondaryNav(null);
        };
    }, [setSecondaryNav, secondaryNavComponent]);

    const displayName = currentProfile.nickName || currentProfile.earCombId;

    // Tæl eventuelt antal børn for at vise i børn tab
    const childrenCount = currentProfile.children?.length || 0;

    // Definer UI styling (brug prædefinerede Tailwind klasser)
    const countBgColor = "bg-blue-500/20";
    const countTextColor = "text-blue-400";

    return (
        <>
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 shadow-lg">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-zinc-100">
                        {displayName}
                    </h1>
                </div>

                <Tabs
                    aria-label="Kanin information"
                    variant="underlined"
                    color="primary"
                    classNames={{
                        tabList: "gap-6 w-full relative p-0 border-b border-zinc-700/50",
                        cursor: "w-full bg-blue-500", // Fast Tailwind-klasse
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:text-blue-500", // Fast Tailwind-klasse
                        panel: "pt-5"
                    }}
                >
                    <Tab
                        key="details"
                        title={
                            <div className="flex items-center space-x-2">
                                <RiInformationLine className="text-xl" />
                                <span>Detaljer</span>
                            </div>
                        }
                    >
                        <RabbitDetails
                            rabbitProfile={currentProfile}
                            isEditing={isEditing}
                            isSaving={isSaving}
                            setIsEditing={setIsEditing}
                            handleSave={handleSaveWithRefresh} // Brug vores wrappede version
                            handleCancel={handleCancelEdit}
                            editedData={editedData}
                            setEditedData={setEditedData}
                        />
                    </Tab>

                    <Tab
                        key="children"
                        title={
                            <div className="flex items-center space-x-2">
                                <PiArrowsSplitLight className="text-xl" />
                                <span>Afkom</span>
                                {childrenCount > 0 && (
                                    <span className={`ml-1 px-2 py-0.5 ${countBgColor} ${countTextColor} text-xs font-medium rounded-full`}>
                                        {childrenCount}
                                    </span>
                                )}
                            </div>
                        }
                    >
                        <RabbitChildren>
                            {currentProfile.children || []}
                        </RabbitChildren>
                    </Tab>

                    <Tab
                        key="pedigree"
                        title={
                            <div className="flex items-center space-x-2">
                                <FaTreeCity className="text-xl" />
                                <span>Stamtavle</span>
                            </div>
                        }
                    >
                        <RabbitPedigree earCombId={currentProfile.earCombId} />
                    </Tab>

                    <Tab
                        key="sale"
                        title={
                            <div className="flex items-center space-x-2">
                                {currentProfile.saleDetailsProfile ? (
                                    <RiPriceTag3Fill className="text-xl text-blue-400" />
                                ) : (
                                    <RiPriceTag3Line className="text-xl" />
                                )}
                                <span>Salgsprofil</span>
                            </div>
                        }
                    >
                        <RabbitSaleSection
                            rabbitProfile={currentProfile}
                            onSaleDetailsChange={handleSaleDetailsChange}
                        />
                    </Tab>
                </Tabs>
            </div>

            <DeleteRabbitModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                rabbitName={displayName}
                isDeleting={isDeleting}
            />

            <TransferOwnershipModal
                isOpen={showTransferModal}
                onClose={handleCloseTransferModal}
                rabbitName={displayName}
                rabbitEarCombId={currentProfile.earCombId}
                onSubmit={handleTransferSubmit}
                isSubmitting={isTransferring}
            />
        </>
    );
}