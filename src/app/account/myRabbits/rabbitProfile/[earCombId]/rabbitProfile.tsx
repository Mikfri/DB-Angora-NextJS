// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitProfile.tsx
"use client";
import { Rabbit_ProfileDTO, Rabbit_SaleDetailsDTO } from '@/api/types/AngoraDTOs';
import { useRabbitProfile } from '@/hooks/rabbits/useRabbitProfile';
// Fjern import af RabbitProfileNav, da vi ikke længere bruger det her
// import RabbitProfileNav from '@/components/nav/side/index/RabbitProfileNav';
import RabbitDetails from './rabbitDetails';
import RabbitChildren from './rabbitChildren';
import RabbitSaleSection from './rabbitSaleSection';
import { Tabs, Tab } from "@heroui/react";
import { useNav } from "@/components/providers/Providers";
import { useCallback, useEffect, useMemo } from 'react';
import MyNav from "@/components/nav/side/index/MyNav";
import DeleteRabbitModal from '@/components/modals/rabbit/deleteRabbitModal';
import TransferOwnershipModal from '@/components/modals/rabbit/transferRabbitModal';

export default function RabbitProfile({ rabbitProfile: initialRabbitProfile }: { rabbitProfile: Rabbit_ProfileDTO }) {
    // Hent hooks-funktioner fra useNav
    const { setSecondaryNav } = useNav();

    // Hent hooks-funktioner fra custom hook
    const {
        currentProfile,
        isEditing,
        isSaving,
        isDeleting,
        showTransferModal,
        isDeleteModalOpen,
        editedData,
        setEditedData,
        setIsEditing,
        handleSave,
        handleCancelEdit,
        handleDeleteConfirm,
        handleDeleteCancel,
        handleCloseTransferModal
    } = useRabbitProfile(initialRabbitProfile);

    // Handler til salgsdetaljer
    const handleSaleDetailsChange = useCallback((saleDetails: Rabbit_SaleDetailsDTO | null) => {
        console.log("Sale details changed:", saleDetails);
    }, []);
    
    // Vi behøver ikke længere at bygge og sætte primaryNav, da layout.tsx håndterer det
    // Men vi beholder secondaryNav
    const secondaryNavComponent = useMemo(() => (
        <MyNav key="secondary-nav" />
    ), []);

    // Opdateret useEffect uden primaryNav
    useEffect(() => {
        // setPrimaryNav(null); // Fjern primær navigation, da layout håndterer det
        setSecondaryNav(secondaryNavComponent);
        
        return () => {
            // setPrimaryNav(null);
            setSecondaryNav(null);
        };
    }, [setSecondaryNav, secondaryNavComponent]); // Fjern primaryNav fra dependencies

    const displayName = currentProfile.nickName || currentProfile.earCombId;

    return (
        <>
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-zinc-100">
                        {displayName}
                    </h1>
                </div>

                <Tabs aria-label="Kanin information" variant="solid" color="primary">
                    <Tab key="details" title="Detaljer">
                        <RabbitDetails
                            rabbitProfile={currentProfile}
                            isEditing={isEditing}
                            isSaving={isSaving}
                            setIsEditing={setIsEditing}
                            handleSave={handleSave}
                            handleCancel={handleCancelEdit}
                            editedData={editedData}
                            setEditedData={setEditedData}
                        />
                    </Tab>

                    <Tab key="children" title="Afkom">
                        <RabbitChildren>
                            {currentProfile.children || []}
                        </RabbitChildren>
                    </Tab>

                    <Tab key="sale" title="Salgsprofil">
                        <RabbitSaleSection
                            rabbitProfile={currentProfile}
                            onSaleDetailsChange={handleSaleDetailsChange}
                        />
                    </Tab>
                </Tabs>
            </div>

            {/* Modaler for delete og transfer - disse håndteres nu af standalone RabbitProfileNav */}
            {/* Men vi beholder dem her for sikkerhedens skyld, indtil vi er sikre på at alt virker */}
            {/* Senere kan disse fjernes helt, da de vil være duplikater */}
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
            />
        </>
    );
}