// src/hooks/rabbits/useRabbitProfile.ts
import { useState } from 'react';
import { Rabbit_ProfileDTO, Rabbit_UpdateDTO } from '@/Types/AngoraDTOs';
import { EditRabbit, DeleteRabbit } from '@/Services/AngoraDbService';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export function useRabbitProfile(initialProfile: Rabbit_ProfileDTO) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editedData, setEditedData] = useState<Rabbit_UpdateDTO>({
        nickName: initialProfile.nickName,
        race: initialProfile.race,
        color: initialProfile.color,
        dateOfBirth: initialProfile.dateOfBirth,
        dateOfDeath: initialProfile.dateOfDeath,
        gender: initialProfile.gender,
        forSale: initialProfile.forSale,
        forBreeding: initialProfile.forBreeding,
        fatherId_Placeholder: initialProfile.fatherId_Placeholder,
        motherId_Placeholder: initialProfile.motherId_Placeholder,
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