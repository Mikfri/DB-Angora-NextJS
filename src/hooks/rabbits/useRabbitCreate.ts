// src/hooks/rabbits/useRabbitCreate.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CreateRabbit } from '@/Services/AngoraDbService';
import { Rabbit_CreateDTO } from '@/Types/backendTypes';

export function useCreateRabbit() { // Changed from useRabbit
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<Rabbit_CreateDTO>>({
        forSale: "Nej",
        forBreeding: "Nej"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/token');
            const { accessToken } = await response.json();

            if (!accessToken) {
                toast.error('Du er ikke logget ind');
                return;
            }

            await CreateRabbit(formData as Rabbit_CreateDTO, accessToken);
            toast.success('Kanin oprettet');
            router.push('/rabbits/own');
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