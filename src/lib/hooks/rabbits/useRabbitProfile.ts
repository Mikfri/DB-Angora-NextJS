import { useState } from 'react';
import { Rabbit_ProfileDTO } from '@/api/types/AngoraDTOs';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { EditRabbit, DeleteRabbit } from '@/api/endpoints/rabbitController';

export function useRabbitProfile(initialProfile: Rabbit_ProfileDTO) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Skift her fra Rabbit_UpdateDTO til Rabbit_ProfileDTO
    const [editedData, setEditedData] = useState<Rabbit_ProfileDTO>({
        ...initialProfile
    });

    const handleSave = async () => {
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
    };

    const handleDelete = async () => {
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
    };

    return {
        editedData,
        isEditing,
        isSaving,
        isDeleting,
        setEditedData,
        setIsEditing,
        handleSave,
        handleDelete
    };
}