// src/components/cloudinary/CloudinaryFrame.tsx
'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { CloudinaryPhotoRegistryRequestDTO } from '@/api/types/AngoraDTOs';

// Define interfaces for Cloudinary types
interface CloudinaryWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

interface CloudinaryWithWidgets {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: CloudinaryError | null, result?: CloudinaryResult) => void
  ) => CloudinaryWidget;
  _widgets?: unknown[];
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

interface CloudinaryError {
  message?: string;
  [key: string]: unknown;
}

// Config structure for messages between parent and iframe
interface CloudinaryConfig {
  type: string;
  config: {
    cloudName: string;
    apiKey: string;
    uploadPreset: string;
    folder: string;
    source?: string;
    context?: string;
    tags?: string;
    entityId: string;
    entityType: string;
    [key: string]: unknown;
  };
  maxImageCount?: number;
  currentImageCount?: number;
}

// Extend Window interface to include Cloudinary
declare global {
  interface Window {
    cloudinary?: CloudinaryWithWidgets;
  }
}

// Wrapper-komponent der bruger useSearchParams
function CloudinaryFrameInner() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || Date.now().toString();
  const [isLoaded, setIsLoaded] = useState(false);
  const [config, setConfig] = useState<CloudinaryConfig | null>(null);
  const [debug, setDebug] = useState<string | null>(null);
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  
  // Script loading handler
  const handleScriptLoad = () => {
    console.log("Cloudinary script loaded in iframe");
    setIsLoaded(true);
    setDebug("Script loaded");
  };
  
  // Cleanup function for removing all Cloudinary widgets
  const cleanupWidgets = () => {
    // First try to close and destroy the current widget
    if (widgetRef.current) {
      try {
        widgetRef.current.close();
        widgetRef.current.destroy();
        widgetRef.current = null;
        console.log("Widget destroyed successfully");
      } catch (e) {
        console.warn("Error destroying widget:", e);
      }
    }
    
    // Then try to cleanup all widgets that might be left behind
    if (window.cloudinary && window.cloudinary._widgets) {
      try {
        window.cloudinary._widgets = [];
        console.log("Cleared cloudinary widgets array");
      } catch (e) {
        console.warn("Error clearing cloudinary widgets:", e);
      }
    }
    
    // Remove all Cloudinary elements from DOM
    document.querySelectorAll('.cloudinary-widget, .cloudinary-overlay').forEach(el => el.remove());
    document.querySelectorAll('iframe[id^="cloudinary-"]').forEach(el => el.remove());
  };
  
  // Lyt efter beskeder fra parent
  useEffect(() => {
    console.log("CloudinaryFrame: Setting up message listener");
    
    const handleMessage = (event: MessageEvent) => {
      // Ignorer meddelelser fra React DevTools
      if (typeof event.data === 'object' && event.data && 'source' in event.data) {
        if (event.data.source === 'react-devtools-bridge') {
          return;
        }
      }
      
      // Kun fortsæt hvis det er en string
      if (typeof event.data !== 'string') {
        return;
      }
      
      console.log("CloudinaryFrame received message:", event.data);
      
      try {
        const data = JSON.parse(event.data);
        setDebug(`Received: ${data.type}`);
        
        if (data.type === 'CLOUDINARY_CONFIG') {
          console.log("CloudinaryFrame: Received config:", data);
          setConfig(data as CloudinaryConfig);
        }
      } catch (err) {
        console.error("Error parsing message in iframe:", err);
        setDebug(`Error: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Send besked om at iframen er klar
    console.log("CloudinaryFrame: Sending IFRAME_READY message");
    window.parent.postMessage(JSON.stringify({
      type: 'CLOUDINARY_IFRAME_READY',
      key
    }), '*');
    
    return () => {
      console.log("CloudinaryFrame: Cleaning up event listeners and widgets");
      window.removeEventListener('message', handleMessage);
      cleanupWidgets();
    };
  }, [key]);
  
  // Opret widget når config er modtaget og script er loaded
  useEffect(() => {
    if (!isLoaded || !config || !config.config) {
      console.log("CloudinaryFrame: Waiting for script and config", { isLoaded, hasConfig: !!config });
      return;
    }
    
    if (!window.cloudinary) {
      console.error("CloudinaryFrame: Cloudinary object not available");
      setDebug("Error: Cloudinary not available");
      window.parent.postMessage(JSON.stringify({
        type: 'CLOUDINARY_UPLOAD_ERROR',
        error: 'Cloudinary blev ikke indlæst korrekt'
      }), '*');
      return;
    }
    
    console.log("CloudinaryFrame: Creating widget with config:", config);
    
    try {
      const { config: uploadConfig } = config;
      
      // Make sure to clean up any previous widget
      cleanupWidgets();
      
      // Convert context and tags
      const contextObj: Record<string, string> = {};
      if (uploadConfig.context) {
        uploadConfig.context.split('|').forEach((pair: string) => {
          const [key, value] = pair.split('=');
          if (key && value) contextObj[key] = value;
        });
      }
      
      const tagsArray = uploadConfig.tags?.split(',') || [];
      
      // Create widget options with unique id to prevent conflicts
      const uniqueId = `widget-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const options = {
        cloudName: uploadConfig.cloudName,
        apiKey: uploadConfig.apiKey,
        uploadPreset: uploadConfig.uploadPreset,
        folder: uploadConfig.folder,
        // Sæt source til 'upload' for at fremhæve drag-and-drop
        source: 'upload',
        tags: tagsArray,
        context: contextObj,
        
        // Sæt upload-tab først for at prioritere drag-and-drop
        sources: ['upload', 'local', 'url', 'camera'] as const,
        
        // Gør modalen større så den passer til indholdet
        width: 700,
        height: 500,
        
        multiple: false,
        maxFiles: 1,
        resourceType: 'image' as const,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        showAdvancedOptions: false,
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        language: 'da',
        widgetId: uniqueId,
        showPoweredBy: false,
        
        // Disse parametre aktiverer form-baseret drag-and-drop
        form: '#upload-form',
        fieldName: 'image-upload',
        thumbnails: false,
        
        // Vis tab-indikator tydeligt
        inlineContainer: '#cloudinary-target',
        showSkipCropButton: false,
        singleUploadAutoClose: false,
        
        // Dropzone styling for øget synlighed
        dropboxWidth: '100%',
        dropboxHeight: '300px',
        dropboxBackgroundColor: "#000000",
        dropboxBorderStyle: "dashed",
        dropboxBorderWidth: "2px",
        dropboxBorderColor: "#3448C5",
        
        text: {
          da: {
            // Overskriv nogle danske tekster
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
        },
        // Forbedrede styles
        styles: {
          palette: {
            window: "#000000",
            windowBorder: "#333333",
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
            sourceBg: "#191919"  // Mørkere baggrund for bedre kontrast
          },
          frame: {
            background: "#000000"
          },
          // Direkte styling af dropzone
          dropzone: {
            border: "2px dashed #3448C5",
            borderRadius: "6px",
            background: "rgba(20, 20, 40, 0.4)",
            minHeight: "250px"
          }
        }
      };
      
      // Widget callback
      const callback = (error: CloudinaryError | null, result?: CloudinaryResult) => {
        if (error) {
          console.error("CloudinaryFrame: Widget callback error:", error);
          window.parent.postMessage(JSON.stringify({
            type: 'CLOUDINARY_UPLOAD_ERROR',
            error: error.message || 'Fejl ved upload'
          }), '*');
          return;
        }
        
        if (!result) return;
        
        console.log("CloudinaryFrame: Widget callback event:", result.event);
        
        if (result.event === 'success' && result.info) {
          const { public_id, secure_url, original_filename } = result.info;
          
          // Send success message to parent
          window.parent.postMessage(JSON.stringify({
            type: 'CLOUDINARY_UPLOAD_SUCCESS',
            photoData: {
              publicId: public_id,
              cloudinaryUrl: secure_url,
              fileName: original_filename,
              entityId: uploadConfig.entityId,
              entityType: uploadConfig.entityType
            } as CloudinaryPhotoRegistryRequestDTO
          }), '*');
        } else if (result.event === 'show') {
          window.parent.postMessage(JSON.stringify({
            type: 'CLOUDINARY_UPLOAD_START'
          }), '*');
        } else if (result.event === 'close') {
          window.parent.postMessage(JSON.stringify({
            type: 'CLOUDINARY_UPLOAD_COMPLETE'
          }), '*');
        }
      };
      
      console.log("CloudinaryFrame: Creating upload widget");
      widgetRef.current = window.cloudinary.createUploadWidget(options, callback);
      
      // Notify parent that widget was initialized
      window.parent.postMessage(JSON.stringify({
        type: 'CLOUDINARY_WIDGET_INITIALIZED'
      }), '*');
      
      // Automatically open widget after short delay
      console.log("CloudinaryFrame: Setting timeout to open widget");
      setTimeout(() => {
        if (widgetRef.current) {
          console.log("CloudinaryFrame: Opening widget");
          widgetRef.current.open();
          
          // Forsøg at forbedre UI efter widget er indlæst
          setTimeout(() => {
            try {
              // Find upload-tab og klik på den
              const uploadTab = document.querySelector('[data-tab="upload"]');
              if (uploadTab && uploadTab instanceof HTMLElement) {
                uploadTab.click();
              }
            } catch (e) {
              console.warn("Error enhancing widget UI:", e);
            }
          }, 500);
        } else {
          console.error("CloudinaryFrame: Widget not available when trying to open");
        }
      }, 300);
      
    } catch (err) {
      console.error("CloudinaryFrame: Error creating widget:", err);
      setDebug(`Widget error: ${err instanceof Error ? err.message : String(err)}`);
      
      window.parent.postMessage(JSON.stringify({
        type: 'CLOUDINARY_UPLOAD_ERROR',
        error: 'Kunne ikke initialisere Cloudinary widget'
      }), '*');
    }
  }, [isLoaded, config]);
  
  return (
    <div className="p-4 h-full flex flex-col items-center justify-center">
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />
      
      {/* Tilføj form element for at aktivere drag-and-drop */}
      <form id="upload-form" className="w-full h-full min-h-[450px]">
        <div 
          id="cloudinary-target" 
          className="w-full h-full min-h-[450px] flex items-center justify-center border-2 border-dashed border-blue-500 bg-black/30 rounded-lg"
        >
          {!isLoaded && <p className="mb-2">Indlæser Cloudinary...</p>}
          
          {isLoaded && !config && (
            <div className="text-center p-6">
              <p className="text-white">Træk og slip dit billede her når upload-boksen åbner</p>
            </div>
          )}
        </div>
      </form>
      
      {debug && (
        <p className="text-xs text-blue-400 bg-black/70 px-2 py-1 rounded absolute top-1 right-1">
          {debug}
        </p>
      )}
    </div>
  );
}

// Eksporter hovedkomponenten med Suspense boundary
export default function CloudinaryFrame() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Indlæser Cloudinary...</div>}>
      <CloudinaryFrameInner />
    </Suspense>
  );
}