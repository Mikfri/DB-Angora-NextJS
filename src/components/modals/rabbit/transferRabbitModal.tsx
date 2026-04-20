// src/components/modals/rabbit/transferRabbitModal.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { Modal, Button, Input, TextArea } from '@/components/ui/heroui';
import { TransferRequest_CreateDTO } from '@/api/types/AngoraDTOs';

interface TransferOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  rabbitName: string;
  rabbitEarCombId: string;
  onSubmit: (data: TransferRequest_CreateDTO) => Promise<boolean>;
  isSubmitting?: boolean;
}

export default function TransferOwnershipModal({
  isOpen,
  onClose,
  rabbitName,
  rabbitEarCombId,
  onSubmit,
  isSubmitting = false
}: TransferOwnershipModalProps) {
  const [formData, setFormData] = useState<TransferRequest_CreateDTO>({
    rabbit_EarCombId: rabbitEarCombId,
    recipient_BreederRegNo: '',
    price: 0,
    saleConditions: ''
  });
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Validér data
    if (!formData.recipient_BreederRegNo.trim()) {
      return; // Validering håndteres i server action
    }
    
    // Sikrer at rabbitEarCombId altid er opdateret
    const dataToSubmit = {
      ...formData,
      rabbit_EarCombId: rabbitEarCombId
    };
    
    const success = await onSubmit(dataToSubmit);
    
    // Reset form if successful
    if (success) {
      setFormData({
        rabbit_EarCombId: rabbitEarCombId,
        recipient_BreederRegNo: '',
        price: 0,
        saleConditions: ''
      });
    }
  }, [formData, rabbitEarCombId, onSubmit]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) onClose(); }}
    >
      <Modal.Backdrop variant="blur">
        <Modal.Container>
          <Modal.Dialog className="dark">
            <Modal.Header>
              <Modal.Heading>Anmod om ejerskabsoverdragelse</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-4">
                <div>
                  <p className="mb-2"><strong>Kanin:</strong> {rabbitName} ({rabbitEarCombId})</p>
                </div>

                <div>
                  <label htmlFor="recipient_BreederRegNo" className="block text-sm font-medium mb-1">
                    Modtagers avlernummer *
                  </label>
                  <Input
                    id="recipient_BreederRegNo"
                    name="recipient_BreederRegNo"
                    value={formData.recipient_BreederRegNo}
                    onChange={handleChange}
                    placeholder="f.eks. 3X12"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="saleConditions" className="block text-sm font-medium mb-1">
                    Salgsbetingelser (valgfrit)
                  </label>
                  <TextArea
                    id="saleConditions"
                    name="saleConditions"
                    value={formData.saleConditions || ''}
                    onChange={handleChange}
                    placeholder="Eventuelle betingelser for overdragelsen..."
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={onClose}
                isDisabled={isSubmitting}
              >
                Annuller
              </Button>
              <Button
                variant="primary"
                onPress={handleSubmit}
                isPending={isSubmitting}
                isDisabled={isSubmitting}
              >
                Send anmodning
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
