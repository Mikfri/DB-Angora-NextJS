// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitPhotoSection.tsx
'use client';

import { useState, useCallback } from 'react';
import { CloudinaryUploadConfigDTO, CloudinaryPhotoRegistryRequestDTO } from '@/api/types/AngoraDTOs';
import { Button } from "@heroui/react";
import PhotoGallery from './rabbitPhotoGallery';
import SimpleCloudinaryWidget from '@/components/cloudinary/SimpleCloudinaryWidget';
import { useRabbitProfile } from '@/contexts/RabbitProfileContext';
import { getRabbitPhotoUploadPermission } from '@/app/actions/rabbit/photoPermission';
import { registerPhoto } from '@/app/actions/photo/registerPhoto';
import { setAsProfilePhoto } from '@/app/actions/photo/setAsProfilePicture';
import { deletePhoto } from '@/app/actions/photo/deletePhoto';

interface PhotoSectionProps {
  earCombId: string;
}

export default function PhotoSection({ earCombId }: PhotoSectionProps) {
  // Vi bruger context i stedet for at hente fotos igen
  const { profile, refreshProfile } = useRabbitProfile();
  const photos = profile?.photos || [];

  // Upload widget states
  const [isLoadingUploadConfig, setIsLoadingUploadConfig] = useState(false);
  const [isLoadingProfileAction, setIsLoadingProfileAction] = useState<number | null>(null);
  const [isLoadingDeleteAction, setIsLoadingDeleteAction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadConfig, setUploadConfig] = useState<CloudinaryUploadConfigDTO | null>(null);
  const [maxImageCount, setMaxImageCount] = useState(0);
  const [showWidget, setShowWidget] = useState(false);
  const [widgetKey, setWidgetKey] = useState(`widget-${Date.now()}`);

  // Hent upload tilladelse
  const loadUploadPermission = useCallback(async () => {
    try {
      setIsLoadingUploadConfig(true);
      setError(null);
      
      const result = await getRabbitPhotoUploadPermission(earCombId);
      
      if (result.success && result.data) {
        setUploadConfig(result.data);
        setMaxImageCount(result.maxImageCount || 0);
      } else {
        setError(result.error || 'Kunne ikke få upload-tilladelse');
      }
    } catch (err) {
      console.error('Error getting upload permission:', err);
      setError('Der opstod en fejl ved anmodning om upload-tilladelse');
    } finally {
      setIsLoadingUploadConfig(false);
    }
  }, [earCombId]);

  // Håndter foto upload fra Cloudinary
  const handlePhotoUploaded = async (photoData: CloudinaryPhotoRegistryRequestDTO): Promise<void> => {
    try {
      await registerPhoto(photoData);
      await refreshProfile(); // Opdater profilen med den nye billedliste
    } catch (err) {
      console.error('Error registering photo:', err);
      setError('Der opstod en fejl ved registrering af billedet');
    }
  };

  // Widget håndtering
  const handleWidgetClose = useCallback(() => {
    setShowWidget(false);
  }, []);

  const handleShowWidget = useCallback(async () => {
    if (!uploadConfig) {
      await loadUploadPermission();
    }
    
    setWidgetKey(`widget-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    setShowWidget(true);
  }, [uploadConfig, loadUploadPermission]);

  // Sæt som profilbillede
  const handleSetAsProfile = async (photoId: number) => {
    try {
      setIsLoadingProfileAction(photoId);
      await setAsProfilePhoto(photoId);
      await refreshProfile(); // Opdater profilen efter ændring
    } catch (err) {
      console.error('Error setting profile photo:', err);
      setError('Der opstod en fejl ved ændring af profilbillede');
    } finally {
      setIsLoadingProfileAction(null);
    }
  };

  // Slet foto
  const handleDeletePhoto = async (photoId: number) => {
    try {
      setIsLoadingDeleteAction(photoId);
      await deletePhoto(photoId);
      await refreshProfile(); // Opdater profilen efter sletning
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Der opstod en fejl ved sletning af billedet');
    } finally {
      setIsLoadingDeleteAction(null);
    }
  };

  // Udled entity type (for UI-visning)
  const entityTypeName = uploadConfig?.entityType === 'Rabbit'
    ? 'kanin'
    : uploadConfig?.entityType?.toLowerCase() ?? 'kanin';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">Billeder</h3>
        
        <div className="flex gap-2">
          {photos.length > 0 && (
            <Button
              size="sm"
              color="primary"
              variant="light"
              onPress={refreshProfile}
              isDisabled={isLoadingProfileAction !== null || isLoadingDeleteAction !== null}
            >
              Opdater
            </Button>
          )}
          
          <Button
            size="sm"
            color="primary"
            onPress={handleShowWidget}
            isDisabled={isLoadingUploadConfig || (maxImageCount > 0 && photos.length >= maxImageCount)}
            isLoading={isLoadingUploadConfig}
          >
            {isLoadingUploadConfig ? 'Indlæser...' : 'Upload billede'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-lg mb-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Viser billeder med det PhotoGallery component du allerede har */}
      <PhotoGallery
        photos={photos}
        entityTypeName={entityTypeName}
        entityId={earCombId}
        isLoading={false} // Aldrig loading, da vi allerede har billederne
        isLoadingProfileAction={isLoadingProfileAction}
        isLoadingDeleteAction={isLoadingDeleteAction}
        onSetAsProfile={handleSetAsProfile}
        onDelete={handleDeletePhoto}
      />

      {/* Cloudinary upload widget */}
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