// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitPhotoSection.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Spinner } from '@heroui/react';
import { Photo_DTO, CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO } from '@/api/types/AngoraDTOs';
import { getRabbitPhotoUploadPermission, registerCloudinaryPhoto } from '@/app/actions/rabbit/photoPermission';
import { GetPhotosForEntity, SetAsProfilePhoto, DeletePhoto } from '@/api/endpoints/photoController';
import { useAuthStore } from '@/store/authStore';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { toast } from 'react-toastify';
import CustomCloudinaryUploadWidget from '@/components/cloudinary/CustomCloudinaryUploadWidget';

// Type definitioner for cache
interface PhotoCacheData {
  data: Photo_DTO[];
  timestamp: number;
}

interface UploadConfigCacheData {
  data: {
    success: boolean;
    data?: CloudinaryUploadConfigDTO;
    maxImageCount?: number;
    error?: string;
  };
  timestamp: number;
}

// Union type for alle mulige cache typer
type CacheData = PhotoCacheData | UploadConfigCacheData;

// Modul-niveau cache med specifik typedefinition
const API_CACHE = new Map<string, CacheData>();
const CACHE_LIFETIME = 30000; // 30 sekunder cache

interface PhotoSectionProps {
  earCombId: string;
}

export default function PhotoSection({ earCombId }: PhotoSectionProps) {
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isLoadingProfileAction, setIsLoadingProfileAction] = useState<number | null>(null);
  const [isLoadingDeleteAction, setIsLoadingDeleteAction] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Photo_DTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadConfig, setUploadConfig] = useState<CloudinaryUploadConfigDTO | null>(null);
  const [maxImageCount, setMaxImageCount] = useState(0);
  const getAccessToken = useAuthStore(state => state.getAccessToken);

  // Hent fotos for kaninen - med caching
  const loadPhotos = useCallback(async () => {
    try {
      // Check cache først
      const cacheKey = `photos-${earCombId}`;
      const cachedData = API_CACHE.get(cacheKey) as PhotoCacheData | undefined;
      const now = Date.now();

      if (cachedData && (now - cachedData.timestamp < CACHE_LIFETIME)) {
        console.log("🔄 Returning cached photos");
        setPhotos(cachedData.data);
        setIsLoadingPhotos(false);
        return; // Brug cache, undgå API kald
      }

      setIsLoadingPhotos(true);
      setError(null);

      const accessToken = await getAccessToken();

      if (!accessToken) {
        setError("Du skal være logget ind for at se billeder");
        return;
      }

      const photoData = await GetPhotosForEntity(accessToken, 'Rabbit', earCombId);

      // Cache resultat med korrekt type
      API_CACHE.set(cacheKey, {
        data: photoData,
        timestamp: now
      } as PhotoCacheData);

      setPhotos(photoData);
    } catch (err) {
      console.error("Error loading photos:", err);
      setError("Der opstod en fejl ved indlæsning af billeder");
    } finally {
      setIsLoadingPhotos(false);
    }
  }, [getAccessToken, earCombId]);

  // Hent uploadConfig - med caching
  const loadUploadPermission = useCallback(async () => {
    try {
      // Check cache først
      const cacheKey = `upload-config-${earCombId}`;
      const cachedData = API_CACHE.get(cacheKey) as UploadConfigCacheData | undefined;
      const now = Date.now();

      if (cachedData && (now - cachedData.timestamp < CACHE_LIFETIME)) {
        console.log("🔄 Returning cached upload config");
        if (cachedData.data.data) {
          setUploadConfig(cachedData.data.data);
          setMaxImageCount(cachedData.data.maxImageCount || 0);
          setIsLoadingUpload(false);
          return; // Brug cache, undgå API kald
        }
      }

      setIsLoadingUpload(true);
      setError(null);

      const result = await getRabbitPhotoUploadPermission(earCombId);

      if (!result.success || !result.data) {
        setError(result.error || "Kunne ikke hente upload konfiguration");
        return;
      }

      // Cache resultat med det nye navn og korrekt type
      API_CACHE.set(cacheKey, {
        data: result,
        timestamp: now
      } as UploadConfigCacheData);

      setUploadConfig(result.data);
      setMaxImageCount(result.maxImageCount || 0);
    } catch (err) {
      console.error("Error getting upload permission:", err);
      setError("Der opstod en fejl ved anmodning om upload konfiguration");
    } finally {
      setIsLoadingUpload(false);
    }
  }, [earCombId]);

  // Resten af funktionen forbliver stort set uændret...

  // Initial load - nu med korrekte dependencies
  useEffect(() => {
    loadPhotos();
    loadUploadPermission();
  }, [earCombId, loadPhotos, loadUploadPermission]);

  // Når et billede er blevet uploadet til Cloudinary
  const handlePhotoUploaded = async (photoData: CloudinaryPhotoRegistryRequestDTO) => {
    try {
      const result = await registerCloudinaryPhoto(photoData);

      if (!result.success || !result.data) {
        toast.error(result.error || "Kunne ikke registrere billede");
        return;
      }

      // Opdater listen over billeder
      setPhotos(prev => [...prev, result.data!]);

      // Invalider billed-cachen så næste indlæsning henter friske data
      API_CACHE.delete(`photos-${earCombId}`);

      toast.success("Billedet blev uploadet og registreret");

      return result;
    } catch (err) {
      console.error("Error registering photo:", err);
      toast.error("Der opstod en fejl ved registrering af billedet");
      throw err;
    }
  };

  // Sæt billede som profilbillede
  const handleSetAsProfile = async (photoId: number) => {
    try {
      setIsLoadingProfileAction(photoId);
      setError(null);

      const accessToken = await getAccessToken();

      if (!accessToken) {
        setError("Du skal være logget ind for at ændre profilbillede");
        return;
      }

      await SetAsProfilePhoto(accessToken, photoId);

      // Opdater lokalt state
      setPhotos(prev => prev.map(photo => ({
        ...photo,
        isProfilePicture: photo.id === photoId
      })));

      // Invalider billed-cachen så næste indlæsning henter friske data
      API_CACHE.delete(`photos-${earCombId}`);

      toast.success("Profilbillede blev opdateret");
    } catch (err) {
      console.error("Error setting profile photo:", err);
      toast.error("Der opstod en fejl ved ændring af profilbillede");
    } finally {
      setIsLoadingProfileAction(null);
    }
  };

  // Slet billede
  const handleDeletePhoto = async (photoId: number) => {
    try {
      setIsLoadingDeleteAction(photoId);
      setError(null);

      const accessToken = await getAccessToken();

      if (!accessToken) {
        setError("Du skal være logget ind for at slette billeder");
        return;
      }

      await DeletePhoto(accessToken, photoId);

      // Fjern billedet fra listen
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));

      // Invalider billed-cachen så næste indlæsning henter friske data
      API_CACHE.delete(`photos-${earCombId}`);

      toast.success("Billedet er slettet");
    } catch (err) {
      console.error("Error deleting photo:", err);
      toast.error("Der opstod en fejl ved sletning af billedet");
    } finally {
      setIsLoadingDeleteAction(null);
    }
  };

  // Vis genindlæs knap, hvis der opstår en fejl
  const handleReload = () => {
    // Ryd cache ved manuel genindlæsning
    API_CACHE.delete(`photos-${earCombId}`);
    API_CACHE.delete(`upload-config-${earCombId}`); // Opdateret cache key

    loadPhotos();
    loadUploadPermission();
  };

  if (isLoadingPhotos && photos.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Udled entity type fra uploadConfig eller default til "kanin"
  const entityTypeName = uploadConfig?.entityType === 'Rabbit' ? 'kanin' :
    (uploadConfig?.entityType?.toLowerCase() || 'kanin');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Billeder</h2>

        <Button
          size="sm"
          variant="ghost"
          onPress={handleReload}
          isLoading={isLoadingPhotos || isLoadingUpload}
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
      {/* Upload-sektion - forbedret formatering */}
      {uploadConfig && (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-4">
          <CustomCloudinaryUploadWidget
            uploadConfig={uploadConfig}
            maxImageCount={maxImageCount}
            currentImageCount={photos.length}
            onPhotoUploaded={async (photoData) => {
              await handlePhotoUploaded(photoData);
            }}
          />
        </div>
      )}

      {/* Loading overlay når der hentes billeder, men der allerede findes billeder */}
      {isLoadingPhotos && photos.length > 0 && (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-4 flex justify-center">
          <Spinner size="md" color="primary" />
        </div>
      )}

      {/* Billedgalleri */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map(photo => (
            <div
              key={photo.id}
              className={`bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border ${photo.isProfilePicture ? 'border-blue-500' : 'border-zinc-700/50'
                } overflow-hidden`}
            >
              <div className="aspect-square relative">
                {/* Brug CldImage for at få fordele af Cloudinary image transformation */}
                {photo.cloudinaryPublicId ? (
                  <CldImage
                    src={photo.cloudinaryPublicId}
                    width={300}
                    height={300}
                    crop="fill"
                    gravity="auto"
                    alt={`Billede af ${entityTypeName} ${earCombId}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Bruger next/image i stedet for standard img tag
                  <Image
                    src={photo.filePath}
                    alt={`Billede af ${entityTypeName} ${earCombId}`}
                    className="w-full h-full object-cover"
                    width={300}
                    height={300}
                    style={{ objectFit: "cover" }}
                    unoptimized={true}
                  />
                )}
              </div>

              <div className="p-3 flex flex-col gap-2">
                {photo.isProfilePicture ? (
                  <p className="text-sm text-blue-500 text-center">Profilbillede</p>
                ) : (
                  <Button
                    size="sm"
                    color="primary"
                    className="w-full"
                    onPress={() => handleSetAsProfile(photo.id)}
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
                  onPress={() => handleDeletePhoto(photo.id)}
                  isLoading={isLoadingDeleteAction === photo.id}
                  isDisabled={isLoadingProfileAction !== null || isLoadingDeleteAction !== null}
                >
                  Slet
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 text-center">
          <p className="text-zinc-400">
            Der er endnu ikke uploadet billeder til denne {entityTypeName}.
          </p>
        </div>
      )}
    </div>
  );
}