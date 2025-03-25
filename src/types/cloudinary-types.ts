// // src/types/cloudinary-types.ts

// // Fælles interfaces for Cloudinary integration
// export interface CloudinaryWidget {
//     open: () => void;
//     close: () => void;
//     destroy: () => void;
//   }
  
//   export interface CloudinaryUploadResultInfo {
//     public_id: string;
//     secure_url: string;
//     original_filename: string;
//     [key: string]: unknown;
//   }
  
//   export interface CloudinaryResult {
//     event: string;
//     info?: CloudinaryUploadResultInfo;
//   }
  
//   export interface CloudinaryError {
//     message?: string;
//     toString?: () => string;
//     statusText?: string;
//     status?: number;
//     [key: string]: unknown;
//   }
  
//   export interface CloudinaryWithWidgets {
//     createUploadWidget: (
//       options: Record<string, unknown>,
//       callback: (error: CloudinaryError | null, result?: CloudinaryResult) => void
//     ) => CloudinaryWidget;
//     _widgets?: Array<{
//       remove?: () => void;
//       destroy?: () => void;
//       id?: string;
//       [key: string]: unknown;
//     }>;
//   }
  
//   // Extend Window interface to include Cloudinary
//   declare global {
//     interface Window {
//       cloudinary?: CloudinaryWithWidgets;
//     }
//   }