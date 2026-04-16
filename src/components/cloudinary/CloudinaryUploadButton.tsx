// src/components/cloudinary/CloudinaryUploadButton.tsx

/**
 * CloudinaryUploadButton
 * ----------------------
 * Thin wrapper around next-cloudinary's CldUploadWidget.
 *
 * Eliminerer behovet for manuel script-loading, widget-lifecycle og cleanup
 * som SimpleCloudinaryWidget håndterer selv. CldUploadWidget fra next-cloudinary
 * loader scriptet via Next.js' eget Script-system og holder widgetten i live
 * som en forankret komponent — du kalder blot open() for at vise den.
 *
 * Brug:
 *   <CloudinaryUploadButton uploadConfig={config} onPhotoUploaded={handler}>
 *     {(open) => <button type="button" onClick={open}>Upload</button>}
 *   </CloudinaryUploadButton>
 */

'use client';

import type { ReactNode } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import type {
    CloudinaryUploadWidgetInfo,
    CloudinaryUploadWidgetInstanceMethods,
} from '@cloudinary-util/types';
import type { CloudinaryUploadConfigDTO, CloudinaryPhotoRegistryRequestDTO } from '@/api/types/AngoraDTOs';

interface CloudinaryUploadButtonProps {
    uploadConfig: CloudinaryUploadConfigDTO;
    onPhotoUploaded: (photoData: CloudinaryPhotoRegistryRequestDTO) => Promise<void>;
    onClose?: () => void;
    /** Render prop — giver dig en open() funktion der åbner widgetten */
    children: (open: CloudinaryUploadWidgetInstanceMethods['open']) => ReactNode;
}

export default function CloudinaryUploadButton({
    uploadConfig,
    onPhotoUploaded,
    onClose,
    children,
}: CloudinaryUploadButtonProps) {
    // Omdan "key1=val1|key2=val2" → { key1: 'val1', key2: 'val2' }
    const contextObj: Record<string, string> = {};
    if (uploadConfig.context) {
        uploadConfig.context.split('|').forEach((pair) => {
            const [key, value] = pair.split('=');
            if (key && value) contextObj[key] = value;
        });
    }

    const tagsArray = uploadConfig.tags
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean) ?? [];

    // Only pass cloudName/apiKey in config when they are non-null strings.
    // next-cloudinary's L() resolves cloudName via Object.assign(computed, e) which means
    // passing cloudName:null from the API would overwrite the env-var fallback computed inside L().
    // When omitted, L() reads NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME from the compiled env instead.
    const cloudConfig = uploadConfig.cloudName
        ? { cloud: { cloudName: uploadConfig.cloudName, apiKey: uploadConfig.apiKey || undefined } }
        : undefined;

    return (
        <CldUploadWidget
            uploadPreset={uploadConfig.uploadPreset}
            config={cloudConfig}
            options={{
                folder: uploadConfig.folder,
                tags: tagsArray,
                context: contextObj,
                sources: ['local', 'camera', 'url'],
                multiple: false,
                resourceType: 'image',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                cropping: true,
                croppingShowDimensions: true,
                showAdvancedOptions: false,
                showPoweredBy: false,
                language: 'da',
                styles: {
                    palette: {
                        window: 'rgba(40, 40, 40)',
                        windowBorder: 'rgba(70, 70, 70, 0.5)',
                        tabIcon: '#FFFFFF',
                        menuIcons: '#CCCCCC',
                        textDark: '#FFFFFF',
                        textLight: '#FFFFFF',
                        link: '#0078FF',
                        action: '#0078FF',
                        inactiveTabIcon: '#999999',
                        error: '#FF0000',
                        inProgress: '#0078FF',
                        complete: '#20B832',
                        sourceBg: 'rgba(35, 35, 35)',
                    },
                    frame: {
                        background: 'rgba(20, 20, 20, 0.7)',
                    },
                },
            }}
            onSuccess={(results) => {
                if (results.event !== 'success') return;
                const info = results.info as CloudinaryUploadWidgetInfo | undefined;
                if (!info || typeof info === 'string') return;

                onPhotoUploaded({
                    cloudinaryPublicId: info.public_id,
                    cloudinaryUrl: info.secure_url,
                    fileName: info.original_filename,
                    entityStringId: uploadConfig.entityId,
                    entityIntId: 0,
                    entityType: uploadConfig.entityType,
                }).catch((err) => console.error('Fejl ved registrering af billede:', err));
            }}
            onClose={onClose}
        >
            {({ open }) => children(open)}
        </CldUploadWidget>
    );
}
