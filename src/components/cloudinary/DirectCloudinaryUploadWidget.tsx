// // src/components/cloudinary/DirectCloudinaryUploadWidget.tsx
// 'use client';

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { Spinner } from "@heroui/react";
// import Script from 'next/script';
// import { CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO } from '@/api/types/AngoraDTOs';

// interface DirectCloudinaryUploadWidgetProps {
//   uploadConfig: CloudinaryUploadConfigDTO;
//   maxImageCount: number;
//   currentImageCount: number;
//   onPhotoUploaded: (photoData: CloudinaryPhotoRegistryRequestDTO) => Promise<void>;
//   containerKey?: string; // Ny prop for at sikre clean mount/unmount
// }

// // Interface for cloudinary widget result info
// interface CloudinaryUploadResultInfo {
//   public_id: string;
//   secure_url: string;
//   original_filename: string;
//   [key: string]: string | number | boolean | unknown;
// }

// // Interface for cloudinary widget result
// interface CloudinaryWidgetResult {
//   event: string;
//   info: CloudinaryUploadResultInfo;
// }

// // Interface for cloudinary widget error
// interface CloudinaryWidgetError {
//   toString?: () => string;
//   message?: string;
//   statusText?: string;
//   status?: number;
// }

// // Widget instance type
// interface CloudinaryWidget {
//   open: () => void;
//   close: () => void;
//   destroy: () => void;
// }

// interface CloudinaryWindow extends Window {
//   cloudinary?: {
//     createUploadWidget: (
//       options: Record<string, unknown>,
//       callback: (error: CloudinaryWidgetError | null, result: CloudinaryWidgetResult | undefined) => void
//     ) => CloudinaryWidget;
//     // Replace any[] med en mere specifik type
//     _widgets?: Array<{
//       remove?: () => void;
//       destroy?: () => void;
//       id?: string;
//       [key: string]: unknown;
//     }>;
//   };
// }

// declare let window: CloudinaryWindow;

// export default function DirectCloudinaryUploadWidget({
//   uploadConfig,
//   maxImageCount,
//   currentImageCount,
//   onPhotoUploaded,
//   containerKey = 'default'
// }: DirectCloudinaryUploadWidgetProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [debug, setDebug] = useState<string | null>(null);
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const widgetRef = useRef<CloudinaryWidget | null>(null);
//   const mountTimeRef = useRef(Date.now());

//   // Derived state with nullish coalescing
//   const remainingUploads = maxImageCount - currentImageCount;
//   const isDisabled = remainingUploads <= 0 || isLoading;
//   const entityTypeName = uploadConfig?.entityType === 'Rabbit'
//     ? 'kanin'
//     : uploadConfig?.entityType?.toLowerCase() ?? 'enheds';

//   // Script load handler with useCallback
//   const handleScriptLoad = useCallback(() => {
//     console.log("Cloudinary script loaded successfully");
//     setScriptLoaded(true);
//   }, []);

//   // Widget callback handler with useCallback
//   const handleWidgetCallback = useCallback(async (error: CloudinaryWidgetError | null, result?: CloudinaryWidgetResult) => {
//     if (error) {
//       console.error('Upload error:', error);
//       setError('Der opstod en fejl under upload');
//       setIsLoading(false);

//       // Use optional chaining for error properties
//       setDebug(error?.toString?.() ?? error?.message ?? 'Ukendt fejl');
//       return;
//     }

//     // Early return if no result
//     if (!result) return;

//     if (result.event === 'success') {
//       try {
//         console.log("Upload success:", result.info);
//         setIsLoading(true);

//         // Destructure result info with default values using nullish coalescing
//         const {
//           public_id = '',
//           secure_url = '',
//           original_filename = 'unknown'
//         } = result.info;

//         // Create DTO for backend registration
//         const photoData: CloudinaryPhotoRegistryRequestDTO = {
//           publicId: public_id,
//           cloudinaryUrl: secure_url,
//           fileName: original_filename,
//           entityId: uploadConfig.entityId,
//           entityType: uploadConfig.entityType
//         };

//         await onPhotoUploaded(photoData);
//       } catch (err) {
//         console.error("Error registering photo:", err);
//         setError(err instanceof Error
//           ? err.message
//           : 'Billedet blev uploadet, men ikke registreret i systemet');
//       } finally {
//         setIsLoading(false);
//       }
//     } else if (result.event === 'close') {
//       console.log("Upload widget closed");
//       setIsLoading(false);
//     } else if (result.event === 'show') {
//       console.log("Upload widget shown");
//       setIsLoading(true);
//     }
//   }, [uploadConfig, onPhotoUploaded]);

