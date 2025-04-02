'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // Direkte import af toast
import RabbitProfileNavBase from '../base/RabbitProfileNavBase';
import DeleteRabbitModal from '@/components/modals/rabbit/deleteRabbitModal';
import TransferOwnershipModal from '@/components/modals/rabbit/transferRabbitModal';

interface RabbitProfileNavWrapperProps {
    id?: string;
    rabbitName: string;
    earCombId: string;
    originBreeder: string | null;
    owner: string | null;
    approvedRaceColor: boolean | null;
    isJuvenile: boolean | null;
    profilePicture: string | null;
}

/**
 * Wrapper-komponent for RabbitProfileNav med tilkoblet funktionalitet 
 * for sletning, ejerskifte og navigering
 */
export default function RabbitProfileNavWrapper({
    earCombId, // (Dens ID)
    rabbitName,
    originBreeder,
    owner,
    approvedRaceColor,
    isJuvenile,
    profilePicture,
}: RabbitProfileNavWrapperProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    
    // Håndtér sletning af kanin
    const handleDeleteClick = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);
    
    const handleDeleteCancel = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, []);
    
    const handleDeleteConfirm = useCallback(async () => {
        try {
            setIsDeleting(true);
            
            // Her skulle vi normalt kalde API for at slette kaninen
            // await deleteRabbit(id);
            
            // Dette er et mock-kald da vi mangler den korrekte API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setIsDeleteModalOpen(false);
            
            // Brug toast direkte i stedet for showToast
            toast.success(
                <div>
                    <div className="font-medium">Kanin slettet</div>
                    <div className="text-sm opacity-90">{rabbitName} er nu slettet fra databasen</div>
                </div>
            );
            
            // Naviger tilbage til kanin-oversigten
            router.push('/account/myRabbits');
            router.refresh();
        } catch (error) {
            console.error('Fejl under sletning af kanin:', error);
            
            // Brug toast.error direkte
            toast.error(
                <div>
                    <div className="font-medium">Fejl under sletning</div>
                    <div className="text-sm opacity-90">Der opstod en fejl under sletning af kaninen</div>
                </div>
            );
        } finally {
            setIsDeleting(false);
        }
    }, [rabbitName, router]); // Fjernet id fra dependency array da den ikke bruges
    
    // Ejerskifte håndtering
    const handleTransferOwnershipClick = useCallback(() => {
        setShowTransferModal(true);
    }, []);
    
    const handleCloseTransferModal = useCallback(() => {
        setShowTransferModal(false);
        
        // Tilføj success toast ved ejerskifte
        toast.success(
            <div>
                <div className="font-medium">Ejerskifte gennemført</div>
                <div className="text-sm opacity-90">{rabbitName} har fået ny ejer</div>
            </div>
        );
        
        router.refresh();
    }, [router, rabbitName]);
    
    return (
        <>
            <RabbitProfileNavBase
                rabbitName={rabbitName}
                earCombId={earCombId}
                originBreeder={originBreeder}
                owner={owner}
                approvedRaceColor={approvedRaceColor}
                isJuvenile={isJuvenile}
                profilePicture={profilePicture}
                onDeleteClick={handleDeleteClick}
                onChangeOwner={handleTransferOwnershipClick}
                isDeleting={isDeleting}
            />
            
            {/* Delete modal */}
            <DeleteRabbitModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                rabbitName={rabbitName}
                isDeleting={isDeleting}
            />
            
            {/* TransferOwnershipModal */}
            <TransferOwnershipModal
                isOpen={showTransferModal}
                onClose={handleCloseTransferModal}
                rabbitName={rabbitName}
                rabbitEarCombId={earCombId}
            />
        </>
    );
}