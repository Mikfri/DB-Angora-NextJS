'use client';

import { useState } from 'react';
import SectionNav from '../base/baseSideNav';
import { FaTrash, FaExchangeAlt } from "react-icons/fa";
import DeleteRabbitModal from '@/components/modals/deleteRabbitModal';
import Image from 'next/image';

interface Props {
    rabbitName: string;
    earCombId: string;
    originBreeder: string | null;
    owner: string | null;
    approvedRaceColor: boolean | null;
    isJuvenile: boolean | null;
    profilePicture: string | null;
    onDelete?: () => void;
    onChangeOwner?: () => void;
    isDeleting: boolean;
}

export default function RabbitProfileNav({
    rabbitName,
    earCombId,
    originBreeder,
    owner,
    approvedRaceColor,
    isJuvenile,
    profilePicture,
    onDelete,
    onChangeOwner,
    isDeleting
}: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [imageError, setImageError] = useState(false);
    const defaultImage = '/images/default-rabbit.jpg';
    const displayedImage = (!imageError && profilePicture) ? profilePicture : defaultImage;

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        onDelete?.();
    };

    return (
        <>
            <SectionNav
                title={`Profil: ${rabbitName}`}
                actions={[
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
                        onClick: () => onChangeOwner?.(),
                        color: "primary"
                    }
                ]}
            >
                {/* Profilinformationerne øverst */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-24 h-24 mb-4">
                        <Image
                            src={displayedImage}
                            alt={`${rabbitName} Profile Picture`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                            onError={() => setImageError(true)}
                        />
                    </div>
                    <div className="w-full">
                        <table className="w-full text-left">
                            <tbody>
                                <tr>
                                    <th className="px-2 py-1 font-semibold">Øremærke ID:</th>
                                    <td className="px-2 py-1">{earCombId}</td>
                                </tr>
                                <tr>
                                    <th className="px-2 py-1 font-semibold">Opdrætter:</th>
                                    <td className="px-2 py-1">{originBreeder || 'Ikke angivet'}</td>
                                </tr>
                                <tr>
                                    <th className="px-2 py-1 font-semibold">Ejer:</th>
                                    <td className="px-2 py-1">{owner || 'Ikke angivet'}</td>
                                </tr>
                                <tr>
                                    <th className="px-2 py-1 font-semibold">Godkendt race/farve kombination:</th>
                                    <td className="px-2 py-1">{approvedRaceColor ? 'Ja' : 'Nej'}</td>
                                </tr>
                                <tr>
                                    <th className="px-2 py-1 font-semibold">Ungdyr:</th>
                                    <td className="px-2 py-1">{isJuvenile ? 'Ja' : 'Nej'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </SectionNav>

            {/* Modal for sletning af kanin */}
            <DeleteRabbitModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                rabbitName={rabbitName}
                isDeleting={isDeleting || false}
            />
        </>
    );
}