// src/components/modals/login/LoginModal.tsx
'use client'
import { Modal } from '@/components/ui/heroui';
import LoginForm from "./loginForm";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Modal.Backdrop variant="blur">
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Heading className="text-2xl text-gray-700">Log ind</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <LoginForm onSuccess={onClose} />
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
