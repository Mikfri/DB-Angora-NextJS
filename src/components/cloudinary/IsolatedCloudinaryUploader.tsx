// src/components/cloudinary/IsolatedCloudinaryUploader.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Spinner } from "@heroui/react";
import { CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO } from '@/api/types/AngoraDTOs';

interface IsolatedCloudinaryUploaderProps {
    uploadConfig: CloudinaryUploadConfigDTO;
    maxImageCount: number;
    currentImageCount: number;
    onPhotoUploaded: (photoData: CloudinaryPhotoRegistryRequestDTO) => Promise<void>;
    uniqueKey: string;
}

export default function IsolatedCloudinaryUploader({
    uploadConfig,
    maxImageCount,
    currentImageCount,
    onPhotoUploaded,
    uniqueKey
}: IsolatedCloudinaryUploaderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    // Når uploadConfig ændres, skal vi opdatere iframe
    useEffect(() => {
        console.log("IsolatedCloudinaryUploader: Effect running with config", uploadConfig);

        const handleMessage = (event: MessageEvent) => {
            // VIGTIG ændring: Ignorer meddelelser fra React DevTools
            if (typeof event.data === 'object' && event.data && 'source' in event.data) {
                // Ignorer react-devtools-bridge og lignende
                if (event.data.source === 'react-devtools-bridge') {
                    return;
                }
            }

            // Log alle andre beskeder
            console.log("IsolatedCloudinaryUploader received message:",
                typeof event.data === 'string' ? event.data : '(non-string message)');

            // Kun håndter beskeder fra vores iframe
            if (!iframeRef.current) {
                console.log("No iframe ref available");
                return;
            }

            // Kun parse data som JSON hvis det er en string
            if (typeof event.data !== 'string') {
                console.log("Skipping non-string message:", event.data);
                return;
            }

            try {
                const data = JSON.parse(event.data);
                setDebug(`Received: ${data.type}`);

                if (data.type === 'CLOUDINARY_IFRAME_READY') {
                    console.log("Iframe is ready, sending config");
                    // Send config to iframe when it signals it's ready
                    if (iframeRef.current.contentWindow) {
                        iframeRef.current.contentWindow.postMessage(JSON.stringify({
                            type: 'CLOUDINARY_CONFIG',
                            config: uploadConfig,
                            maxImageCount,
                            currentImageCount
                        }), '*');
                    }
                } else if (data.type === 'CLOUDINARY_UPLOAD_SUCCESS') {
                    onPhotoUploaded(data.photoData).catch(err => {
                        console.error("Error in parent handling upload:", err);
                        setError("Fejl ved registrering af billede");
                    }).finally(() => {
                        setIsLoading(false);
                    });
                } else if (data.type === 'CLOUDINARY_UPLOAD_ERROR') {
                    setError(data.error || "Fejl ved upload");
                    setIsLoading(false);
                } else if (data.type === 'CLOUDINARY_UPLOAD_START') {
                    setIsLoading(true);
                    setError(null);
                } else if (data.type === 'CLOUDINARY_UPLOAD_COMPLETE') {
                    setIsLoading(false);
                } else if (data.type === 'CLOUDINARY_WIDGET_INITIALIZED') {
                    console.log("Widget initialized successfully");
                    setDebug("Widget initialized");
                }
            } catch (err) {
                console.error("Error parsing message:", err);
                setDebug(`Error parsing: ${err instanceof Error ? err.message : String(err)}`);
            }
        };

        // Tilføj event listener
        window.addEventListener('message', handleMessage);

        // Send config immediately after iframe load
        if (iframeLoaded && iframeRef.current && iframeRef.current.contentWindow) {
            try {
                console.log("Sending initial config to iframe");
                iframeRef.current.contentWindow.postMessage(JSON.stringify({
                    type: 'CLOUDINARY_CONFIG',
                    config: uploadConfig,
                    maxImageCount,
                    currentImageCount
                }), '*');
            } catch (err) {
                console.error("Error sending config to iframe:", err);
                setDebug(`Error sending config: ${err instanceof Error ? err.message : String(err)}`);
            }
        }

        // Fjern event listener ved cleanup
        return () => {
            console.log("Cleaning up event listeners");
            window.removeEventListener('message', handleMessage);
        };
    }, [uploadConfig, maxImageCount, currentImageCount, onPhotoUploaded, uniqueKey, iframeLoaded]);

    // Handle iframe load
    const handleIframeLoad = () => {
        console.log("Iframe loaded");
        setIframeLoaded(true);
    };

    return (
        <div className="cloudinary-iframe-container relative h-full">
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                    <Spinner size="lg" color="white" />
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {debug && (
                <p className="text-blue-500 text-xs absolute top-1 right-1 z-50 bg-black/70 px-2 py-1 rounded">
                    Debug: {debug}
                </p>
            )}

            <iframe
                ref={iframeRef}
                src={`/cloudinaryframe?key=${uniqueKey}`}
                className="w-full h-full min-h-[500px] border-0 rounded-lg bg-transparent"
                title="Cloudinary Uploader"
                onLoad={handleIframeLoad}
                allow="camera"
            />
        </div>
    );
}