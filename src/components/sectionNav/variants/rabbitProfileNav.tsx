// src/components/sectionNav/variants/rabbitProfileNav.tsx
/// ANSVAR: Vise data og kalde callbacks
'use client';

import { useState, useCallback, memo } from 'react';
import SectionNav from '../base/baseSideNav';
import { FaTrash, FaExchangeAlt } from "react-icons/fa";
import Image from 'next/image';
import DeleteRabbitModal from '@/components/modals/rabbit/deleteRabbitModal';

interface Props {
    rabbitName: string;
    earCombId: string;
    originBreeder: string | null;
    owner: string | null;
    approvedRaceColor: boolean | null;
    isJuvenile: boolean | null;
    profilePicture: string | null;
    onDelete?: () => void;
    onChangeOwner: () => void;  // Skal være required
    isDeleting: boolean;
    // Fjerner showTransferModal og setShowTransferModal fra props
}

// Brug memo for at forhindre unødige renderinger
const RabbitProfileNav = memo(function RabbitProfileNav({
    rabbitName,
    earCombId,
    originBreeder,
    owner,
    approvedRaceColor,
    isJuvenile,
    profilePicture,
    onDelete,
    onChangeOwner,
    isDeleting,
}: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [imageError, setImageError] = useState(false);
    const defaultImage = '/images/default-rabbit.jpg';
    const displayedImage = (!imageError && profilePicture) ? profilePicture : defaultImage;

    // Tilføj lokale handlere for at undgå state-cirkler
    // Brug useCallback for at forhindre nye funktions-referencer ved hver render
    const handleDeleteClick = useCallback(() => {
        setShowDeleteModal(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (onDelete) onDelete();
        setShowDeleteModal(false);
    }, [onDelete]);

    // Vi kan trygt kalde onChangeOwner, da den nu er required
    return (
        <>
            <SectionNav
                title={`Profil: ${rabbitName}`}
                footerActions={[
                    {
                        label: (
                            <>
                                <FaTrash className="mr-2" />
                                Slet kanin
                            </>
                        ),
                        onClick: handleDeleteClick,
                        color: "danger"
                    },
                    {
                        label: (
                            <>
                                <FaExchangeAlt className="mr-2" />
                                Skift ejer
                            </>
                        ),
                        onClick: onChangeOwner,
                        color: "primary"
                    }
                ]}
            >
                <div className="flex flex-col items-center space-y-4 p-2 text-white">
                    <div className="relative w-24 h-24">
                        <Image
                            src={displayedImage}
                            alt={`${rabbitName} Profile Picture`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                            onError={() => setImageError(true)}
                        />
                    </div>
                    <table className="w-full text-left">
                        <tbody>
                            <tr>
                                <th className="px-2 py-1 font-semibold">Øremærke ID:</th>
                                <td className="px-2 py-1">{earCombId}</td>
                            </tr>
                            <tr>
                                <th className="px-2 py-1 font-semibold">Opdrætter:</th>
                                <td className="px-2 py-1">{originBreeder || 'Ikke fundet i systemet'}</td>
                            </tr>
                            <tr>
                                <th className="px-2 py-1 font-semibold">Ejer:</th>
                                <td className="px-2 py-1">{owner || 'Ikke fundet i systemet'}</td>
                            </tr>
                            <tr>
                                <th className="px-2 py-1 font-semibold"> Race/farve komb godkendt:</th>
                                <td className="px-2 py-1">{approvedRaceColor ? 'Ja' : 'Nej'}</td>
                            </tr>
                            <tr>
                                <th className="px-2 py-1 font-semibold">Ungdyr:</th>
                                <td className="px-2 py-1">{isJuvenile ? 'Ja' : 'Nej'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </SectionNav>

            {/* Modal for deletion confirmation */}
            <DeleteRabbitModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                rabbitName={rabbitName}
                isDeleting={isDeleting || false}
            />
        </>
    );
});

export default RabbitProfileNav;