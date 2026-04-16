// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitSaleSection.tsx
"use client";

import { Rabbit_ProfileDTO, RabbitSaleProfilePrivateDTO } from '@/api/types/AngoraDTOs';
import { Button, Card, Spinner } from '@/components/ui/heroui';
import { useAuthStore } from '@/store/authStore';
import SaleDetailsForm from './saleDetailsForm';
import { useSaleDetailsHandler } from '@/hooks/rabbits/useRabbitSaleDetailsHandler';
import SaleDetailsView from './rabbitSaleDetailsView';

interface RabbitSaleSectionProps {
  rabbitProfile: Rabbit_ProfileDTO;
  onSaleDetailsChange: (saleDetails: RabbitSaleProfilePrivateDTO | null) => void;
}

export default function RabbitSaleSection({
  rabbitProfile,
  onSaleDetailsChange
}: RabbitSaleSectionProps) {
  // Få auth state fra useAuthStore - vi bruger stadig dette for authentication check
  const { isLoggedIn, isLoading: authLoading } = useAuthStore();
  
  // Brug vores custom hook til at håndtere al logik
  const {
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
  } = useSaleDetailsHandler({ rabbitProfile, onSaleDetailsChange });

  // Viser loading hvis auth tjekker
  if (authLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Spinner size="lg" />
      </div>
    );
  }

  // Viser fejl hvis ikke logget ind
  if (!isLoggedIn) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4">Du skal være logget ind for at administrere salgsprofiler</p>
        <a href="/" className="inline-block"><Button variant="primary">Log ind</Button></a>
      </div>
    );
  }

  // Viser form hvis vi er i creating eller editing tilstand
  if (isCreating || isEditing) {
    return (
      <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50">
        <Card.Content>
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Rediger salgsprofil' : 'Opret salgsprofil'}
          </h2>
          
          <SaleDetailsForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSaving={isSaving}
            isEditing={isEditing}
          />
        </Card.Content>
      </Card>
    );
  }

  // Vis salgsoplyningerne hvis de eksisterer
  if (localSaleDetails) {
    return (
      <SaleDetailsView 
        saleDetails={localSaleDetails}
        onEdit={startEditing}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    );
  }

  // Show create button if no sale details exist
  return (
    <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50">
      <Card.Content>
        <div className="text-center py-6">
          <h2 className="text-xl font-semibold mb-4">Denne kanin er ikke sat til salg</h2>
          <Button 
            variant="primary"
            onPress={startCreating}
          >
            Sæt til salg
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}
