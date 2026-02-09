// src/lib/hooks/rabbits/useRabbitCreate.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Rabbit_CreateDTO } from '@/api/types/AngoraDTOs';
import { createRabbit, validateParentReference } from '@/app/actions/rabbit/rabbitCrudActions';
import { ROUTES } from '@/constants/navigationConstants';

export function useCreateRabbit(targetedUserId?: string) {
    const router = useRouter();

    const today = new Date().toISOString().split("T")[0];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<Rabbit_CreateDTO>>({
        isForBreeding: false,
        dateOfBirth: today,   // ← DEFAULT DATO
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!targetedUserId || targetedUserId.trim() === '') {
            toast.error('targetedUserId er påkrævet');
            setIsSubmitting(false);
            return;
        }

        try {
            // Advisory parent validation (warnings only)
            if (formData.fatherId_Placeholder) {
                try {
                    const fatherValidation = await validateParentReference(formData.fatherId_Placeholder, 'Han');
                    if (!fatherValidation.success) {
                        toast.warning(fatherValidation.error || 'Kunne ikke validere far; kaninen gemmes alligevel');
                    } else if (!fatherValidation.result.isValid) {
                        toast.warning(fatherValidation.result.message || 'Far-øremærke ser ud til at være ugyldigt; kaninen gemmes alligevel');
                    }
                } catch (err) {
                    console.error('Father validation error', err);
                }
            }

            if (formData.motherId_Placeholder) {
                try {
                    const motherValidation = await validateParentReference(formData.motherId_Placeholder, 'Hun');
                    if (!motherValidation.success) {
                        toast.warning(motherValidation.error || 'Kunne ikke validere mor; kaninen gemmes alligevel');
                    } else if (!motherValidation.result.isValid) {
                        toast.warning(motherValidation.result.message || 'Mor-øremærke ser ud til at være ugyldigt; kaninen gemmes alligevel');
                    }
                } catch (err) {
                    console.error('Mother validation error', err);
                }
            }

            // Kald server action
            const result = await createRabbit(formData as Rabbit_CreateDTO, targetedUserId);

            if (result.success) {
                toast.success('Kanin oprettet');
                router.push(ROUTES.ACCOUNT.RABBIT_PROFILE(result.earCombId));
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Create failed:', error);
            toast.error(error instanceof Error ? error.message : 'Der skete en uventet fejl');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        setFormData,
        handleSubmit
    };
}