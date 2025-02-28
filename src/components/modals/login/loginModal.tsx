// src/components/modals/login/LoginModal.tsx
'use client'
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import LoginForm from '@/components/modals/login/loginForm';

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