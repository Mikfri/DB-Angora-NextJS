// // src/components/cloudinary/CloudinaryUploadWidget.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { CldUploadWidget } from 'next-cloudinary';
// import type { 
//   CloudinaryUploadWidgetResults, 
//   CloudinaryUploadWidgetOptions
// } from 'next-cloudinary';
// import { CloudinaryPhotoRegistryRequestDTO, CloudinaryUploadConfigDTO } from '@/api/types/AngoraDTOs';
// import { Spinner } from '@heroui/react';

// // Generisk interface uden earCombId
// interface CloudinaryUploadWidgetProps {
//   uploadConfig: CloudinaryUploadConfigDTO;
//   maxImageCount: number;
//   currentImageCount: number;
//   onPhotoUploaded: (photoData: CloudinaryPhotoRegistryRequestDTO) => Promise<void>;
// }

// // Interface for upload results info
// interface CloudinaryUploadInfo {
//   public_id: string;
//   secure_url: string;
//   original_filename: string;
//   width: number;
//   height: number;
//   format: string;
//   resource_type: string;
//   bytes: number;
//   asset_id: string;
//   [key: string]: string | number | boolean | undefined;
// }

// export default function CloudinaryUploadWidget({
//   uploadConfig,
//   maxImageCount,
//   currentImageCount,
//   onPhotoUploaded
// }: CloudinaryUploadWidgetProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [debug, setDebug] = useState<string | null>(null);
  
//   useEffect(() => {
//     console.log("Upload config from backend:", uploadConfig);
//   }, [uploadConfig]);
  
//   const remainingUploads = maxImageCount - currentImageCount;
//   const isDisabled = remainingUploads <= 0 || isLoading;
  
//   const handleUploadSuccess = async (results: CloudinaryUploadWidgetResults) => {
//     try {
//       console.log("Upload success results:", results);
//       setIsLoading(true);
      
//       // Vi tjekker først om results er succesfulde 
//       if (!results.info || results.event !== 'success') {
//         setError('Manglende information fra Cloudinary');
//         setIsLoading(false);
//         return;
//       }
      
//       // Type casting til det forventede format
//       const info = results.info as CloudinaryUploadInfo;
      
//       // Opret DTO til registrering i backend - med dynamisk entityType og entityId
//       const photoData: CloudinaryPhotoRegistryRequestDTO = {
//         publicId: info.public_id,
//         cloudinaryUrl: info.secure_url,
//         fileName: info.original_filename,
//         entityId: uploadConfig.entityId,
//         entityType: uploadConfig.entityType
//       };
      
//       console.log("Sending to backend:", photoData);
//       await onPhotoUploaded(photoData);
//       setIsLoading(false);
//     } catch (err) {
//       console.error("Error registering photo:", err);
//       setError('Billedet blev uploadet, men ikke registreret i systemet');
//       setIsLoading(false);
//     }
//   };
  
//   // Byg det nødvendige options objekt
//   const getCloudinaryOptions = (): CloudinaryUploadWidgetOptions => {
//     // Konverter context string til et objekt
//     const contextObj = uploadConfig.context ? 
//       uploadConfig.context.split('|').reduce((obj: Record<string, string>, pair) => {
//         const [key, value] = pair.split('=');
//         if (key && value) {
//           obj[key] = value;
//         }
//         return obj;
//       }, {}) 
//       : {};
      
//     // Konverter tags string til et array
//     const tagsArray = uploadConfig.tags ? uploadConfig.tags.split(',') : [];
    
//     return {
//       // Cloudinary widget options - korrekt typet
//       cloudName: uploadConfig.cloudName,
//       uploadPreset: uploadConfig.uploadPreset,
//       folder: uploadConfig.folder,
//       tags: tagsArray,
//       context: contextObj,
//       sources: ['local', 'url', 'camera'],
//       multiple: false,
//       maxFiles: 1,
//       resourceType: "image",
//       clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
//       showAdvancedOptions: false,
//       cropping: true,
//       croppingAspectRatio: 1,
//       croppingShowDimensions: true,
//       language: 'da',
//       text: {
//         'en': {
//           'upload': 'Upload billede',
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
//       }
//     };
//   };
  
//   // Vi bruger et wrapper element til at simulere disabled state
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
//     <div className="flex flex-col gap-2">
//       {/* Tilbage til CldUploadWidget med render prop mønster */}
//       <CldUploadWidget
//         uploadPreset={uploadConfig.uploadPreset}
//         options={getCloudinaryOptions()}
//         onSuccess={handleUploadSuccess}
//         onOpen={() => setIsLoading(true)}
//         onClose={() => setIsLoading(false)}
//         onError={(error) => {
//           console.error('Detailed upload error:', error);
//           setError('Der opstod en fejl under upload');
//           setIsLoading(false);
//           if (error?.toString) {
//             setDebug(error.toString());
//           }
//         }}
//       >
//         {({ open }) => (
//           <button
//             type="button"
//             onClick={() => open()}
//             className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center gap-2">
//                 <Spinner size="sm" color="white" />
//                 <span>Uploader...</span>
//               </div>
//             ) : (
//               'Upload Billede'
//             )}
//           </button>
//         )}
//       </CldUploadWidget>
      
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