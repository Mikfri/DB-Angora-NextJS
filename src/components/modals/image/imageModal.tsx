// src/components/modals/image/imageModal.tsx

'use client';
import Image from 'next/image';
import { Modal } from '@/components/ui/heroui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  alt?: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, alt }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) onClose(); }}
    >
      <Modal.Backdrop variant="blur">
        <Modal.Container className="items-center justify-center">
          <Modal.Dialog
            className="bg-transparent shadow-none max-w-[95vw] max-h-[95vh] overflow-auto flex items-center justify-center min-h-screen"
            onClick={onClose}
          >
            {imageUrl && (
              <div
                className="relative flex flex-col items-center justify-center mt-8"
                onClick={e => e.stopPropagation()}
              >
                <div className="relative max-w-[90vw] max-h-[90vh]" style={{ width: 'fit-content', height: 'fit-content' }}>
                  <Image
                    src={imageUrl}
                    alt={alt || "Billede"}
                    width={1920}
                    height={1080}
                    unoptimized
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
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
