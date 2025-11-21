// src/components/modals/image/imageModal.tsx

'use client';
import Image from 'next/image';
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
        onClick={onClose}
      >
        <div
          className="relative flex flex-col items-center justify-center mt-8"
          onClick={e => e.stopPropagation()}
        >
          {/* Next.js Image med relativ container */}
          <div className="relative max-w-[90vw] max-h-[90vh]" style={{ width: 'fit-content', height: 'fit-content' }}>
            <Image
              src={imageUrl}
              alt={alt || "Billede"}
              width={1920}
              height={1080}
              unoptimized // Spring optimering over (brug original)
              sizes="90vw"
              className="rounded-lg shadow-2xl w-auto h-auto max-w-[90vw] max-h-[90vh]"
              quality={100}
              style={{ objectFit: 'contain' }}
            />
          </div>
          
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold bg-zinc-800/70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-zinc-700 z-10"
            onClick={onClose}
            aria-label="Luk billede"
          >
            ×
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
}