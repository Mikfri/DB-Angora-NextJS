// src/components/modals/LoginModal.tsx
'use client'
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import LoginForm from '@/components/forms/loginForm';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            placement="center"
            backdrop="blur"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-2xl text-gray-700">Log ind</ModalHeader>
                <ModalBody>
                    <LoginForm onSuccess={onClose} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}