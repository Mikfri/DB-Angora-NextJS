// src/hooks/useSaleDetailsHandler.ts
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Rabbit_ProfileDTO,
    RabbitSaleDetailsEmbeddedDTO,
    Rabbit_CreateSaleDetailsDTO,
    Rabbit_UpdateSaleDetailsDTO
} from '@/api/types/AngoraDTOs';
import {
    createRabbitSaleDetails,
    updateRabbitSaleDetails,
    deleteRabbitSaleDetails
} from '@/app/actions/rabbit/rabbitSaleDetailsCrudAction';
import { getRabbitProfile } from '@/app/actions/rabbit/rabbitCrudActions';
import { invalidateForsalePages } from '@/app/actions/cache/invalidateCache';

interface UseSaleDetailsHandlerProps {
    rabbitProfile: Rabbit_ProfileDTO;
    onSaleDetailsChange: (saleDetails: RabbitSaleDetailsEmbeddedDTO | null) => void;
}

export function useSaleDetailsHandler({
    rabbitProfile,
    onSaleDetailsChange
}: UseSaleDetailsHandlerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // State for saleDetails - nu af typen RabbitSaleDetailsEmbeddedDTO
    const [localSaleDetails, setLocalSaleDetails] = useState<RabbitSaleDetailsEmbeddedDTO | null>(
        rabbitProfile.saleDetailsEmbedded
    );

    // Form data for create/edit operations
    const [formData, setFormData] = useState<Rabbit_CreateSaleDetailsDTO | Rabbit_UpdateSaleDetailsDTO>(
        createInitialFormData(rabbitProfile)
    );

    // Sync local state med props når profilen ændres og ikke er i redigeringstilstand
    useEffect(() => {
        if (!isCreating && !isEditing) {
            setLocalSaleDetails(rabbitProfile.saleDetailsEmbedded);
        }
    }, [rabbitProfile.saleDetailsEmbedded, isCreating, isEditing]);

    // Funktion til at opdatere profildata fra API
    const refreshFullProfile = async () => {
        try {
            // Anvend eksisterende server action fra rabbitCrudActions.ts
            const result = await getRabbitProfile(rabbitProfile.earCombId);
            
            if (!result.success) {
                toast.error(result.error || 'Kunne ikke opdatere visningen');
                return null;
            }
            
            const updatedProfile = result.data;
            console.log('Refreshed profile from API:', updatedProfile);

            if (updatedProfile.saleDetailsEmbedded) {
                // Opdater lokal state med den nye værdi
                setLocalSaleDetails(updatedProfile.saleDetailsEmbedded);

                // Informer parent component med den nye saleDetailsEmbedded
                onSaleDetailsChange(updatedProfile.saleDetailsEmbedded);

                toast.success('Salgsoplysninger opdateret');
            } 
            else {
                setLocalSaleDetails(null);
                onSaleDetailsChange(null);
            }

            return updatedProfile;
        } catch (error) {
            console.error('Fejl ved genindlæsning af profil:', error);
            toast.error('Kunne ikke opdatere visningen');
            return null;
        }
    };

    // Form submission handler
    const handleSubmit = async () => {
        try {
            setIsSaving(true);

            if (rabbitProfile.saleDetailsEmbedded && isEditing) {
                // Update existing sale details
                const updateDetails = {
                    ...formData as Rabbit_UpdateSaleDetailsDTO,
                } as Rabbit_UpdateSaleDetailsDTO;

                console.log('Updating sale details:', updateDetails);

                // Bemærk: Vi bruger nu earCombId i stedet for saleDetailsId
                const result = await updateRabbitSaleDetails(
                    rabbitProfile.earCombId,
                    updateDetails
                );

                if (result.success) {
                    console.log('Update successful, refreshing profile');
                    await refreshFullProfile();
                    
                    // Invalider cache for forsale sider
                    try {
                        await invalidateForsalePages();
                        console.log('Cache for forsale pages invalidated');
                    } catch (cacheError) {
                        console.error('Failed to invalidate cache:', cacheError);
                    }
                    
                    setIsEditing(false);
                } else {
                    toast.error(result.error);
                }
            } else {
                // Create new sale details
                const createDetails = {
                    ...formData as Rabbit_CreateSaleDetailsDTO,
                    rabbitId: rabbitProfile.earCombId
                } as Rabbit_CreateSaleDetailsDTO;

                console.log('Creating sale details:', createDetails);

                const result = await createRabbitSaleDetails(createDetails);

                if (result.success) {
                    console.log('Create successful, refreshing profile');
                    await refreshFullProfile();
                    
                    // Invalider cache for forsale sider
                    try {
                        await invalidateForsalePages();
                        console.log('Cache for forsale pages invalidated');
                    } catch (cacheError) {
                        console.error('Failed to invalidate cache:', cacheError);
                    }
                    
                    setIsCreating(false);
                } else {
                    toast.error(result.error);
                }
            }
        } catch (error) {
            toast.error(`Fejl: ${(error as Error).message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        if (!rabbitProfile.saleDetailsEmbedded) return;

        try {
            setIsDeleting(true);
            // Bemærk: Vi bruger nu earCombId i stedet for saleDetailsId
            const result = await deleteRabbitSaleDetails(rabbitProfile.earCombId);

            if (result.success) {
                console.log('Delete successful, refreshing profile');
                await refreshFullProfile();
                
                // Invalider cache for forsale sider
                try {
                    await invalidateForsalePages();
                    console.log('Cache for forsale pages invalidated');
                } catch (cacheError) {
                    console.error('Failed to invalidate cache:', cacheError);
                }
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error(`Fejl ved sletning: ${(error as Error).message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // Start editing mode
    const startEditing = () => {
        if (!rabbitProfile.saleDetailsEmbedded) return;

        // Sæt formData baseret på de nuværende værdier
        setFormData(createFormDataFromEmbedded(localSaleDetails));
        setIsEditing(true);
    };

    // Start creating mode
    const startCreating = () => {
        setFormData({
            rabbitId: rabbitProfile.earCombId,
            title: `${rabbitProfile.nickName || rabbitProfile.earCombId} til salg`, // Default titlen
            price: 0,
            canBeShipped: false,
            isLitterTrained: false,
            isNeutered: false,
            homeEnvironment: 'Indendørs',
            description: '' // Ændret fra saleDescription til description
        });
        setIsCreating(true);
    };

    // Cancel editing/creating
    const handleCancel = () => {
        setIsEditing(false);
        setIsCreating(false);
    };

    return {
        localSaleDetails,
        isCreating,
        isEditing,
        isSaving,
        isDeleting,
        formData,
        setFormData,
        handleSubmit,
        handleDelete,
        startEditing,
        startCreating,
        handleCancel
    };
}

// Helper function to create initial form data
function createInitialFormData(rabbitProfile: Rabbit_ProfileDTO): Rabbit_CreateSaleDetailsDTO | Rabbit_UpdateSaleDetailsDTO {
    return rabbitProfile.saleDetailsEmbedded ?
        createFormDataFromEmbedded(rabbitProfile.saleDetailsEmbedded) :
        {
            rabbitId: rabbitProfile.earCombId,
            title: `${rabbitProfile.nickName || rabbitProfile.earCombId} til salg`,
            price: 0,
            canBeShipped: false,
            isLitterTrained: false,
            isNeutered: false,
            homeEnvironment: 'Indendørs',
            description: '' // Ændret fra saleDescription til description
        };
}

// Opdateret helper function til at skabe form data fra RabbitSaleDetailsEmbeddedDTO
function createFormDataFromEmbedded(
    saleDetails: RabbitSaleDetailsEmbeddedDTO | null
): Rabbit_UpdateSaleDetailsDTO {
    if (!saleDetails) {
        return {
            title: '',
            price: 0,
            canBeShipped: false,
            isLitterTrained: false,
            isNeutered: false,
            homeEnvironment: 'Indendørs',
            description: '' 
        };
    }

    return {
        title: saleDetails.title || ``, 
        price: saleDetails.price || 0,
        canBeShipped: saleDetails.canBeShipped || false,
        isLitterTrained: saleDetails.isLitterTrained || false,
        isNeutered: saleDetails.isNeutered || false,
        homeEnvironment: saleDetails.homeEnvironment || 'Indendørs',
        description: saleDetails.description || ''
    };
}