// src/app/account/profile/[userProfileId]/userPhotoSection.tsx

'use client';

import { useState, useCallback } from 'react';
import {
  CloudinaryUploadConfigDTO,
  CloudinaryPhotoRegistryRequestDTO,
  PhotoPrivateDTO
} from '@/api/types/AngoraDTOs';
import { Button } from "@heroui/react";
import SimpleCloudinaryWidget from '@/components/cloudinary/SimpleCloudinaryWidget';
import UserPhotoGallery from './userPhotoGallery';
import {
    getUserProfilePhotoUploadPermission,
    registerUserProfilePhoto,
    updateUserProfilePhoto,
    deleteUserProfilePhoto,
} from '@/app/actions/account/accountActions';

interface Props {
  userProfileId: string;
  photos: PhotoPrivateDTO[];
  refreshProfile: () => Promise<void>;
}

export default function UserPhotoSection({ userProfileId, photos, refreshProfile }: Props) {
  const [isLoadingUploadConfig, setIsLoadingUploadConfig] = useState(false);
  const [isLoadingProfileAction, setIsLoadingProfileAction] = useState<number | null>(null);
  const [isLoadingDeleteAction, setIsLoadingDeleteAction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadConfig, setUploadConfig] = useState<CloudinaryUploadConfigDTO | null>(null);
  const [showWidget, setShowWidget] = useState(false);
  const [widgetKey, setWidgetKey] = useState(`widget-${Date.now()}`);

  // Hent upload tilladelse
  const loadUploadPermission = useCallback(async () => {
    setIsLoadingUploadConfig(true);
    setError(null);
    const result = await getUserProfilePhotoUploadPermission(userProfileId);
    if (result.success && result.data) {
      setUploadConfig(result.data);
    } else {
      setError(result.error || 'Kunne ikke få upload-tilladelse');
    }
    setIsLoadingUploadConfig(false);
  }, [userProfileId]);

  // Håndter foto upload fra Cloudinary
  const handlePhotoUploaded = async (photoData: CloudinaryPhotoRegistryRequestDTO) => {
    const result = await registerUserProfilePhoto(userProfileId, photoData);
    if (!result.success) setError(result.error || 'Fejl ved registrering');
    await refreshProfile();
  };

  // Widget håndtering
  const handleWidgetClose = useCallback(() => setShowWidget(false), []);
  const handleShowWidget = useCallback(async () => {
    if (!uploadConfig) await loadUploadPermission();
    setWidgetKey(`widget-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    setShowWidget(true);
  }, [uploadConfig, loadUploadPermission]);

  // Sæt som profilbillede
  const handleSetAsProfile = async (photoId: number) => {
    setIsLoadingProfileAction(photoId);
    const result = await updateUserProfilePhoto(userProfileId, photoId);
    if (!result.success) setError(result.error || 'Der opstod en fejl ved ændring af profilbillede');
    await refreshProfile();
    setIsLoadingProfileAction(null);
  };

const handleDeletePhoto = async (photoId: number) => {
  setIsLoadingDeleteAction(photoId);
  setError(null);
  try {
    const result = await deleteUserProfilePhoto({
      entityStringId: userProfileId,
      photoId
    });
    if (!result.success) setError(result.error || 'Der opstod en fejl ved sletning af billede');
    await refreshProfile();
  } catch (err) {
    setError('Uventet fejl ved sletning af billede');
  }
  setIsLoadingDeleteAction(null);
};

  return (
    <div className="bg-zinc-800/80 rounded-lg border border-zinc-700/50 overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-zinc-700/50">
        <h3 className="text-zinc-100 font-medium">Profilbilleder</h3>
        <Button
          size="sm"
          color="primary"
          onPress={handleShowWidget}
          isDisabled={isLoadingUploadConfig}
          isLoading={isLoadingUploadConfig}
        >
          {isLoadingUploadConfig ? 'Indlæser...' : 'Upload'}
        </Button>
      </div>
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 p-3 m-3 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
      <div className="flex-grow p-4">
        <UserPhotoGallery
          photos={photos}
          entityTypeName="bruger"
          entityId={userProfileId}
          isLoading={false}
          isLoadingProfileAction={isLoadingProfileAction}
          isLoadingDeleteAction={isLoadingDeleteAction}
          onSetAsProfile={handleSetAsProfile}
          onDelete={handleDeletePhoto}
        />
      </div>
      {showWidget && uploadConfig && (
        <SimpleCloudinaryWidget
          uploadConfig={uploadConfig}
          onPhotoUploaded={handlePhotoUploaded}
          onComplete={refreshProfile}
          onClose={handleWidgetClose}
          widgetKey={widgetKey}
          forceReload={true}
        />
      )}
    </div>
  );
}