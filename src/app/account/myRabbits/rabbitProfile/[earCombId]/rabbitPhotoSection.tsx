// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitPhotoSection.tsx
'use client';

import { useState, useCallback } from 'react';
import { CloudinaryUploadConfigDTO, CloudinaryPhotoRegistryRequestDTO } from '@/api/types/AngoraDTOs';
import { Button } from "@heroui/react";
import SimpleCloudinaryWidget from '@/components/cloudinary/SimpleCloudinaryWidget';
import { useRabbitProfile } from '@/contexts/RabbitProfileContext';
import { getRabbitPhotoUploadPermission } from '@/app/actions/rabbit/photoPermission';
import { registerPhoto } from '@/app/actions/photo/registerPhoto';
import { setAsProfilePhoto } from '@/app/actions/photo/setAsProfilePicture';
import { deletePhoto } from '@/app/actions/photo/deletePhoto';
import { useAuthStore } from '@/store/authStore';
import RabbitPhotoCarousel from './rabbitPhotoCarousel';

interface PhotoSectionProps {
  earCombId: string;
}

export default function PhotoSection({ earCombId }: PhotoSectionProps) {
  // Vi bruger context i stedet for at hente fotos igen
  const { profile, refreshProfile } = useRabbitProfile();
  const photos = profile?.photos || [];
  
  // Hent userIdentity fra auth store
  const userIdentity = useAuthStore(state => state.userIdentity);

  // Upload widget states
  const [isLoadingUploadConfig, setIsLoadingUploadConfig] = useState(false);
  const [isLoadingProfileAction, setIsLoadingProfileAction] = useState<number | null>(null);
  const [isLoadingDeleteAction, setIsLoadingDeleteAction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadConfig, setUploadConfig] = useState<CloudinaryUploadConfigDTO | null>(null);
  // Få billedcount direkte fra userIdentity claims
  const maxImageCount = userIdentity?.claims?.rabbitImageCount || 0;
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

  // Beregn om det maksimale antal billeder er nået
  const isMaxImagesReached = maxImageCount > 0 && photos.length >= maxImageCount;

  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50 overflow-hidden h-full flex flex-col">
      {/* Header med titel og upload-knap */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-700/50">
        <div className="flex items-center gap-2">
          <h3 className="text-zinc-100 font-medium">Billeder</h3>
          
          {/* Billedtæller - kun vist når maksimum er kendt */}
          {maxImageCount > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isMaxImagesReached 
                ? 'bg-amber-500/20 text-amber-400' 
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {photos.length} / {maxImageCount}
            </span>
          )}
        </div>
        
        <Button
          size="sm"
          color="primary"
          onPress={handleShowWidget}
          isDisabled={isLoadingUploadConfig || isMaxImagesReached}
          isLoading={isLoadingUploadConfig}
        >
          {isLoadingUploadConfig 
            ? 'Indlæser...' 
            : isMaxImagesReached 
              ? 'Max nået' 
              : 'Upload'
          }
        </Button>
      </div>

      {/* Fejlmeddelelse hvis nødvendigt */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 p-3 m-3 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Karusel komponent */}
      <div className="flex-grow p-4">
        <RabbitPhotoCarousel
          photos={photos}
          entityTypeName={entityTypeName}
          entityId={earCombId}
          isLoading={false}
          isLoadingProfileAction={isLoadingProfileAction}
          isLoadingDeleteAction={isLoadingDeleteAction}
          onSetAsProfile={handleSetAsProfile}
          onDelete={handleDeletePhoto}
        />
      </div>

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