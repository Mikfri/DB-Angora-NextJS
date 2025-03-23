// src/components/cloudinary/CustomCloudinaryUploadWidget.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Spinner } from "@heroui/react";
import Script from 'next/script';
import { CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO } from '@/api/types/AngoraDTOs';

interface CustomCloudinaryUploadWidgetProps {
  uploadConfig: CloudinaryUploadConfigDTO; // Bruger uploadConfig i stedet for uploadSignature for konsistens
  maxImageCount: number;
  currentImageCount: number;
  onPhotoUploaded: (photoData: CloudinaryPhotoRegistryRequestDTO) => Promise<void>;
}

// Interface for cloudinary widget result info
interface CloudinaryUploadResultInfo {
  public_id: string;
  secure_url: string;
  original_filename: string;
  [key: string]: string | number | boolean | unknown;
}

// Interface for cloudinary widget result
interface CloudinaryWidgetResult {
  event: string;
  info: CloudinaryUploadResultInfo;
}

// Interface for cloudinary widget error
interface CloudinaryWidgetError {
  toString?: () => string;
  message?: string;
  statusText?: string;
  status?: number;
}

interface CloudinaryWindow extends Window {
  cloudinary?: {
    createUploadWidget: (
      options: Record<string, unknown>,
      callback: (error: CloudinaryWidgetError | null, result: CloudinaryWidgetResult | undefined) => void
    ) => {
      open: () => void;
      close: () => void;
      destroy: () => void;
    };
  };
}

declare let window: CloudinaryWindow;

