// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitProfile.tsx
"use client";
import { Rabbit_ProfileDTO, Rabbit_SaleDetailsDTO } from '@/api/types/AngoraDTOs';
import { useRabbitProfile } from '@/hooks/rabbits/useRabbitProfile';
import RabbitProfileNav from '@/components/nav/side/variants/rabbitProfileNav';
import RabbitDetails from './rabbitDetails';
import RabbitChildren from './rabbitChildren';
import RabbitSaleSection from './rabbitSaleSection';
import { Tabs, Tab } from "@heroui/react";
import { useNav } from "@/components/Providers";
import { useCallback, useEffect, useMemo } from 'react'; // Fjern useState da vi ikke bruger det længere
import MyNav from "@/components/nav/side/index/MyNavWrapper";
import DeleteRabbitModal from '@/components/modals/rabbit/deleteRabbitModal';
import TransferOwnershipModal from '@/components/modals/rabbit/transferRabbitModal';

export default function RabbitProfile({ rabbitProfile: initialRabbitProfile }: { rabbitProfile: Rabbit_ProfileDTO }) {
    // Fjern rabbitProfile state - brug currentProfile fra hook i stedet
    // const [rabbitProfile, setRabbitProfile] = useState<Rabbit_ProfileDTO>(initialRabbitProfile);

    // Hent hooks-funktioner fra useNav
    const { setPrimaryNav, setSecondaryNav } = useNav();

    // Hent hooks-funktioner fra custom hook
    const {
        currentProfile, // Nu bruger vi denne i stedet for den lokale state
        isEditing,
        isSaving,
        isDeleting,
        showTransferModal,
        isDeleteModalOpen,
        editedData,
        setEditedData,
        setIsEditing,
        handleSave,
        handleCancelEdit, // Vi sender denne videre til RabbitDetails
        handleDeleteClick,
        handleDeleteConfirm,
        handleDeleteCancel,
        handleTransferOwnershipClick,
        handleCloseTransferModal
    } = useRabbitProfile(initialRabbitProfile);

    // Opdater handler til at bruge currentProfile
    const handleSaleDetailsChange = useCallback((saleDetails: Rabbit_SaleDetailsDTO | null) => {
        // Vi skal implementere salgsdetaljer ændringer i useRabbitProfile hook
        // Dette er en midlertidig løsning (eller fjern helt hvis ikke nødvendig)
        console.log("Sale details changed:", saleDetails);
    }, []);

    // Memoized værdier - opdater til at bruge currentProfile i stedet for rabbitProfile

    // 1. Key for rabbit nav component
    const earCombKey = useMemo(() => `nav-${currentProfile.earCombId}`, [currentProfile.earCombId]);

    // 2. Navigation data object
    const navData = useMemo(() => ({
        rabbitName: currentProfile.nickName || currentProfile.earCombId,
        earCombId: currentProfile.earCombId,
        originBreeder: currentProfile.originFullName,
        owner: currentProfile.ownerFullName,
        approvedRaceColor: currentProfile.approvedRaceColorCombination,
        isJuvenile: currentProfile.isJuvenile,
        profilePicture: currentProfile.profilePicture
    }), [currentProfile]);

    // 3. Display name for rabbit (for modals etc.)
    const displayName = useMemo(() => navData.rabbitName, [navData.rabbitName]);

    // 4. Memoized JSX for primary navigation
    const primaryNavComponent = useMemo(() => (
        <RabbitProfileNav
            key={earCombKey}
            {...navData}
            onDeleteClick={handleDeleteClick}
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

            {/* Modal for deletion confirmation */}
            <DeleteRabbitModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                rabbitName={displayName}
                isDeleting={isDeleting}
            />

            {/* TransferOwnershipModal med sammenhængende props */}
            <TransferOwnershipModal
                isOpen={showTransferModal}
                onClose={handleCloseTransferModal}
                rabbitName={displayName}
                rabbitEarCombId={currentProfile.earCombId}
            />
        </>
    );
}