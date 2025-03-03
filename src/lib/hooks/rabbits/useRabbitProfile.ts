// src/lib/hooks/rabbits/useRabbitProfile.ts

import { useState, useCallback } from 'react';
import { Rabbit_ProfileDTO } from '@/api/types/AngoraDTOs';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { EditRabbit, DeleteRabbit } from '@/api/endpoints/rabbitController';

export function useRabbitProfile(initialProfile: Rabbit_ProfileDTO) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    // Vigtigt: Behandl initialProfile som en ref-værdi, ikke en dependency
    const [editedData, setEditedData] = useState<Rabbit_ProfileDTO>({
        ...initialProfile
    });

    // Brug useCallback for alle handlere
    const handleSave = useCallback(async () => {
        try {
            setIsSaving(true);
            const response = await fetch('/api/auth/token');
            const { accessToken } = await response.json();
            
            if (!accessToken) {
                toast.error('Du er ikke logget ind');
                return;
            }

            await EditRabbit(initialProfile.earCombId, editedData, accessToken);
            setIsEditing(false);
            toast.success('Kaninen blev opdateret');
            window.location.reload();
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Der skete en fejl ved opdatering af kaninen');
        } finally {
            setIsSaving(false);
        }
    }, [initialProfile.earCombId, editedData]);

    const handleDelete = useCallback(async () => {
        try {
            setIsDeleting(true);
            const response = await fetch('/api/auth/token');
            const { accessToken } = await response.json();
            
            if (!accessToken) {
                toast.error('Du er ikke logget ind');
                return;
            }

            await DeleteRabbit(initialProfile.earCombId, accessToken);
            toast.success('Kaninen blev slettet');
            router.push('/account/myRabbits');
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Der skete en fejl ved sletning af kaninen');
        } finally {
            setIsDeleting(false);
        }
    }, [initialProfile.earCombId, router]);

    // Stable callback for transfer ownership
    const handleTransferOwnershipClick = useCallback(() => {
        setShowTransferModal(true);
    }, []);

    // Stable callback for closing transfer modal
    const handleCloseTransferModal = useCallback(() => {
        setShowTransferModal(false);
    }, []);

    return {
        editedData,
        isEditing,
        isSaving,
        isDeleting,
        showTransferModal,
        setEditedData,
        setIsEditing,
        handleSave,
        handleDelete,
        handleTransferOwnershipClick,
        handleCloseTransferModal
    };
}