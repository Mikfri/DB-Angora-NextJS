// src/lib/hooks/rabbits/useRabbitCreate.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Rabbit_CreateDTO } from '@/api/types/AngoraDTOs';
import { createRabbit, validateParentReference } from '@/app/actions/rabbit/rabbitCrudActions';
import { ROUTES } from '@/constants/navigationConstants'; // <-- Tilføjet import

export function useCreateRabbit() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<Rabbit_CreateDTO>>({
        isForBreeding: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validér data på klientsiden først
            if (!formData.rightEarId || !formData.leftEarId || !formData.nickName) {
                toast.error('Udfyld venligst alle påkrævede felter');
                setIsSubmitting(false);
                return;
            }

            // Valider far (Han)
            if (formData.fatherId_Placeholder) {
                const fatherValidation = await validateParentReference(formData.fatherId_Placeholder, 'Han');
                if (!fatherValidation.success) {
                    toast.error(fatherValidation.error || 'Far-øremærke er ugyldigt');
                    setIsSubmitting(false);
                    return;
                }
                if (!fatherValidation.result.isValid) {
                    toast.error(fatherValidation.result.message || 'Far-øremærke er ugyldigt');
                    setIsSubmitting(false);
                    return;
                }
            }

            // Valider mor (Hun)
            if (formData.motherId_Placeholder) {
                const motherValidation = await validateParentReference(formData.motherId_Placeholder, 'Hun');
                if (!motherValidation.success) {
                    toast.error(motherValidation.error || 'Mor-øremærke er ugyldigt');
                    setIsSubmitting(false);
                    return;
                }
                if (!motherValidation.result.isValid) {
                    toast.error(motherValidation.result.message || 'Mor-øremærke er ugyldigt');
                    setIsSubmitting(false);
                    return;
                }
            }

            // Kald Server Action
            const result = await createRabbit(formData as Rabbit_CreateDTO);

            if (result.success) {
                toast.success('Kanin oprettet');
                router.push(ROUTES.ACCOUNT.RABBIT_PROFILE(result.earCombId));
            } else {
                toast.error(`Fejl: ${result.error}`);
            }
        } catch (error) {
            console.error('Create failed:', error);
            toast.error('Der skete en fejl ved oprettelse af kaninen');
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