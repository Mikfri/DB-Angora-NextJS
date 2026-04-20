// src/components/modals/blog/deleteBlogModal.tsx
'use client';
import { ConfirmModal } from '@/components/ui/custom/modals';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    blogTitle: string;
    isDeleting: boolean;
}

export default function DeleteBlogModal({ isOpen, onClose, onConfirm, blogTitle, isDeleting }: Props) {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Bekræft sletning"
            status="danger"
            confirmLabel="Slet blog"
            isPending={isDeleting}
        >
            <p className="text-foreground/80 font-bold">
                Er du sikker på, at du vil slette blogindlægget &quot;{blogTitle}&quot;?
            </p>
            <p className="text-danger font-bold">
                Denne handling kan ikke fortrydes. Alle relaterede fotos vil også blive slettet.
            </p>
        </ConfirmModal>
    );
}
