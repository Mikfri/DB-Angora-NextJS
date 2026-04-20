// src/components/modals/rabbit/deleteRabbitModal.tsx
'use client';
import { ConfirmModal } from '@/components/ui/custom/modals';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    rabbitName: string;
    isDeleting: boolean;
}

export default function DeleteRabbitModal({ isOpen, onClose, onConfirm, rabbitName, isDeleting }: Props) {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Bekræft sletning"
            status="danger"
            confirmLabel="Slet kanin"
            isPending={isDeleting}
        >
            <p className="text-foreground/80 font-bold">Er du sikker på, at du vil slette kaninen &quot;{rabbitName}&quot;?</p>
            <p className="text-danger font-bold">Denne handling kan ikke fortrydes.</p>
        </ConfirmModal>
    );
}
