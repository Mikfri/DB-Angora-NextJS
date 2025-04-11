// src/hooks/rabbits/useRabbitProfile.ts
import { useState, useCallback } from 'react';
import { Rabbit_ProfileDTO, TransferRequest_CreateDTO } from '@/api/types/AngoraDTOs';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { deleteRabbit, updateRabbit } from '@/app/actions/rabbit/rabbitCrudActions';
import { createRabbitTransferRequest } from '@/app/actions/transfers/transferRequestsActions';

export function useRabbitProfile(initialProfile: Rabbit_ProfileDTO) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Tilføj currentProfile state for at holde styr på den aktuelle version
    const [currentProfile, setCurrentProfile] = useState<Rabbit_ProfileDTO>(initialProfile);

    // Opret editedData fra currentProfile i stedet for initialProfile
    const [editedData, setEditedData] = useState<Rabbit_ProfileDTO>({
        ...currentProfile
    });

    // Handler for at åbne delete modal
    const handleDeleteClick = useCallback(() => {
        console.log("Delete button clicked!");
        setIsDeleteModalOpen(true);
    }, []);

    // Handler for at lukke delete modal uden at slette
    const handleDeleteCancel = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, []);

    // Handler for den faktiske sletning - nu med den konsoliderede rabbitCrudActions
    const handleDeleteConfirm = useCallback(async () => {
        try {
            setIsDeleting(true);
            const result = await deleteRabbit(currentProfile.earCombId);
            
            if (result.success) {
                toast.success('Kaninen blev slettet');
                router.push('/account/myRabbits');
            } else {
                toast.error(result.error || 'Der skete en fejl ved sletning af kaninen');
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Der skete en fejl ved sletning af kaninen');
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    }, [currentProfile.earCombId, router]);

    // Opdateret håndtering af gemning med den konsoliderede rabbitCrudActions
    const handleSave = useCallback(async () => {
        try {
            setIsSaving(true);
            
            // Brug server action fra den konsoliderede fil
            const result = await updateRabbit(currentProfile.earCombId, editedData);
            
            if (result.success) {
                setIsEditing(false);
                toast.success('Kaninen blev opdateret');
                
                // Opdater currentProfile med de nye data
                setCurrentProfile(editedData);
                
                // Refresh router data uden fuld page reload
                router.refresh();
            } else {
                toast.error(result.error || 'Der skete en fejl ved opdatering af kaninen');
            }
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Der skete en fejl ved opdatering af kaninen');
        } finally {
            setIsSaving(false);
        }
    }, [currentProfile.earCombId, editedData, router]);

    // Tilføj en reset funktion i tilfælde af cancel
    const handleCancelEdit = useCallback(() => {
        // Reset editedData til currentProfile
        setEditedData({...currentProfile});
        setIsEditing(false);
    }, [currentProfile]);

    // Callbacks for transfer ownership
    const handleTransferOwnershipClick = useCallback(() => {
        setShowTransferModal(true);
    }, []);

    const handleCloseTransferModal = useCallback(() => {
        setShowTransferModal(false);
    }, []);

    // Ny funktion til at håndtere ejerskifte submission via server action
    const handleTransferSubmit = useCallback(async (transferData: TransferRequest_CreateDTO) => {
        try {
            setIsTransferring(true);
            
            const result = await createRabbitTransferRequest(transferData);
            
            if (result.success) {
                toast.success(result.message);
                setShowTransferModal(false);
                // Opdater router data
                router.refresh();
                return true;
            } else {
                toast.error(result.error);
                return false;
            }
        } catch (error) {
            console.error('Transfer request failed:', error);
            toast.error('Der skete en fejl ved anmodning om ejerskifte');
            return false;
        } finally {
            setIsTransferring(false);
        }
    }, [router]);

    return {
        currentProfile,
        setCurrentProfile,
        editedData,
        isEditing,
        isSaving,
        isDeleting,
        isTransferring,
        showTransferModal,
        isDeleteModalOpen,
        setEditedData,
        setIsEditing,
        handleSave,
        handleCancelEdit,
        handleDeleteClick,
        handleDeleteConfirm,
        handleDeleteCancel,
        handleTransferOwnershipClick,
        handleCloseTransferModal,
        handleTransferSubmit
    };
}