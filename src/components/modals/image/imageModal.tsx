// src/components/modals/image/imageModal.tsx

'use client';
import { Modal, ModalContent } from "@heroui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  alt?: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, alt }: Props) {
  if (!isOpen || !imageUrl) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      backdrop="blur"
      size="full"
      hideCloseButton={true}
      classNames={{
        wrapper: "items-center justify-center",
        base: "bg-transparent shadow-none max-w-[95vw] max-h-[95vh]"
      }}
    >
      <ModalContent
        className="bg-transparent shadow-none overflow-auto flex items-center justify-center min-h-screen"
        onClick={onClose} // Klik på baggrund lukker modal
      >
        <div
          className="relative flex flex-col items-center justify-center"
          style={{ marginTop: '2rem' }}
          onClick={e => e.stopPropagation()} // Klik på billedet lukker ikke modal
        >
          <img
            src={imageUrl}
            alt={alt || "Billede"}
            style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: 'none' }}
            className="rounded-lg shadow-2xl"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold bg-zinc-800/70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-zinc-700"
            onClick={onClose}
            aria-label="Luk billede"
            style={{ zIndex: 10 }}
          >
            ×
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
}