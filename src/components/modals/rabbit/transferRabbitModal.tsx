// src/components/modals/rabbit/transferRabbitModal.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@heroui/react";
import { CreateTransferRequest } from '@/api/endpoints/transferRequestsController';
import { TransferRequest_CreateDTO } from '@/api/types/AngoraDTOs';
import { toast } from 'react-toastify';

interface TransferOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  rabbitName: string;
  rabbitEarCombId: string;
}

export default function TransferOwnershipModal({
  isOpen,
  onClose,
  rabbitName,
  rabbitEarCombId
}: TransferOwnershipModalProps) {
  const [formData, setFormData] = useState<TransferRequest_CreateDTO>({
    rabbit_EarCombId: rabbitEarCombId,
    recipent_BreederRegNo: '',
    price: 0,
    saleConditions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.recipent_BreederRegNo.trim()) {
      toast.error('Modtagerens avlernummer er påkrævet');
      return;
    }

    setIsSubmitting(true);
    try {
      const tokenResponse = await fetch('/api/auth/token');
      if (!tokenResponse.ok) throw new Error('Kunne ikke hente adgangstoken');
      const { accessToken } = await tokenResponse.json();
      
      await CreateTransferRequest(formData, accessToken);
      
      toast.success('Ejerskabsoverdragelse anmodning sendt');
      onClose();
    } catch (error) {
      console.error('Fejl ved oprettelse af ejerskabsoverdragelse:', error);
      toast.error(`Der skete en fejl: ${error instanceof Error ? error.message : 'Ukendt fejl'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onClose]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      hideCloseButton={isSubmitting}
      isDismissable={!isSubmitting}
    >
      <ModalContent>
        <ModalHeader>Anmod om ejerskabsoverdragelse</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <p className="mb-2"><strong>Kanin:</strong> {rabbitName} ({rabbitEarCombId})</p>
            </div>
            
            <div>
              <label htmlFor="recipent_BreederRegNo" className="block text-sm font-medium mb-1">
                Modtagers avlernummer *
              </label>
              <Input
                id="recipent_BreederRegNo"
                name="recipent_BreederRegNo"
                value={formData.recipent_BreederRegNo}
                onChange={handleChange}
                placeholder="f.eks. 3X12"
                isDisabled={isSubmitting}
                required
              />
              <p className="mt-1 text-xs text-zinc-400">
                Du finder avlerens nummer på deres profil eller under medlemslisten.
              </p>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Pris (DKK)
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                value={String(formData.price)}
                onChange={handleChange}
                placeholder="0"
                isDisabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="saleConditions" className="block text-sm font-medium mb-1">
                Salgsbetingelser (valgfrit)
              </label>
              <Textarea
                id="saleConditions"
                name="saleConditions"
                value={formData.saleConditions || ''}
                onChange={handleChange}
                placeholder="Eventuelle betingelser for overdragelsen..."
                minRows={3}
                isDisabled={isSubmitting}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="secondary" 
            onPress={onClose} 
            isDisabled={isSubmitting}
          >
            Annuller
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Send anmodning
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}