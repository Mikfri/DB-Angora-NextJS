// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitSaleSection.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Rabbit_ProfileDTO, Rabbit_SaleDetailsDTO, Rabbit_CreateSaleDetailsDTO, Rabbit_UpdateSaleDetailsDTO } from '@/api/types/AngoraDTOs';
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { toast } from 'react-toastify';
import { CreateSaleDetails, UpdateSaleDetails, DeleteSaleDetails } from '@/api/endpoints/rabbitController';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { useAuthStore } from '@/store/authStore';
import SaleDetailsForm from './saleDetailsForm';

interface RabbitSaleSectionProps {
    rabbitProfile: Rabbit_ProfileDTO;
    onSaleDetailsChange: (saleDetails: Rabbit_SaleDetailsDTO | null) => void;
}

export default function RabbitSaleSection({
    rabbitProfile,
    onSaleDetailsChange
}: RabbitSaleSectionProps) {
    // Få auth state fra useAuthStore
    const { getAccessToken, isLoggedIn, isLoading: authLoading } = useAuthStore();
    
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState<Rabbit_CreateSaleDetailsDTO | Rabbit_UpdateSaleDetailsDTO>(
        rabbitProfile.saleDetails ? {
            price: rabbitProfile.saleDetails.price,
            canBeShipped: rabbitProfile.saleDetails.canBeShipped,
            isLitterTrained: rabbitProfile.saleDetails.isLitterTrained,
            isNeutered: rabbitProfile.saleDetails.isNeutered,
            homeEnvironment: rabbitProfile.saleDetails.homeEnvironment,
            saleDescription: rabbitProfile.saleDetails.saleDescription
        } : {
            rabbitId: rabbitProfile.earCombId,
            price: 0,
            canBeShipped: false,
            isLitterTrained: false,
            isNeutered: false,
            homeEnvironment: 'Indendørs',
            saleDescription: ''
        }
    );

    // Hent accessToken fra authStore
    const fetchToken = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = await getAccessToken();
            setAccessToken(token);
        } catch (error) {
            console.error('Failed to fetch token:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getAccessToken]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchToken();
        } else {
            setIsLoading(false);
        }
    }, [isLoggedIn, fetchToken]);
    
    // Handle form submit
    const handleSubmit = async () => {
        if (!accessToken) {
            toast.error('Du er ikke logget ind');
            return;
        }

        try {
            setIsSaving(true);

            if (rabbitProfile.saleDetails && isEditing) {
                // Update existing sale details
                const updated = await UpdateSaleDetails(
                    rabbitProfile.saleDetails.id,
                    formData as Rabbit_UpdateSaleDetailsDTO,
                    accessToken
                );
                onSaleDetailsChange(updated);
                toast.success('Salgsdetaljer opdateret');
                setIsEditing(false);
            } else {
                // Create new sale details
                const created = await CreateSaleDetails(
                    {
                        ...formData as Rabbit_CreateSaleDetailsDTO,
                        rabbitId: rabbitProfile.earCombId
                    },
                    accessToken
                );
                onSaleDetailsChange(created);
                toast.success('Kaninen er nu sat til salg');
                setIsCreating(false);
            }
        } catch (error) {
            toast.error(`Fejl: ${(error as Error).message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!rabbitProfile.saleDetails || !accessToken) return;

        try {
            setIsDeleting(true);
            await DeleteSaleDetails(rabbitProfile.saleDetails.id, accessToken);
            onSaleDetailsChange(null);
            toast.success('Kaninen er ikke længere til salg');
        } catch (error) {
            toast.error(`Fejl ved sletning: ${(error as Error).message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // Start editing with current data
    const startEditing = () => {
        if (!rabbitProfile.saleDetails) return;

        setFormData({
            price: rabbitProfile.saleDetails.price,
            canBeShipped: rabbitProfile.saleDetails.canBeShipped,
            isLitterTrained: rabbitProfile.saleDetails.isLitterTrained,
            isNeutered: rabbitProfile.saleDetails.isNeutered,
            homeEnvironment: rabbitProfile.saleDetails.homeEnvironment,
            saleDescription: rabbitProfile.saleDetails.saleDescription
        });
        setIsEditing(true);
    };

    // Start creating new sale details
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

    // Viser loading hvis auth tjekker eller token hentes
    if (authLoading || isLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                <Spinner size="lg" />
            </div>
        );
    }

    // Viser fejl hvis ikke logget ind eller token ikke kunne hentes
    if (!isLoggedIn || !accessToken) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-500 mb-4">Du skal være logget ind for at administrere salgsprofiler</p>
                <Button color="primary" onPress={() => window.location.reload()}>
                    Prøv igen
                </Button>
            </div>
        );
    }

    // Show form when creating or editing
    if (isCreating || isEditing) {
        return (
            <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50">
                <CardBody>
                    <h2 className="text-xl font-semibold mb-4">
                        {isCreating ? 'Opret salgsprofil' : 'Rediger salgsprofil'}
                    </h2>
                    <SaleDetailsForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSaving={isSaving}
                        isEditing={isEditing}
                    />
                </CardBody>
            </Card>
        );
    }

    // Show sale details if they exist
    if (rabbitProfile.saleDetails) {
        return (
            <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50">
                <CardBody>
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                        <h2 className="text-xl font-semibold">Salgsprofil</h2>
                        <div className="text-2xl font-bold text-amber-500">
                            {formatCurrency(rabbitProfile.saleDetails.price)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3 className="text-zinc-400 text-sm">Dato oprettet</h3>
                            <p>{formatDate(rabbitProfile.saleDetails.dateListed)}</p>
                        </div>
                        <div>
                            <h3 className="text-zinc-400 text-sm">Bosted</h3>
                            <p>{rabbitProfile.saleDetails.homeEnvironment}</p>
                        </div>
                        <div>
                            <h3 className="text-zinc-400 text-sm">Kan leveres</h3>
                            <p>{rabbitProfile.saleDetails.canBeShipped ? 'Ja' : 'Nej'}</p>
                        </div>
                        <div>
                            <h3 className="text-zinc-400 text-sm">Pottetrænet</h3>
                            <p>{rabbitProfile.saleDetails.isLitterTrained ? 'Ja' : 'Nej'}</p>
                        </div>
                        <div>
                            <h3 className="text-zinc-400 text-sm">Neutraliseret</h3>
                            <p>{rabbitProfile.saleDetails.isNeutered ? 'Ja' : 'Nej'}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-zinc-400 text-sm mb-2">Beskrivelse</h3>
                        <div className="bg-zinc-900/50 p-4 rounded-lg">
                            <p className="whitespace-pre-wrap">{rabbitProfile.saleDetails.saleDescription || 'Ingen beskrivelse'}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                        <Button
                            color="primary"
                            onPress={startEditing}
                            isDisabled={isDeleting}
                        >
                            Rediger
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleDelete}
                            isLoading={isDeleting}
                            isDisabled={isSaving}
                        >
                            {isDeleting ? 'Sletter...' : 'Fjern fra salg'}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        );
    }

    // Show "Create sale profile" button if no sale details exist
    return (
        <div className="flex flex-col items-center justify-center p-10 bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50 rounded-lg">
            <p className="text-zinc-400 mb-6">Denne kanin er ikke sat til salg</p>
            <Button
                color="primary"
                onPress={startCreating}
            >
                Opret salgsprofil
            </Button>
        </div>
    );
}