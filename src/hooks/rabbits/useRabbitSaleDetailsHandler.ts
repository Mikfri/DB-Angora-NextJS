// src/hooks/useSaleDetailsHandler.ts

/**
 * Custom hook til håndtering af logik for rabbit sale details (Create, Edit, Delete).
 * - Centraliserer API-kald og state management for sale details i rabbit profile.
 * - Returnerer tilstand og handlers som kan bruges i RabbitSaleSection komponenten.
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Rabbit_ProfileDTO,
} from '@/api/types/AngoraDTOs';
import {
    createRabbitSaleDetails,
    updateRabbitSaleDetails,
    deleteRabbitSaleDetails
} from '@/app/actions/sales/salesRabbitActions';
import { getRabbitProfile } from '@/app/actions/rabbit/rabbitCrudActions';
import { invalidateForsalePages } from '@/app/actions/cache/invalidateCache';
import { RabbitPostPutSaleDetailsDTO, RabbitSaleProfilePrivateDTO } from '@/api/types/RabbitSaleDTOs';

interface UseSaleDetailsHandlerProps {
    rabbitProfile: Rabbit_ProfileDTO;
    onSaleDetailsChange: (saleDetails: RabbitSaleProfilePrivateDTO | null) => void;
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
    const [localSaleDetails, setLocalSaleDetails] = useState<RabbitSaleProfilePrivateDTO | null>(
        rabbitProfile.saleDetailsEmbedded ?? null
    );

    // Form data for create/edit operations
    const [formData, setFormData] = useState<RabbitPostPutSaleDetailsDTO>(
        createInitialFormData(rabbitProfile)
    );

    // Sync local state med props når profilen ændres og ikke er i redigeringstilstand
    useEffect(() => {
        if (!isCreating && !isEditing) {
            setLocalSaleDetails(rabbitProfile.saleDetailsEmbedded ?? null);
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
                setLocalSaleDetails(updatedProfile.saleDetailsEmbedded);
                onSaleDetailsChange(updatedProfile.saleDetailsEmbedded);
            } else {
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
                const result = await updateRabbitSaleDetails(
                    rabbitProfile.saleDetailsEmbedded.id,
                    formData
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
                const result = await createRabbitSaleDetails(
                    rabbitProfile.earCombId,
                    formData
                );

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
        if (!rabbitProfile.saleDetailsEmbedded?.id) return;

        try {
            setIsDeleting(true);
            // Bemærk: Vi bruger nu earCombId i stedet for saleDetailsId
            const result = await deleteRabbitSaleDetails(rabbitProfile.saleDetailsEmbedded.id);

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
        setFormData(createFormDataFromEmbedded(rabbitProfile.saleDetailsEmbedded));
        setIsEditing(true);
    };

    // Start creating mode
    const startCreating = () => {
        setFormData({
            baseProperties: {
                title: `${rabbitProfile.nickName || rabbitProfile.earCombId} til salg`,
                price: 0,
                canBeShipped: false,
                description: ''
            },
            isLitterTrained: false,
            isNeutered: false,
            homeEnvironment: 'Indendørs',
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
function createInitialFormData(rabbitProfile: Rabbit_ProfileDTO): RabbitPostPutSaleDetailsDTO {
    return rabbitProfile.saleDetailsEmbedded ?
        createFormDataFromEmbedded(rabbitProfile.saleDetailsEmbedded) :
        {
            baseProperties: {
                title: `${rabbitProfile.nickName || rabbitProfile.earCombId} til salg`,
                price: 0,
                canBeShipped: false,
                description: ''
            },
            isLitterTrained: false,
            isNeutered: false,
            homeEnvironment: 'Indendørs',
        };
}

// Helper function to map RabbitSaleDetailsEmbeddedDTO → RabbitPostPutSaleDetailsDTO
function createFormDataFromEmbedded(
    saleDetails: RabbitSaleProfilePrivateDTO | null
): RabbitPostPutSaleDetailsDTO {
    if (!saleDetails) {
        return {
            baseProperties: { title: '', price: 0, canBeShipped: false, description: '' },
            isLitterTrained: false,
            isNeutered: false,
            homeEnvironment: 'Indendørs',
        };
    }

    return {
        baseProperties: {
            title: saleDetails.title || '',
            price: saleDetails.price || 0,
            canBeShipped: saleDetails.canBeShipped || false,
            description: saleDetails.description || ''
        },
        isLitterTrained: saleDetails.isLitterTrained || false,
        isNeutered: saleDetails.isNeutered || false,
        homeEnvironment: saleDetails.homeEnvironment || 'Indendørs',
    };
}