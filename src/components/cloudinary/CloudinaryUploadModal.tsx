'use client';

import { useState, useCallback } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from '@heroui/react';
import { CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO } from '@/api/types/AngoraDTOs';
import dynamic from 'next/dynamic';

// Dynamisk import af widgeten - denne indlæses kun når modalen åbnes
const DirectCloudinaryUploadWidget = dynamic(
  () => import('./DirectCloudinaryUploadWidget'),
  {
    loading: () => <div className="py-8 flex justify-center"><Spinner size="lg" /></div>,
    ssr: false // Vigtigt: Deaktiverer server-side rendering
  }
);

interface CloudinaryUploadModalProps {
  uploadConfig: CloudinaryUploadConfigDTO;
  maxImageCount: number;
  currentImageCount: number;
  onPhotoUploaded: (photoData: CloudinaryPhotoRegistryRequestDTO) => Promise<void>;
}

export default function CloudinaryUploadModal({
  uploadConfig,
  maxImageCount,
  currentImageCount,
  onPhotoUploaded
}: CloudinaryUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [widgetKey, setWidgetKey] = useState(`upload-${Date.now()}`);

  const remainingUploads = maxImageCount - currentImageCount;
  const isDisabled = remainingUploads <= 0;

  const handleUpload = useCallback(async (data: CloudinaryPhotoRegistryRequestDTO) => {
    await onPhotoUploaded(data);
    setUploadComplete(true);
    // Vi lukker ikke modalen automatisk, så brugeren kan se success-meddelelsen
  }, [onPhotoUploaded]);

  // Tilføj en console.log til handleOpenModal
  const handleOpenModal = useCallback(() => {
    console.log("Opening modal"); // Tilføj dette
    setIsOpen(true);
    setUploadComplete(false);
    setWidgetKey(`upload-${Date.now()}`);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    // Giver tid til at widgetten destrueres ordentligt
    setTimeout(() => {
      setUploadComplete(false);
    }, 500);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          color="primary"
          onPress={handleOpenModal}
          isDisabled={isDisabled}
          className="w-full"
        >
          Upload Billede
        </Button>

        <p className="text-xs text-zinc-400">
          {remainingUploads > 0
            ? `Du kan uploade ${remainingUploads} billede${remainingUploads !== 1 ? 'r' : ''} mere`
            : 'Du har nået grænsen for antal billeder'
          }
        </p>
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={handleCloseModal}
          size="md"
          onOpenChange={(open) => console.log("Modal open state changed:", open)}
        >
          <ModalHeader>
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-semibold">Upload Billede</h3>
              <Button
                variant="ghost"
                color="default"
                size="sm"
                isIconOnly
                onPress={handleCloseModal}
                className="ml-auto"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </div>
          </ModalHeader>

          <ModalBody>
            {uploadComplete ? (
              <div className="py-6 text-center">
                <div className="mb-4 text-green-500 flex justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Billedet blev uploadet!</h3>
                <p className="text-zinc-400 mb-4">Dit billede er nu tilgængeligt i galleriet.</p>
              </div>
            ) : (
              <div key={widgetKey}>
                <DirectCloudinaryUploadWidget
                  uploadConfig={uploadConfig}
                  maxImageCount={maxImageCount}
                  currentImageCount={currentImageCount}
                  onPhotoUploaded={handleUpload}
                  containerKey={widgetKey}
                />
              </div>
            )}
          </ModalBody>

          {uploadComplete && (
            <ModalFooter>
              <Button color="primary" onPress={handleCloseModal}>
                Luk
              </Button>
            </ModalFooter>
          )}
        </Modal>
      )}
    </>
  );
}