//   // Aggressive cleanup on unmount - this is the key improvement
//   useEffect(() => {
//     // Når komponenten monteres, nulstil widget reference
//     widgetRef.current = null;
    
//     // Reset alle Cloudinary-relaterede DOM-elementer
//     const cleanup = () => {
//       // Fjern aktivt widget først
//       if (widgetRef.current) {
//         try {
//           widgetRef.current.close();
//           widgetRef.current.destroy();
//           widgetRef.current = null;
//         } catch (e) {
//           console.warn("Widget cleanup error:", e);
//         }
//       }
      
//       // Fjern alle widget iframe og DOM elementer
//       document.querySelectorAll('iframe[id^="cloudinary-"]').forEach(el => el.remove());
//       document.querySelectorAll('.cloudinary-widget,.cloudinary-overlay').forEach(el => el.remove());
      
//       // Reset global Cloudinary state hvis den findes
//       if (window.cloudinary && window.cloudinary._widgets) {
//         try {
//           window.cloudinary._widgets = [];
//         } catch (e) {
//           console.warn("Error clearing cloudinary widgets:", e);
//         }
//       }
//     };
    
//     // Kør cleanup ved mount - vigtigt for at rydde op efter tidligere instances
//     cleanup();
    
//     // Returner cleanup for at køre ved unmount
//     return cleanup;
//   }, [containerKey]); // Afhængighed af containerKey sikrer kører ved hver ny nøgle

//   // Stale detection
//   useEffect(() => {
//     const checkStale = () => {
//       const timeElapsed = Date.now() - mountTimeRef.current;
//       if (timeElapsed > 60000 && widgetRef.current) { // 1 minute
//         console.log("Widget is stale, destroying it");
//         try {
//           widgetRef.current.destroy();
//           widgetRef.current = null;
//         } catch (e) {
//           console.warn("Error destroying stale widget:", e);
//         }
//       }
//     };

//     const intervalId = setInterval(checkStale, 30000); // Check every 30 seconds

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   // Initialize Cloudinary widget when script is loaded - with useEffect cleanup
//   useEffect(() => {
//     // Clean up existing widget to avoid memory leaks
//     const destroyWidget = () => {
//       if (widgetRef.current) {
//         try {
//           widgetRef.current.destroy();
//           widgetRef.current = null;
//           console.log("Widget destroyed");
//         } catch (e) {
//           console.warn("Error destroying widget:", e);
//         }
//       }
//     };

//     // Return early if conditions not met
//     if (!scriptLoaded || !uploadConfig) return destroyWidget;

//     // Don't recreate if we already have a widget
//     if (widgetRef.current) return destroyWidget;

//     console.log("Initializing Cloudinary widget with config:", uploadConfig);

//     // Convert context string to object with modern array methods and nullish coalescing
//     const contextObj = uploadConfig.context?.split('|').reduce<Record<string, string>>((obj, pair) => {
//       const [key, value] = pair.split('=');
//       if (key && value) obj[key] = value;
//       return obj;
//     }, {}) ?? {};

//     // Convert tags string to array with optional chaining and nullish coalescing
//     const tagsArray = uploadConfig.tags?.split(',') ?? [];

//     // Get unique key based on timestamp
//     const widgetUniqueId = `widget-${containerKey}-${Date.now()}`;

//     // Create options for Cloudinary widget - based on uploadConfig
//     const options = {
//       cloudName: uploadConfig.cloudName,
//       apiKey: uploadConfig.apiKey,
//       uploadPreset: uploadConfig.uploadPreset,
//       folder: uploadConfig.folder,
//       source: uploadConfig.source ?? 'uw', // 'uw' = upload widget
//       tags: tagsArray,
//       context: contextObj,
//       // UI/UX parameters that don't affect the signature
//       sources: ['local', 'url', 'camera'] as const,
//       multiple: false,
//       maxFiles: 1,
//       resourceType: 'image' as const,
//       clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
//       showAdvancedOptions: false,
//       cropping: true,
//       croppingAspectRatio: 1,
//       croppingShowDimensions: true,
//       language: 'da',
//       text: {
//         'en': {
//           'upload': `Upload ${entityTypeName} billede`,
//           'drag_drop': 'Træk og slip billede her',
//           'drop_file': 'Slip billede for at uploade',
//           'or': 'eller',
//           'select_file': 'Vælg billede',
//           'local': 'Enhed',
//           'camera': 'Kamera',
//           'url': 'URL',
//           'back': 'Tilbage',
//           'remove': 'Fjern',
//           'crop': 'Beskær'
//         }
//       },
//       // Add a unique ID for each widget instance
//       widgetId: widgetUniqueId
//     };

