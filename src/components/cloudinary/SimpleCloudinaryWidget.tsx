// src/components/cloudinary/SimpleCloudinaryWidget.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Spinner } from "@heroui/react";
import { CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO } from '@/api/types/AngoraDTOs';

// Importér de fælles Cloudinary typer
interface CloudinaryWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

interface CloudinaryError {
  message?: string;
  [key: string]: unknown;
}

interface CloudinaryResult {
  event: string;
  info?: {
    public_id: string;
    secure_url: string;
    original_filename: string;
    [key: string]: unknown;
  };
}

// Global type for window.cloudinary
declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: CloudinaryError | null, result?: CloudinaryResult) => void
      ) => CloudinaryWidget;
      _widgets?: unknown[];
    };
  }
}

interface SimpleCloudinaryWidgetProps {
  uploadConfig: CloudinaryUploadConfigDTO;
  onPhotoUploaded: (photoData: CloudinaryPhotoRegistryRequestDTO) => Promise<void>;
  onComplete?: () => void;
  onClose?: () => void;
  widgetKey?: string;
  forceReload?: boolean;
}

export default function SimpleCloudinaryWidget({
  uploadConfig,
  onPhotoUploaded,
  onComplete,
  onClose,
  widgetKey = 'default',
  forceReload = false
}: SimpleCloudinaryWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const instanceId = useRef(`instance-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  // Move cleanupWidget to useCallback to avoid dependency issues
  const cleanupWidget = useCallback(() => {
    setScriptLoaded(false);

    if (widgetRef.current) {
      try {
        widgetRef.current.close();
        widgetRef.current.destroy();
        widgetRef.current = null;
        console.log("Widget destroyed");
      } catch (e) {
        console.warn("Error destroying widget:", e);
      }
    }

    // Remove DOM elements
    document.querySelectorAll('.cloudinary-widget, .cloudinary-overlay').forEach(el => el.remove());
    document.querySelectorAll('iframe[id^="cloudinary-"]').forEach(el => el.remove());

    // Reset Cloudinary internal state if possible
    if (window.cloudinary && window.cloudinary._widgets) {
      try {
        window.cloudinary._widgets = [];
      } catch (e) {
        console.warn("Error clearing cloudinary widgets:", e);
      }
    }
  }, []);

  // Forcibly reload the script by removing and re-adding it
  const reloadScript = useCallback(() => {
    console.log("🔄 Forcibly reloading Cloudinary script");

    // First, clean up everything
    cleanupWidget();

    // Remove all script tags related to Cloudinary
    document.querySelectorAll('script[src*="cloudinary"]').forEach(script => {
      script.remove();
    });

    // Reset window.cloudinary
    if (window.cloudinary) {
      try {
        // Correct way to clear window.cloudinary without ts-expect-error
        window.cloudinary = undefined;
      } catch (e) {
        console.warn("Error resetting cloudinary object:", e);
      }
    }

    // Create new script element
    const script = document.createElement('script');
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.id = `cloudinary-script-${instanceId.current}`;
    script.async = true;
    script.onload = () => {
      console.log("✅ Cloudinary script manually reloaded");
      setScriptLoaded(true);
    };
    script.onerror = (err) => {
      console.error("❌ Error loading Cloudinary script:", err);
      setError("Kunne ikke indlæse Cloudinary - prøv at genindlæse siden");
    };

    // Append to document body
    document.body.appendChild(script);
  }, [cleanupWidget]); // Add cleanupWidget as dependency

  // Force reload when the key changes
  useEffect(() => {
    if (forceReload) {
      console.log("Force reload triggered with key:", widgetKey);
      cleanupWidget();

      // Lav en lille forsinkelse for at sikre alt er renset op
      setTimeout(() => {
        reloadScript();
      }, 50);

      instanceId.current = `instance-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    return () => {
      cleanupWidget();
    };
  }, [widgetKey, forceReload, cleanupWidget, reloadScript]); // Add missing dependencies

  // Initialize when script is loaded
  useEffect(() => {
    if (!scriptLoaded || !uploadConfig) return;

    console.log("Initializing Cloudinary widget with config:", uploadConfig);

    try {
      // Process context
      const contextObj: Record<string, string> = {};
      if (uploadConfig.context) {
        uploadConfig.context.split('|').forEach((pair: string) => {
          const [key, value] = pair.split('=');
          if (key && value) contextObj[key] = value;
        });
      }

      // Process tags
      const tagsArray = uploadConfig.tags?.split(',') || [];

      // Unique widget ID - bruge instanceId for at sikre det er helt unikt
      const uniqueId = `widget-${widgetKey}-${instanceId.current}`;

      // Widget callback
      const callback = (error: CloudinaryError | null, result?: CloudinaryResult) => {
        if (error) {
          console.error("Upload error:", error);
          setError(error.message || 'Fejl ved upload');
          setIsLoading(false);
          return;
        }

        if (!result) return;

        console.log("Cloudinary event:", result.event);

        if (result.event === 'success' && result.info) {
          try {
            console.log("Upload success:", result.info);
            setIsLoading(true);

            const { public_id, secure_url, original_filename } = result.info;

            // Create DTO for registration
            const photoData: CloudinaryPhotoRegistryRequestDTO = {
              publicId: public_id,
              cloudinaryUrl: secure_url,
              fileName: original_filename,
              entityStringId: uploadConfig.entityId, // <-- brug entityId
              entityIntId: 0, // <-- hvis du ikke har et int-id, brug 0 eller parse hvis muligt
              entityType: uploadConfig.entityType
            };

            // Call the callback
            onPhotoUploaded(photoData)
              .then(() => {
                if (onComplete) onComplete();
              })
              .catch(err => {
                console.error("Error registering photo:", err);
                setError(err instanceof Error
                  ? err.message
                  : 'Billedet blev uploadet, men ikke registreret i systemet');
              })
              .finally(() => {
                setIsLoading(false);
              });
          } catch (err) {
            console.error("Error processing upload result:", err);
            setError(err instanceof Error ? err.message : 'Fejl ved behandling af upload resultat');
            setIsLoading(false);
          }
        } else if (result.event === 'close') {
          console.log("Upload widget closed");
          setIsLoading(false);

          // Tilføj en ny prop til komponenten for at håndtere lukning
          if (onClose) {
            onClose();
          }
        } else if (result.event === 'show') {
          console.log("Upload widget shown");
          setIsLoading(true);
          setError(null);
        } else if (result.event === 'queues-end') {
          setIsLoading(false);
        }
      };

      // Create options
      const options = {
        cloudName: uploadConfig.cloudName,
        apiKey: uploadConfig.apiKey,
        uploadPreset: uploadConfig.uploadPreset,
        folder: uploadConfig.folder,
        source: 'local',
        tags: tagsArray,
        context: contextObj,
        sources: ['local', 'url', 'camera', 'upload'] as const,
        multiple: false,
        maxFiles: 1,
        resourceType: 'image' as const,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        showAdvancedOptions: false,
        cropping: true,
        //croppingAspectRatio: 1,   // 1 = kvadratisk
        croppingShowDimensions: true,
        language: 'da',
        widgetId: uniqueId,
        showPoweredBy: false,
        styles: {
          palette: {
            window: "rgba(40, 40, 40)",  // Semi-transparent mørk grå
            windowBorder: "rgba(70, 70, 70, 0.5)",
            tabIcon: "#FFFFFF",
            menuIcons: "#CCCCCC",
            textDark: "#FFFFFF",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#0078FF",
            inactiveTabIcon: "#999999",
            error: "#FF0000",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "rgba(35, 35, 35)" // Semi-transparent for source background
          },
          frame: {
            background: "rgba(20, 20, 20, 0.7)"  // Semi-transparent baggrund
          }
        },
        text: {
          da: {
            // Dansk oversættelse
            or: "eller",
            menu: {
              files: "Mine filer",
              camera: "Kamera",
              url: "URL",
              upload: "Træk og slip"
            },
            local: {
              browse: "Gennemse",
              dd_title_single: "Træk og slip dit billede her",
              dd_title_multi: "Træk og slip dine billeder her",
              drop_title_single: "Slip din fil for at uploade",
              drop_title_multi: "Slip dine filer for at uploade"
            },
            queue: {
              title: "Filer at uploade",
              close_btn: "Luk",
              done_button: {
                text: "Færdig"
              }
            }
          }
        }
      };

      // Kort timeout for at sikre alt er klar
      setTimeout(() => {
        // Create the widget
        if (window.cloudinary) {
          try {
            console.log("Creating widget instance with ID:", uniqueId);
            widgetRef.current = window.cloudinary.createUploadWidget(options, callback);

            // Automatically open the widget
            setTimeout(() => {
              if (widgetRef.current) {
                console.log("Opening widget");
                widgetRef.current.open();
              } else {
                console.error("Widget not available when trying to open");
                setError("Kunne ikke åbne upload dialogen - prøv igen");
              }
            }, 50);
          } catch (err) {
            console.error("Error creating widget:", err);
            setError(err instanceof Error ? err.message : "Kunne ikke oprette widget");
          }
        } else {
          console.error("window.cloudinary not available");
          setError('Cloudinary blev ikke indlæst korrekt');
        }
      }, 100);
    } catch (err) {
      console.error("Error setting up widget:", err);
      setError(err instanceof Error ? err.message : 'Kunne ikke initialisere upload widget');
    }

    // Cleanup on unmount
    return cleanupWidget;
  }, [scriptLoaded, uploadConfig, onPhotoUploaded, onComplete, widgetKey, cleanupWidget, onClose]);
  return (
    <div
      className="upload-widget-container"
      key={instanceId.current}
      data-widget-key={widgetKey}
    >
      {/* Manual script loading - instead of using Next.js Script component */}

      {isLoading && (
        <div className="py-8 flex justify-center">
          <Spinner size="lg" color="white" />
        </div>
      )}

      {error && (
        <div className="mt-2 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={reloadScript}
            className="mt-2 px-3 py-1 text-sm font-medium text-blue-500 hover:text-blue-400"
          >
            Prøv at genindlæse
          </button>
        </div>
      )}

      {!scriptLoaded && !isLoading && (
        <div className="py-8 flex justify-center flex-col items-center">
          <Spinner size="md" color="white" className="mb-2" />
          <span>Indlæser Cloudinary...</span>
        </div>
      )}
    </div>
  );
}