export default function CustomCloudinaryUploadWidget({
  uploadConfig,
  maxImageCount,
  currentImageCount,
  onPhotoUploaded
}: CustomCloudinaryUploadWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetRef = useRef<{ open: () => void; close: () => void; destroy: () => void } | null>(null);
  
  const remainingUploads = maxImageCount - currentImageCount;
  const isDisabled = remainingUploads <= 0 || isLoading;
  
  // Håndter script load
  const handleScriptLoad = () => {
    console.log("Cloudinary script loaded successfully");
    setScriptLoaded(true);
  };

  // Initialiser Cloudinary widget når scriptet er indlæst
  useEffect(() => {
    // Ryd eksisterende widget ved reload for at undgå memory leaks
    if (widgetRef.current) {
      try {
        widgetRef.current.destroy();
        widgetRef.current = null;
      } catch (e) {
        console.warn("Error destroying widget:", e);
      }
    }
    
    if (!scriptLoaded || !uploadConfig || widgetRef.current) return;
    
    console.log("Initializing Cloudinary widget with config:", uploadConfig);
    
    // Konverter context string til et objekt
    const contextObj = uploadConfig.context ? 
      uploadConfig.context.split('|').reduce((obj: Record<string, string>, pair) => {
        const [key, value] = pair.split('=');
        if (key && value) obj[key] = value;
        return obj;
      }, {}) 
      : {};
    
    // Konverter tags string til et array
    const tagsArray = uploadConfig.tags ? uploadConfig.tags.split(',') : [];
    
    // Opret options til Cloudinary widget - baseret på uploadConfig
    const options = {
      cloudName: uploadConfig.cloudName,
      apiKey: uploadConfig.apiKey,
      uploadPreset: uploadConfig.uploadPreset,
      folder: uploadConfig.folder,
      source: uploadConfig.source || 'uw', // 'uw' = upload widget
      tags: tagsArray,
      context: contextObj,
      // UI/UX parametre der ikke påvirker signaturen
      sources: ['local', 'url', 'camera'],
      multiple: false,
      maxFiles: 1,
      resourceType: 'image',
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      showAdvancedOptions: false,
      cropping: true,
      croppingAspectRatio: 1,
      croppingShowDimensions: true,
      language: 'da',
      text: {
        'en': {
          'upload': `Upload ${uploadConfig.entityType === 'Rabbit' ? 'kanin' : (uploadConfig.entityType?.toLowerCase() || 'enheds')} billede`,
          'drag_drop': 'Træk og slip billede her',
          'drop_file': 'Slip billede for at uploade',
          'or': 'eller',
          'select_file': 'Vælg billede',
          'local': 'Enhed',
          'camera': 'Kamera',
          'url': 'URL',
          'back': 'Tilbage',
          'remove': 'Fjern',
          'crop': 'Beskær'
        }
      }
    };
    
    // Opret widget
    if (window.cloudinary) {
      console.log("Creating Cloudinary widget");
      try {
        widgetRef.current = window.cloudinary.createUploadWidget(
          options,
          async (error, result) => {
            if (error) {
              console.error('Upload error:', error);
              setError('Der opstod en fejl under upload');
              setIsLoading(false);
              if (error.toString) {
                setDebug(error.toString());
              } else if (error.message) {
                setDebug(error.message);
              }
              return;
            }
            
            if (result && result.event === 'success') {
              try {
                console.log("Upload success:", result.info);
                setIsLoading(true);
                
                // Opret DTO til registrering i backend - generisk
                const photoData: CloudinaryPhotoRegistryRequestDTO = {
                  publicId: result.info.public_id,
                  cloudinaryUrl: result.info.secure_url,
                  fileName: result.info.original_filename,
                  entityId: uploadConfig.entityId,
                  entityType: uploadConfig.entityType
                };
                
                await onPhotoUploaded(photoData);
                setIsLoading(false);
              } catch (err) {
                console.error("Error registering photo:", err);
                setError('Billedet blev uploadet, men ikke registreret i systemet');
                setIsLoading(false);
              }
            } else if (result && result.event === 'close') {
              console.log("Upload widget closed");
              setIsLoading(false);
            } else if (result && result.event === 'show') {
              console.log("Upload widget shown");
              setIsLoading(true);
            }
          }
        );
        console.log("Widget created successfully");
      } catch (err) {
        console.error("Error creating widget:", err);
        setError('Kunne ikke initialisere upload widget');
      }
    } else {
      console.error("Cloudinary object not available");
      setError('Cloudinary blev ikke indlæst korrekt');
    }
    
    // Cleanup ved unmount
    return () => {
      console.log("Cleanup: Destroying widget");
      if (widgetRef.current) {
        try {
          widgetRef.current.destroy();
          widgetRef.current = null;
        } catch (e) {
          console.warn("Error during cleanup:", e);
        }
      }
    };
  }, [scriptLoaded, uploadConfig, onPhotoUploaded]);
  
  // Håndter klik på upload knappen
  const handleOpenWidget = () => {
    if (isDisabled) return;
    
    setError(null);
    setDebug(null);
    
    if (widgetRef.current) {
      console.log("Opening widget");
      try {
        widgetRef.current.open();
      } catch (err) {
        console.error("Error opening widget:", err);
        setError('Kunne ikke åbne upload widget');
        setIsLoading(false);
      }
    } else {
      console.error("Widget not initialized");
      setError('Upload widget er ikke initialiseret endnu');
    }
  };
  
  // Vi bruger et wrapper element til at simulere disabled state for konsistens
  if (isDisabled) {
    return (
      <div className="flex flex-col gap-2">
        <button 
          type="button"
          className="w-full py-2 px-4 bg-blue-400 text-white font-medium rounded-lg cursor-not-allowed"
          disabled
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner size="sm" color="white" />
              <span>Uploader...</span>
            </div>
          ) : (
            'Upload Billede'
          )}
        </button>
        
        <p className="text-xs text-zinc-400">
          {remainingUploads > 0 
            ? `Du kan uploade ${remainingUploads} billede${remainingUploads !== 1 ? 'r' : ''} mere`
            : 'Du har nået grænsen for antal billeder'
          }
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-2">
      {/* Indlæs Cloudinary Script */}
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        onLoad={handleScriptLoad}
        onError={(e) => {
          console.error("Error loading script:", e);
          setError('Kunne ikke indlæse Cloudinary');
        }}
        strategy="lazyOnload"
      />
      
      {/* Brug button i stedet for HeroUI Button for at undgå nest-issues */}
      <button
        type="button"
        onClick={handleOpenWidget}
        disabled={!scriptLoaded}
        className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors
          ${!scriptLoaded ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Spinner size="sm" color="white" />
            <span>Uploader...</span>
          </div>
        ) : (
          'Upload Billede'
        )}
      </button>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      {debug && (
        <p className="text-xs text-orange-500 mt-1 break-all">{debug}</p>
      )}
      
      <p className="text-xs text-zinc-400">
        {remainingUploads > 0 
          ? `Du kan uploade ${remainingUploads} billede${remainingUploads !== 1 ? 'r' : ''} mere`
          : 'Du har nået grænsen for antal billeder'
        }
      </p>
    </div>
  );
}