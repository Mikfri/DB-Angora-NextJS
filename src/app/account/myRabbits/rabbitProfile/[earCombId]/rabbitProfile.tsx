// src/account/myRabbits/rabbitProfile/[earCombId]/rabbitProfile.tsx
/// ANSVAR: State management og at rendere modaler
"use client";
import { Rabbit_ProfileDTO, Rabbit_SaleDetailsDTO } from '@/api/types/AngoraDTOs';
import { useRabbitProfile } from '@/lib/hooks/rabbits/useRabbitProfile';
import RabbitProfileNav from '@/components/sectionNav/variants/rabbitProfileNav';
import RabbitDetails from './rabbitDetails';
import RabbitChildren from './rabbitChildren';
import RabbitSaleSection from './rabbitSaleSection';
import { Tabs, Tab } from "@heroui/react";
import { useNav } from "@/components/Providers";
import { useCallback, useEffect, useMemo, useState } from 'react';
import MyNav from "@/components/sectionNav/variants/myNav";
import DeleteRabbitModal from '@/components/modals/rabbit/deleteRabbitModal';
import TransferOwnershipModal from '@/components/modals/rabbit/transferRabbitModal';

export default function RabbitProfile({ rabbitProfile: initialRabbitProfile }: { rabbitProfile: Rabbit_ProfileDTO }) {
    // Gør rabbitProfile til en state-variabel
    const [rabbitProfile, setRabbitProfile] = useState<Rabbit_ProfileDTO>(initialRabbitProfile);
    
    // Hent hooks-funktioner fra useNav
    const { setPrimaryNav, setSecondaryNav } = useNav();

    // Hent hooks-funktioner fra custom hook
    const {
        isEditing,
        isSaving,
        isDeleting,
        showTransferModal,
        editedData,
        setEditedData,
        setIsEditing,
        handleSave,
        handleDelete,
        handleTransferOwnershipClick,
        handleCloseTransferModal
    } = useRabbitProfile(rabbitProfile);
    
    // Lokal state for delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Memoized callbacks for UI interactions
    const handleSaleDetailsChange = useCallback((saleDetails: Rabbit_SaleDetailsDTO | null) => {
        setRabbitProfile(prevProfile => ({
            ...prevProfile,
            saleDetails
        }));
    }, []);

    const handleDeleteClick = useCallback(() => {
        setShowDeleteModal(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        handleDelete();
        setShowDeleteModal(false); // Lukker modalen efter sletning er igangsat
    }, [handleDelete]);

    const handleCloseDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
    }, []);

    // Memoized værdier - kun opdateret når dependencies ændres
    
    // 1. Key for rabbit nav component
    const earCombKey = useMemo(() => `nav-${rabbitProfile.earCombId}`, [rabbitProfile.earCombId]);
    
    // 2. Navigation data object
    const navData = useMemo(() => ({
        rabbitName: rabbitProfile.nickName || rabbitProfile.earCombId,
        earCombId: rabbitProfile.earCombId,
        originBreeder: rabbitProfile.originFullName,
        owner: rabbitProfile.ownerFullName,
        approvedRaceColor: rabbitProfile.approvedRaceColorCombination,
        isJuvenile: rabbitProfile.isJuvenile,
        profilePicture: rabbitProfile.profilePicture
    }), [rabbitProfile]);

    // 3. Display name for rabbit (for modals etc.)
    const displayName = useMemo(() => navData.rabbitName, [navData.rabbitName]);

    // 4. Memoized JSX for primary navigation
    const primaryNavComponent = useMemo(() => (
        <RabbitProfileNav
            key={earCombKey}
            {...navData}
            onDelete={handleDeleteClick}
            onChangeOwner={handleTransferOwnershipClick}
            isDeleting={isDeleting}
        />
    ), [earCombKey, navData, handleDeleteClick, handleTransferOwnershipClick, isDeleting]);

    // 5. Memoized JSX for secondary navigation (never changes)
    const secondaryNavComponent = useMemo(() => (
        <MyNav key="secondary-nav" />
    ), []);

    // Effekt for at sætte navigation - bruger kun memoized værdier
    useEffect(() => {
        // Sæt navigation med de memoized komponenter
        setPrimaryNav(primaryNavComponent);
        setSecondaryNav(secondaryNavComponent);
        
        // Cleanup function
        return () => {
            setPrimaryNav(null);
            setSecondaryNav(null);
        };
    }, [setPrimaryNav, setSecondaryNav, primaryNavComponent, secondaryNavComponent]);

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
                            rabbitProfile={rabbitProfile}
                            isEditing={isEditing}
                            isSaving={isSaving}
                            setIsEditing={setIsEditing}
                            handleSave={handleSave}
                            editedData={editedData}
                            setEditedData={setEditedData}
                        />
                    </Tab>

                    <Tab key="children" title="Afkom">
                        <RabbitChildren>
                            {rabbitProfile.children}
                        </RabbitChildren>
                    </Tab>
                    
                    <Tab key="sale" title="Salgsprofil">
                        <RabbitSaleSection
                            rabbitProfile={rabbitProfile}
                            onSaleDetailsChange={handleSaleDetailsChange}
                        />
                    </Tab>
                </Tabs>
            </div>

            {/* Modal for deletion confirmation */}
            <DeleteRabbitModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                rabbitName={displayName}
                isDeleting={isDeleting}
            />
            
            {/* TransferOwnershipModal med sammenhængende props */}
            <TransferOwnershipModal
                isOpen={showTransferModal}
                onClose={handleCloseTransferModal}
                rabbitName={displayName}
                rabbitEarCombId={rabbitProfile.earCombId}
            />
        </>
    );
}