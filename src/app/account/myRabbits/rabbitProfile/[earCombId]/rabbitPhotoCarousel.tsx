// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitPhotoCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import CloudinaryImage from '@/components/cloudinary/CloudinaryImage';
import { Button, Spinner } from '@/components/ui/heroui';
import { PhotoPrivateDTO } from '@/api/types/AngoraDTOs';
import { RiArrowLeftSLine, RiArrowRightSLine, RiFullscreenLine, RiStarLine, RiDeleteBin5Line } from "react-icons/ri";

interface RabbitPhotoCarouselProps {
  photos: PhotoPrivateDTO[];
  entityTypeName: string;
  entityId: string;
  isLoading: boolean;
  isLoadingProfileAction: number | null;
  isLoadingDeleteAction: number | null;
  onSetAsProfile: (photoId: number) => Promise<void>;
  onDelete: (photoId: number) => Promise<void>;
  cloudName?: string;
  profilePhotoId?: string | null;  // add this
}

export default function RabbitPhotoCarousel({
  photos,
  entityTypeName,
  entityId,
  isLoading,
  isLoadingProfileAction,
  isLoadingDeleteAction,
  onSetAsProfile,
  onDelete,
  cloudName,
  profilePhotoId
}: RabbitPhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  
  // Find profilbilledeindeks (hvis det findes)
  const isProfilePhoto = (photo: PhotoPrivateDTO) => 
    profilePhotoId != null && photo.id === Number(profilePhotoId);

  const profilePhotoIndex = photos.findIndex(p => isProfilePhoto(p));
  
  // Start med profilbilledet, hvis det findes
  useEffect(() => {
    if (profilePhotoIndex !== -1) {
      setCurrentIndex(profilePhotoIndex);
    }
  }, [profilePhotoIndex]); // Rettet fra useState til useEffect med dependency

  // Navigationshandlere
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Vis spinner ved indlæsning
  if (isLoading && photos.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  // Vis besked, hvis der ikke er nogen billeder
  if (photos.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-center p-4">
        <div className="w-16 h-16 mb-4 text-zinc-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-zinc-400">
          Der er endnu ikke uploadet billeder til denne {entityTypeName}.
        </p>
      </div>
    );
  }

  // Få det aktuelle foto
  const currentPhoto = photos[currentIndex];

  // Fullscreen view
  if (fullscreen) {
    return (
      <div 
        className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center"
        onClick={() => setFullscreen(false)}
      >
        <div className="relative w-full h-full max-w-5xl max-h-screen p-8">
          <CloudinaryImage
            publicId={currentPhoto.cloudinaryPublicId}
            cloudName={cloudName}
            width={1200}   // Tilføjet width
            height={1200}  // Tilføjet height
            alt={`Billede af ${entityTypeName} ${entityId}`}
            className="w-full h-full object-contain"
            fallbackSrc={currentPhoto.filePath}
          />
          
          {/* Navigation pile */}
          <button 
            aria-label="Forrige billede"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          >
            <RiArrowLeftSLine size={24} />
          </button>
          
          <button 
            aria-label="Næste billede"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
          >
            <RiArrowRightSLine size={24} />
          </button>
          
          {/* Nedre tæller */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1 rounded-full text-white text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      </div>
    );
  }

  // Normal visning
  return (
    <div className="flex flex-col h-full">
      {/* Primært billede */}
      <div className="relative aspect-square bg-zinc-900/50 rounded-lg overflow-hidden">
        <CloudinaryImage
          publicId={currentPhoto.cloudinaryPublicId}
          cloudName={cloudName}
          width={400}
          height={400}
          alt={`Billede af ${entityTypeName} ${entityId}`}
          className="w-full h-full object-cover"
          fallbackSrc={currentPhoto.filePath}
        />
        
        {/* Profilbillede indikator */}
        {isProfilePhoto(currentPhoto) && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Profilbillede
          </div>
        )}
        
        {/* Fullscreen knap */}
        <button 
          aria-label="Vis i fuld skærm"
          className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"
          onClick={() => setFullscreen(true)}
        >
          <RiFullscreenLine size={16} />
        </button>
        
        {/* Navigations pile (kun hvis der er mere end ét billede) */}
        {photos.length > 1 && (
          <>
            <button 
              aria-label="Forrige billede"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"
              onClick={goToPrevious}
            >
              <RiArrowLeftSLine size={20} />
            </button>
            
            <button 
              aria-label="Næste billede"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"
              onClick={goToNext}
            >
              <RiArrowRightSLine size={20} />
            </button>
          </>
        )}
      </div>
      
      {/* Billede navigation og tæller */}
      <div className="flex justify-between items-center mt-2 text-zinc-400">
        <div className="text-sm">
          {currentIndex + 1} af {photos.length}
        </div>
        
        {photos.length > 1 && (
          <div className="flex gap-1">
            {photos.map((_, index) => (
              <button
                key={index}
                aria-label={`Gå til billede ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-zinc-600'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Handlingsknapper */}
      <div className="flex gap-2 mt-4">
        {!isProfilePhoto(currentPhoto) && (
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 gap-1"
            onPress={() => onSetAsProfile(currentPhoto.id)}
            isPending={isLoadingProfileAction === currentPhoto.id}
            isDisabled={isLoadingProfileAction !== null || isLoadingDeleteAction !== null}
          >
            <RiStarLine /> Sæt som profil
          </Button>
        )}
        
        <Button
          size="sm"
          variant="danger-soft"
          className="flex-1 gap-1"
          onPress={() => onDelete(currentPhoto.id)}
          isPending={isLoadingDeleteAction === currentPhoto.id}
          isDisabled={isLoadingProfileAction !== null || isLoadingDeleteAction !== null}
        >
          <RiDeleteBin5Line /> Slet billede
        </Button>
      </div>
    </div>
  );
}
