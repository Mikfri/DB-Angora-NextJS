// // src/components/cloudinary/CloudinaryUploadWidget.tsx

// /**
//  * Det ser ud til, at problemet fortsat er i Cloudinary's JavaScript bibliotek med fejlen:
//  * "Cannot read properties of null (reading 'sendDisplayChangedCallback')".
//  * Derfor benytter vi ikke denne fil men bruger Cloudinary's widget API direkte..
//  * .. i stedet for at bruge next-cloudinary pakken.
//  * Go til src/components/cloudinary/CustomCloudinaryUploadWidget.tsx
//  */

// 'use client';

// import { useState, useCallback } from 'react';
// import { CldUploadButton } from 'next-cloudinary';
// import type { 
//   CloudinaryUploadWidgetResults, 
//   CloudinaryUploadWidgetOptions 
// } from 'next-cloudinary';
// import { CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO } from '@/api/types/AngoraDTOs';
// import { Spinner } from '@heroui/react';

// interface CloudinaryUploadWidgetProps {
//   uploadConfig: CloudinaryUploadConfigDTO;
//   maxImageCount: number;
//   currentImageCount: number;
//   onPhotoUploaded: (photoData: CloudinaryPhotoRegistryRequestDTO) => Promise<void>;
// }

// // Type for CloudinaryUploadWidgetInfo
// interface CloudinaryUploadInfo {
//   public_id: string;
//   secure_url: string;
//   original_filename: string;
//   // Erstat 'any' med mere specifikke typer
//   [key: string]: string | number | boolean | null | undefined;
// }

// // Vi bruger det specifikke resultat-type fra Cloudinary
// interface CloudinaryUploadResult {
//   event: string;
//   info: CloudinaryUploadInfo;
// }

// export default function CloudinaryUploadWidget({
//   uploadConfig,
//   maxImageCount,
//   currentImageCount,
//   onPhotoUploaded
// }: CloudinaryUploadWidgetProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
  
//   const remainingUploads = maxImageCount - currentImageCount;
//   const isDisabled = remainingUploads <= 0 || isLoading;
  
//   // Vi bruger useCallback for at sikre, at funktioner ikke genskabes ved hvert render
//   const handleUploadSuccess = useCallback(async (result: CloudinaryUploadResult) => {
//     try {
//       console.log("Upload success result:", result);
//       setIsLoading(true);
//       setError(null);
      
//       // Null check med optional chaining og nullish coalescing
//       if (!result?.info) {
//         throw new Error('Manglende info fra Cloudinary upload');
//       }
      
//       // Opret DTO til registrering i backend med destrukturering
//       const { public_id, secure_url, original_filename } = result.info;
      
//       const photoData: CloudinaryPhotoRegistryRequestDTO = {
//         publicId: public_id,
//         cloudinaryUrl: secure_url,
//         fileName: original_filename,
//         entityId: uploadConfig.entityId,
//         entityType: uploadConfig.entityType
//       };
      
//       // Kald callbacken
//       await onPhotoUploaded(photoData);
      
//     } catch (err) {
//       // Forbedret fejlhåndtering med instanceof
//       if (err instanceof Error) {
//         console.error("Error registering photo:", err.message);
//         setError(err.message || 'Billedet blev uploadet, men ikke registreret i systemet');
//       } else {
//         console.error("Unknown error:", err);
//         setError('Ukendt fejl under upload');
//       }
//     } finally {
//       // Brug finally til oprydning - kører altid, uanset om der var fejl eller ej
//       setIsLoading(false);
//     }
//   }, [uploadConfig, onPhotoUploaded]);
  
//   // Conditionally render baseret på disabled state
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
  
//   // Brug object spread til at kombinere standard- og custom options
//   const uploadOptions: CloudinaryUploadWidgetOptions = {
//     // Basisindstillinger fra uploadConfig
//     uploadPreset: uploadConfig.uploadPreset,
//     folder: uploadConfig.folder,
//     tags: uploadConfig.tags?.split(',') || [],
    
//     // Yderligere indstillinger
//     sources: ['local', 'url', 'camera'] as const,
//     multiple: false,
//     maxFiles: 1,
//     clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
//     showAdvancedOptions: false,
//     cropping: true,
//     croppingAspectRatio: 1,
//     croppingShowDimensions: true,
//     language: 'da',
    
//     // Tilpasset tekst
//     text: {
//       'en': {
//         'upload': 'Upload billede',
//         'drag_drop': 'Træk og slip billede her',
//         'drop_file': 'Slip billede for at uploade',
//         'or': 'eller',
//         'select_file': 'Vælg billede',
//         'local': 'Enhed',
//         'camera': 'Kamera',
//         'url': 'URL',
//         'back': 'Tilbage',
//         'remove': 'Fjern',
//         'crop': 'Beskær'
//       }
//     }
//   };

//   // Håndtering af succesfuld upload med nullish coalescing
//   const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
//     if (!result?.info) {
//       console.error('Missing info in upload result', result);
//       setError('Der mangler information fra upload');
//       return;
//     }
    
//     try {
//       // Sikre os at info er af den rette type med nullish coalescing og optional chaining
//       const uploadInfo = typeof result.info === 'string' 
//         ? JSON.parse(result.info) 
//         : result.info;
        
//       // CldUploadButton giver resultat direkte via onSuccess
//       handleUploadSuccess({
//         event: 'success',
//         info: {
//           public_id: uploadInfo.public_id,
//           secure_url: uploadInfo.secure_url,
//           original_filename: uploadInfo.original_filename ?? 'unknown' // Nullish coalescing
//         }
//       });
//     } catch (err) {
//       if (err instanceof SyntaxError) {
//         setError('Fejl ved tolkning af upload-resultat');
//       } else if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('Ukendt fejl under håndtering af upload');
//       }
//       setIsLoading(false);
//     }
//   };
  
//   return (
//     <div className="flex flex-col gap-2">
//       <CldUploadButton
//         uploadPreset={uploadConfig.uploadPreset}
//         options={uploadOptions}
//         onSuccess={handleSuccess}
//         onOpen={() => {
//           setIsLoading(true);
//           setError(null);
//         }}
//         onClose={() => setIsLoading(false)}
//         onError={(err) => {
//           console.error('Upload error:', err);
//           setError(typeof err === 'string' ? err : 'Der opstod en fejl under upload');
//           setIsLoading(false);
//         }}
//         className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
//       >
//         {isLoading ? (
//           <div className="flex items-center justify-center gap-2">
//             <Spinner size="sm" color="white" />
//             <span>Uploader...</span>
//           </div>
//         ) : (
//           'Upload Billede'
//         )}
//       </CldUploadButton>
      
//       {error && (
//         <p className="text-red-500 text-sm">{error}</p>
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