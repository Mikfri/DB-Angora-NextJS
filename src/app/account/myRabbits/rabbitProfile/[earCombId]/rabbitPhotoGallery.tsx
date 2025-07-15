// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitPhotoGallery.tsx
'use client';

import CloudinaryImage from '@/components/cloudinary/CloudinaryImage';
import { Button, Spinner } from '@heroui/react';
import { PhotoPrivateDTO } from '@/api/types/AngoraDTOs';

interface PhotoGalleryProps {
  photos: PhotoPrivateDTO[];
  entityTypeName: string;
  entityId: string;
  isLoading: boolean;
  isLoadingProfileAction: number | null;
  isLoadingDeleteAction: number | null;
  onSetAsProfile: (photoId: number) => Promise<void>;
  onDelete: (photoId: number) => Promise<void>;
  cloudName?: string; // Add cloudName prop
}

export default function PhotoGallery({
  photos,
  entityTypeName,
  entityId,
  isLoading,
  isLoadingProfileAction,
  isLoadingDeleteAction,
  onSetAsProfile,
  onDelete,
  cloudName // Accept cloudName
}: PhotoGalleryProps) {
  if (isLoading && photos.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center">
        <p className="text-zinc-400">
          Der er endnu ikke uploadet billeder til denne {entityTypeName}.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map(photo => (
        <div
          key={photo.id}
          className={`bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border ${photo.isProfilePicture ? 'border-blue-500' : 'border-zinc-700/50'
            } overflow-hidden`}
        >
          <div className="aspect-square relative">
            <CloudinaryImage
              publicId={photo.cloudinaryPublicId}
              cloudName={cloudName}
              width={300}
              height={300}
              alt={`Billede af ${entityTypeName} ${entityId}`}
              className="w-full h-full object-cover"
              fallbackSrc={photo.filePath}
            />
          </div>

          <div className="p-3 flex flex-col gap-2">
            {photo.isProfilePicture ? (
              <p className="text-sm text-blue-500 text-center">Profilbillede</p>
            ) : (
              <Button
                size="sm"
                color="primary"
                className="w-full"
                onPress={() => onSetAsProfile(photo.id)}
                isLoading={isLoadingProfileAction === photo.id}
                isDisabled={isLoadingProfileAction !== null || isLoadingDeleteAction !== null}
              >
                Sæt som profil
              </Button>
            )}

            <Button
              size="sm"
              color="danger"
              variant="ghost"
              className="w-full"
              onPress={() => onDelete(photo.id)}
              isLoading={isLoadingDeleteAction === photo.id}
              isDisabled={isLoadingProfileAction !== null || isLoadingDeleteAction !== null}
            >
              Slet
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}