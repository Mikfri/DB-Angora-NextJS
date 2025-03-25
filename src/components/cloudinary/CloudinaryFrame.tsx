// src/components/cloudinary/CloudinaryFrame.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { CloudinaryPhotoRegistryRequestDTO } from '@/api/types/AngoraDTOs';

// Define interfaces for Cloudinary types
interface CloudinaryWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
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
interface CloudinaryWindow extends Window {
  cloudinary?: {
    createUploadWidget: (
      options: Record<string, unknown>,
      callback: (error: CloudinaryError | null, result?: CloudinaryResult) => void
    ) => CloudinaryWidget;
    _widgets?: any[]; // Add this to handle cleanup
  };
}

declare let window: CloudinaryWindow;

export default function CloudinaryFrame() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || Date.now().toString();
  const [isLoaded, setIsLoaded] = useState(false);
  const [config, setConfig] = useState<CloudinaryConfig | null>(null);
  const [debug, setDebug] = useState<string | null>(null); // Add debug state
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
        source: uploadConfig.source || 'uw',
        tags: tagsArray,
        context: contextObj,
        sources: ['local', 'url', 'camera'] as const,
        multiple: false,
        maxFiles: 1,
        resourceType: 'image' as const,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        showAdvancedOptions: false,
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        language: 'da',
        // Add a unique ID for each widget instance
        widgetId: uniqueId
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
      
      {!isLoaded && <p className="mb-2">Indlæser Cloudinary...</p>}
      
      {debug && (
        <p className="text-xs text-blue-400 bg-black/70 px-2 py-1 rounded absolute top-1 right-1">
          {debug}
        </p>
      )}
      
      {(!config || !isLoaded) && (
        <div className="text-center">
          <p className="text-sm text-zinc-400 mt-2">
            {!config ? "Venter på konfiguration..." : "Script indlæses..."}
          </p>
        </div>
      )}
      
      {/* This div is where Cloudinary will mount its widget */}
      <div id="cloudinary-target" className="w-full h-full"></div>
    </div>
  );
}