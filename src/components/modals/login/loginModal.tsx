// src/components/modals/login/LoginModal.tsx
'use client'
import { Modal } from '@/components/ui/heroui';
import LoginForm from "./loginForm";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
    return (
        <Modal>
            <Modal.Backdrop
                variant="blur"
                isOpen={isOpen}
                onOpenChange={(open) => { if (!open) onClose(); }}
            >
                <Modal.Container size="md" placement="center">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Heading>Log ind</Modal.Heading>
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
