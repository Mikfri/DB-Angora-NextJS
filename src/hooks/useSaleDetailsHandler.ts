// src/ho
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Rabbit_ProfileDTO,
    Rabbit_SaleDetailsDTO,
    Rabbit_CreateSaleDetailsDTO,
    Rabbit_UpdateSaleDetailsDTO,
    SaleDetailsProfileDTO
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
    onSaleDetailsChange: (saleDetails: Rabbit_SaleDetailsDTO | null, fullSaleDetailsProfile?: SaleDetailsProfileDTO | null) => void;
}

export function useSaleDetailsHandler({
    rabbitProfile,
    onSaleDetailsChange
}: UseSaleDetailsHandlerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // State for saleDetails
    const [localSaleDetails, setLocalSaleDetails] = useState<SaleDetailsProfileDTO | null>(rabbitProfile.saleDetailsProfile);

    // Form data for create/edit operations
    const [formData, setFormData] = useState<Rabbit_CreateSaleDetailsDTO | Rabbit_UpdateSaleDetailsDTO>(
        createInitialFormData(rabbitProfile)
    );

    // Sync local state with props when profile changes and not in editing mode
    useEffect(() => {
        if (!isCreating && !isEditing) {
            setLocalSaleDetails(rabbitProfile.saleDetailsProfile);
        }
    }, [rabbitProfile.saleDetailsProfile, isCreating, isEditing]);

    // Function to refresh profile data from API - OPDATERET til at bruge server action
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

            if (updatedProfile.saleDetailsProfile) {
                // Eksplicit typet variabel for at undgå type-problemer
                const updatedSaleDetails: SaleDetailsProfileDTO = {
                    ...updatedProfile.saleDetailsProfile
                };

                // Opdater lokal state med den nye værdi
                setLocalSaleDetails(updatedSaleDetails);

                // Informer parent component med BÅDE rabbitSaleDetails OG hele saleDetailsProfile
                if (updatedProfile.saleDetailsProfile?.rabbitSaleDetails) {
                    onSaleDetailsChange(
                        updatedProfile.saleDetailsProfile.rabbitSaleDetails,
                        updatedProfile.saleDetailsProfile // Send hele objektet som anden parameter
                    );
                } else {
                    onSaleDetailsChange(null, null);
                }

                toast.success('Salgsoplysninger opdateret');
            } 
            else {
                setLocalSaleDetails(null);
                onSaleDetailsChange(null, null);
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

            if (rabbitProfile.saleDetailsProfile && isEditing) {
                // Update existing sale details
                const updateDetails = {
                    ...formData as Omit<Rabbit_UpdateSaleDetailsDTO, 'rabbitId'>,
                    rabbitId: rabbitProfile.earCombId
                } as Rabbit_UpdateSaleDetailsDTO;

                console.log('Updating sale details:', updateDetails);

                const result = await updateRabbitSaleDetails(
                    rabbitProfile.saleDetailsProfile.id,
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
        if (!rabbitProfile.saleDetailsProfile) return;

        try {
            setIsDeleting(true);
            const result = await deleteRabbitSaleDetails(rabbitProfile.saleDetailsProfile.id);

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
        if (!rabbitProfile.saleDetailsProfile) return;

        // Sæt formData baseret på de nuværende værdier
        // VIGTIGT: Vi skal bruge localSaleDetails frem for rabbitProfile.saleDetailsProfile
        // for at få de seneste værdier der vises i UI
        setFormData(createFormDataFromProfileOrLocalState(rabbitProfile, localSaleDetails));

        setIsEditing(true);
    };

    // Start creating mode
    const startCreating = () => {
        setFormData({
            rabbitId: rabbitProfile.earCombId,
            price: 0,
            canBeShipped: false,
            isLitterTrained: false,
            isNeutered: false,
            homeEnvironment: 'Indendørs',
            saleDescription: ''
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
    return rabbitProfile.saleDetailsProfile ?
        createFormDataFromProfileOrLocalState(rabbitProfile, rabbitProfile.saleDetailsProfile) :
        {
            rabbitId: rabbitProfile.earCombId,
            price: 0,
            canBeShipped: false,
            isLitterTrained: false,
            isNeutered: false,
            homeEnvironment: 'Indendørs',
            saleDescription: ''
        };
}

// Opdateret helper function til at skabe form data enten fra profil eller lokal state
function createFormDataFromProfileOrLocalState(
    rabbitProfile: Rabbit_ProfileDTO,
    localSaleDetails: SaleDetailsProfileDTO | null
): Rabbit_UpdateSaleDetailsDTO {
    // Brug primært localSaleDetails hvis tilgængeligt, ellers rabbitProfile.saleDetailsProfile
    const saleDetails = localSaleDetails || rabbitProfile.saleDetailsProfile;

    return {
        price: saleDetails?.price || 0,
        canBeShipped: false,
        isLitterTrained: saleDetails?.rabbitSaleDetails?.isLitterTrained || false,
        isNeutered: saleDetails?.rabbitSaleDetails?.isNeutered || false,
        homeEnvironment: saleDetails?.rabbitSaleDetails?.homeEnvironment || 'Indendørs',
        saleDescription: saleDetails?.saleDescription || ''
    };
}