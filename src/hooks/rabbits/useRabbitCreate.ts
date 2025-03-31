// src/lib/hooks/rabbits/useRabbitCreate.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Rabbit_CreateDTO } from '@/api/types/AngoraDTOs';
import { createRabbit } from '@/app/actions/rabbit/create';

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

            // Kald Server Action
            const result = await createRabbit(formData as Rabbit_CreateDTO);

            if (result.success) {
                toast.success('Kanin oprettet');
                // Naviger til den nyoprettede kanins profilside
                router.push(`/account/myRabbits/rabbitProfile/${result.earCombId}`);
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