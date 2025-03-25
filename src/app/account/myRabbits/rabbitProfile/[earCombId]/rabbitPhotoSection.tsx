// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitPhotoSection.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@heroui/react";
import { Photo_DTO, CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO } from '@/api/types/AngoraDTOs';
import { getRabbitPhotoUploadPermission } from '@/app/actions/rabbit/photoPermission';
import { registerPhoto } from '@/app/actions/photo/registerPhoto';
import { getPhotos } from '@/app/actions/photo/getPhotos';
import { setAsProfilePhoto } from '@/app/actions/photo/setAsProfilePicture';
import { deletePhoto } from '@/app/actions/photo/deletePhoto';
import { toast } from 'react-toastify';
import PhotoGallery from './rabbitPhotoGallery';
import SimpleModal from '@/components/cloudinary/SimpleModal';
import IsolatedCloudinaryUploader from '@/components/cloudinary/IsolatedCloudinaryUploader';

// Cache typer med bedre TypeScript diskriminering
type CacheTypes = {
  photos: Photo_DTO[];
  uploadConfig: {
    success: boolean;
    data?: CloudinaryUploadConfigDTO;
    maxImageCount?: number;
    error?: string;
  };
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Forbedret cache håndtering med generics
const API_CACHE = new Map<string, CacheEntry<unknown>>();
const CACHE_LIFETIME = 30_000; // 30 sekunder cache (brug numeric separator)

interface PhotoSectionProps {
  earCombId: string;
}

export default function PhotoSection({ earCombId }: PhotoSectionProps) {
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [isLoadingProfileAction, setIsLoadingProfileAction] = useState<number | null>(null);
  const [isLoadingDeleteAction, setIsLoadingDeleteAction] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Photo_DTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadConfig, setUploadConfig] = useState<CloudinaryUploadConfigDTO | null>(null);
  const [maxImageCount, setMaxImageCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [widgetKey, setWidgetKey] = useState(`upload-${Date.now()}`);

  // Generic cache helper med type safety - uden ubrugt parameter
  const getCachedData = <K extends keyof CacheTypes>(
    cacheKey: string
  ): { data: CacheTypes[K] | null, isValid: boolean } => {
    const cachedEntry = API_CACHE.get(cacheKey) as CacheEntry<CacheTypes[K]> | undefined;
    const now = Date.now();

    if (cachedEntry && (now - cachedEntry.timestamp < CACHE_LIFETIME)) {
      return { data: cachedEntry.data, isValid: true };
    }

    return { data: null, isValid: false };
  };

  // Generic cache setter med type safety - uden ubrugt parameter
  const setCachedData = <K extends keyof CacheTypes>(
    cacheKey: string,
    data: CacheTypes[K]
  ): void => {
    API_CACHE.set(cacheKey, {
      data,
      timestamp: Date.now()
    } as CacheEntry<unknown>);
  };

  // Hent fotos for kaninen - med forbedret caching
  const loadPhotos = useCallback(async () => {
    try {
      // Check cache først med vores typesikre helper
      const cacheKey = `photos-${earCombId}`;
      const { data: cachedPhotos, isValid } = getCachedData<'photos'>(cacheKey);

      if (isValid && cachedPhotos) {
        console.log("🔄 Returning cached photos");
        setPhotos(cachedPhotos);
        setIsLoadingPhotos(false);
        return;
      }

      setIsLoadingPhotos(true);
      setError(null);

      const result = await getPhotos('Rabbit', earCombId);

      if (!result.success) {
        setError(result.error ?? "Ukendt fejl ved indlæsning af billeder");
        return;
      }

      // Cache resultat med vores typesikre helper
      setCachedData<'photos'>(cacheKey, result.photos);
      setPhotos(result.photos);
    } catch (err) {
      console.error("Error loading photos:", err);
      setError(err instanceof Error ? err.message : "Der opstod en fejl ved indlæsning af billeder");
    } finally {
      setIsLoadingPhotos(false);
    }
  }, [earCombId]);

  // Hent uploadConfig - med forbedret caching
  const loadUploadPermission = useCallback(async () => {
    try {
      // Check cache først med vores typesikre helper
      const cacheKey = `upload-config-${earCombId}`;
      const { data: cachedConfig, isValid } = getCachedData<'uploadConfig'>(cacheKey);

      if (isValid && cachedConfig?.data) {
        console.log("🔄 Returning cached upload config");
        setUploadConfig(cachedConfig.data);
        setMaxImageCount(cachedConfig.maxImageCount ?? 0);
        return;
      }

      setError(null);

      const result = await getRabbitPhotoUploadPermission(earCombId);

      if (!result.success || !result.data) {
        setError(result.error ?? "Kunne ikke hente upload konfiguration");
        return;
      }

      // Cache resultat med vores typesikre helper
      setCachedData<'uploadConfig'>(cacheKey, result);

      setUploadConfig(result.data);
      setMaxImageCount(result.maxImageCount ?? 0);
    } catch (err) {
      console.error("Error getting upload permission:", err);
      setError(err instanceof Error ? err.message : "Der opstod en fejl ved anmodning om upload konfiguration");
    }
  }, [earCombId]);

  // Initial load
  useEffect(() => {
    loadPhotos();
    loadUploadPermission();
  }, [loadPhotos, loadUploadPermission]);

  // Håndter foto upload fra Cloudinary
  const handlePhotoUploaded = async (photoData: CloudinaryPhotoRegistryRequestDTO): Promise<void> => {
    try {
      const result = await registerPhoto(photoData);

      if (!result.success) {
        toast.error(result.error ?? "Kunne ikke registrere billede");
        return;
      }

      // Opdater lokalt state med spread + object spread
      setPhotos(prev => [...prev, result.data]);

      // Invalider cachen
      API_CACHE.delete(`photos-${earCombId}`);

      toast.success(result.message ?? "Billedet blev uploadet og registreret");
    } catch (err) {
      console.error("Error registering photo:", err);
      toast.error(err instanceof Error ? err.message : "Der opstod en fejl ved registrering af billedet");
    }
  };

  // Sæt som profilbillede
  const handleSetAsProfile = async (photoId: number) => {
    try {
      setIsLoadingProfileAction(photoId);
      setError(null);

      const result = await setAsProfilePhoto(photoId);

      if (!result.success) {
        setError(result.error ?? "Ukendt fejl");
        return;
      }

      // Opdater lokalt state med immutabel map + object spread
      setPhotos(prev =>
        prev.map(photo => ({
          ...photo,
          isProfilePicture: photo.id === photoId
        }))
      );

      // Invalider cachen
      API_CACHE.delete(`photos-${earCombId}`);

      toast.success(result.message ?? "Profilbillede blev opdateret");
    } catch (err) {
      console.error("Error setting profile photo:", err);
      toast.error(err instanceof Error ? err.message : "Der opstod en fejl ved ændring af profilbillede");
    } finally {
      setIsLoadingProfileAction(null);
    }
  };

  // Slet foto
  const handleDeletePhoto = async (photoId: number) => {
    try {
      setIsLoadingDeleteAction(photoId);
      setError(null);

      const result = await deletePhoto(photoId);

      if (!result.success) {
        setError(result.error ?? "Kunne ikke slette billedet");
        return;
      }

      // Opdater lokalt state med array filtering
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));

      // Invalider cachen
      API_CACHE.delete(`photos-${earCombId}`);

      toast.success(result.message ?? "Billedet er slettet");
    } catch (err) {
      console.error("Error deleting photo:", err);
      toast.error(err instanceof Error ? err.message : "Der opstod en fejl ved sletning af billedet");
    } finally {
      setIsLoadingDeleteAction(null);
    }
  };

  // Genindlæs data
  const handleReload = () => {
    // Ryd cache
    API_CACHE.delete(`photos-${earCombId}`);
    API_CACHE.delete(`upload-config-${earCombId}`);

    loadPhotos();
    loadUploadPermission();
  };

  // Modal handlers
  const handleOpenModal = () => {
    console.log("Opening modal");
    setIsModalOpen(true);
    setUploadComplete(false);
    setWidgetKey(`upload-${Date.now()}`);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
    setTimeout(() => setUploadComplete(false), 500);
  };

  // Modificeret upload handler for modal
  const handleModalUpload = async (photoData: CloudinaryPhotoRegistryRequestDTO) => {
    try {
      await handlePhotoUploaded(photoData);
      setUploadComplete(true);
    } catch (err) {
      console.error("Modal upload error:", err);
    }
  };

  // Udled entity type fra uploadConfig med optional chaining og nullish coalescing
  const entityTypeName = uploadConfig?.entityType === 'Rabbit'
    ? 'kanin'
    : uploadConfig?.entityType?.toLowerCase() ?? 'kanin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Billeder</h2>

        <Button
          size="sm"
          variant="ghost"
          onPress={handleReload}
          isLoading={isLoadingPhotos}
        >
          Genindlæs
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-500 p-4 rounded-lg flex justify-between items-center">
          <p>{error}</p>
          <Button
            size="sm"
            variant="ghost"
            color="danger"
            onPress={() => setError(null)}
          >
            Luk
          </Button>
        </div>
      )}

      {/* Upload widget med modal */}
      {uploadConfig && !isLoadingPhotos && (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-4">
          <div className="flex flex-col gap-2">
            <Button
              color="primary"
              onPress={handleOpenModal}
              isDisabled={maxImageCount <= photos.length}
              className="w-full"
            >
              Upload Billede
            </Button>

            <p className="text-xs text-zinc-400">
              {maxImageCount - photos.length > 0
                ? `Du kan uploade ${maxImageCount - photos.length} billede${maxImageCount - photos.length !== 1 ? 'r' : ''} mere`
                : 'Du har nået grænsen for antal billeder'
              }
            </p>
          </div>

          {/* SimpleModal med isoleret Cloudinary iframe */}
          <SimpleModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Upload Billede"
          >
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
                <Button color="primary" onPress={handleCloseModal}>
                  Luk
                </Button>
              </div>
            ) : (
              // Ændr højden så den fylder mere
              <div key={widgetKey} className="h-[500px]"> {/* Øg højden yderligere for at sikre, at Cloudinary widget har plads */}
                {/* Bruger IsolatedCloudinaryUploader komponenten */}
                {uploadConfig && (
                  <IsolatedCloudinaryUploader
                    uploadConfig={uploadConfig}
                    maxImageCount={maxImageCount}
                    currentImageCount={photos.length}
                    onPhotoUploaded={handleModalUpload}
                    uniqueKey={widgetKey}
                  />
                )}
              </div>
            )}
          </SimpleModal>
        </div>
      )}

      {/* Billede galleri */}
      <PhotoGallery
        photos={photos}
        entityTypeName={entityTypeName}
        entityId={earCombId}
        isLoading={isLoadingPhotos}
        isLoadingProfileAction={isLoadingProfileAction}
        isLoadingDeleteAction={isLoadingDeleteAction}
        onSetAsProfile={handleSetAsProfile}
        onDelete={handleDeletePhoto}
      />
    </div>
  );
}