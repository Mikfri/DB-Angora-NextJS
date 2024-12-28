// src/components/sectionNav/variants/rabbitProfileNav.tsx
'use client';
import { useState } from 'react';
import SectionNav from '../base/baseSideNav';
import { FaTrash, FaExchangeAlt } from "react-icons/fa";
import DeleteRabbitModal from '@/components/modals/deleteRabbitModal';

interface Props {
    rabbitName: string;
    onDelete?: () => void;
    onChangeOwner?: () => void;
    isDeleting: boolean;
}

export default function RabbitProfileNav({ rabbitName, onDelete, onChangeOwner, isDeleting }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
            />

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