//     // Create widget with window?.cloudinary optional chaining
//     if (window?.cloudinary) {
//       console.log("Creating Cloudinary widget");
//       try {
//         widgetRef.current = window.cloudinary.createUploadWidget(
//           options,
//           handleWidgetCallback
//         );
//         console.log("Widget created successfully");
//       } catch (err) {
//         console.error("Error creating widget:", err);
//         setError(err instanceof Error ? err.message : 'Kunne ikke initialisere upload widget');
//       }
//     } else {
//       console.error("Cloudinary object not available");
//       setError('Cloudinary blev ikke indlæst korrekt');
//     }

//     // Reset mount time
//     mountTimeRef.current = Date.now();

//     // Cleanup function for useEffect
//     return destroyWidget;
//   }, [scriptLoaded, uploadConfig, handleWidgetCallback, entityTypeName, containerKey]);

//   // Handle click on upload button with useCallback
//   const handleOpenWidget = useCallback(() => {
//     if (isDisabled) return;

//     // Check for stale widget
//     const timeSinceMount = Date.now() - mountTimeRef.current;
//     if (timeSinceMount > 60000) { // 1 minut
//       console.log("Widget might be stale, reinitializing");

//       // Destroy current widget if it exists
//       if (widgetRef.current) {
//         try {
//           widgetRef.current.destroy();
//           widgetRef.current = null;
//         } catch (err) {
//           // Ignore errors during cleanup
//           console.warn("Error destroying stale widget:", err);
//         }
//       }

//       setError('Upload widget blev genindlæst. Prøv venligst igen.');
//       return;
//     }

//     setError(null);
//     setDebug(null);

//     if (widgetRef.current) {
//       console.log("Opening widget");
//       try {
//         widgetRef.current.open();
//       } catch (err) {
//         console.error("Error opening widget:", err);
//         setError(err instanceof Error ? err.message : 'Kunne ikke åbne upload widget');
//         setIsLoading(false);
//       }
//     } else {
//       console.error("Widget not initialized");
//       setError('Upload widget er ikke initialiseret endnu');
//     }
//   }, [isDisabled]);

//   // Handle script error with useCallback
//   const handleScriptError = useCallback((e: Error) => {
//     console.error("Error loading script:", e);
//     setError('Kunne ikke indlæse Cloudinary');
//   }, []);

//   // Use a wrapper element to simulate disabled state for consistency
//   if (isDisabled) {
//     return (
//       <div className="flex flex-col gap-2">
//         <button
//           type="button"
//           className="w-full py-2 px-4 bg-blue-400 text-white font-medium rounded-lg cursor-not-allowed"
//           disabled
//         >
//           {isLoading ? (
//             <div className="flex items-center justify-center gap-2">
//               <Spinner size="sm" color="white" />
//               <span>Uploader...</span>
//             </div>
//           ) : (
//             'Upload Billede'
//           )}
//         </button>

//         <p className="text-xs text-zinc-400">
//           {remainingUploads > 0
//             ? `Du kan uploade ${remainingUploads} billede${remainingUploads !== 1 ? 'r' : ''} mere`
//             : 'Du har nået grænsen for antal billeder'
//           }
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-2" key={containerKey}>
//       {/* Load Cloudinary Script */}
//       <Script
//         src="https://upload-widget.cloudinary.com/global/all.js"
//         onLoad={handleScriptLoad}
//         onError={handleScriptError}
//         strategy="lazyOnload"
//       />

//       {/* Use button instead of HeroUI Button to avoid nesting issues */}
//       <button
//         type="button"
//         onClick={handleOpenWidget}
//         disabled={!scriptLoaded}
//         className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors
//           ${!scriptLoaded ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
//       >
//         {isLoading ? (
//           <div className="flex items-center justify-center gap-2">
//             <Spinner size="sm" color="white" />
//             <span>Uploader...</span>
//           </div>
//         ) : (
//           'Upload Billede'
//         )}
//       </button>

//       {error && (
//         <p className="text-red-500 text-sm">{error}</p>
//       )}

//       {debug && (
//         <p className="text-xs text-orange-500 mt-1 break-all">{debug}</p>
//       )}

//       <p className="text-xs text-zinc-400">
//         {remainingUploads > 0
//           ? `Du kan uploade ${remainingUploads} billede${remainingUploads !== 1 ? 'r' : ''} mere`
//           : 'Du har nået grænsen for antal billeder'
//         }
//       </p>
//     </div>
//   );
// }