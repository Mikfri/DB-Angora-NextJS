// src/components/modals/deleteRabbitModal.tsx
'use client'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    rabbitName: string;
    isDeleting: boolean;
}

export default function DeleteRabbitModal({ isOpen, onClose, onConfirm, rabbitName, isDeleting }: Props) {
    return (
        <Modal className="dark"
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-gray-700">
                    Bekræft sletning
                </ModalHeader>
                <ModalBody>
                    <p className="text-gray-700 font-bold">Er du sikker på, at du vil slette kaninen &quot;{rabbitName}&quot;?</p>
                    <p className="text-danger font-bold">Denne handling kan ikke fortrydes.</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="default"
                        variant="light"
                        onPress={onClose}
                        disabled={isDeleting}
                    >
                        Annuller
                    </Button>
                    <Button
                        color="danger"
                        onPress={onConfirm}
                        isLoading={isDeleting}
                    >
                        {isDeleting ? 'Sletter...' : 'Slet kanin'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}