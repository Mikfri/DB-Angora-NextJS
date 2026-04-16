// src/components/modals/deleteRabbitModal.tsx
'use client'
import { Modal, Button } from '@/components/ui/heroui';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    rabbitName: string;
    isDeleting: boolean;
}

export default function DeleteRabbitModal({ isOpen, onClose, onConfirm, rabbitName, isDeleting }: Props) {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Modal.Backdrop variant="blur">
                <Modal.Container>
                    <Modal.Dialog className="dark">
                        <Modal.Header>
                            <Modal.Heading>Bekræft sletning</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="text-gray-700 font-bold">Er du sikker på, at du vil slette kaninen &quot;{rabbitName}&quot;?</p>
                            <p className="text-danger font-bold">Denne handling kan ikke fortrydes.</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="ghost"
                                onPress={onClose}
                                isDisabled={isDeleting}
                            >
                                Annuller
                            </Button>
                            <Button
                                variant="danger"
                                onPress={onConfirm}
                                isPending={isDeleting}
                            >
                                {isDeleting ? 'Sletter...' : 'Slet kanin'}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
