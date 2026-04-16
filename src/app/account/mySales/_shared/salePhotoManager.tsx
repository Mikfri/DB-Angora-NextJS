// src/app/account/mySales/_shared/salePhotoManager.tsx

/**
 * SalePhotoManager
 * ----------------
 * Administrerer billeder tilknyttet en salgsannonce.
 * - Henter upload-konfiguration Ã©n gang ved mount (ikke lazy) sÃ¥ widgetten Ã¥bner Ã¸jeblikkeligt.
 * - Bruger CloudinaryUploadButton (next-cloudinary CldUploadWidget) i stedet for SimpleCloudinaryWidget
 *   â€” undgÃ¥r alle script-lifecycle og cleanup-problemer.
 * - Viser thumbnails i en vandret rÃ¦kke med hover-overlay til profilbillede og slet.
 * - Efter enhver mutation: refreshProfile() + router.refresh().
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/heroui';
import CloudinaryUploadButton from '@/components/cloudinary/CloudinaryUploadButton';
import { useSaleWorkspace } from '@/contexts/SaleWorkspaceContext';
import {
    requestUploadPermission,
    savePhoto,
    updateProfilePhoto,
    deletePhoto,
} from '@/app/actions/sales/salesManagementAcions';
import { CloudinaryUploadConfigDTO, CloudinaryPhotoRegistryRequestDTO } from '@/api/types/AngoraDTOs';
import { FaStar, FaRegStar, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function SalePhotoManager() {
    const { profile, refreshProfile } = useSaleWorkspace();
    const router = useRouter();

    const [uploadConfig, setUploadConfig] = useState<CloudinaryUploadConfigDTO | null>(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);
    const [loadingProfileAction, setLoadingProfileAction] = useState<number | null>(null);
    const [loadingDeleteAction, setLoadingDeleteAction] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const photos = profile?.photos ?? [];

    // Hent upload-tilladelse ved mount så widgetten kan åbne øjeblikkeligt ved klik
    useEffect(() => {
        if (!profile) return;
        setIsLoadingConfig(true);
        requestUploadPermission(profile.id).then((result) => {
            if (result.success) {
                setUploadConfig(result.data);
            } else {
                setError(result.error);
            }
        }).finally(() => setIsLoadingConfig(false));
    }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePhotoUploaded = useCallback(async (photoData: CloudinaryPhotoRegistryRequestDTO): Promise<void> => {
        if (!profile || !uploadConfig) return;
        const result = await savePhoto(profile.id, {
            ...photoData,
            entityStringId: uploadConfig.entityId,
            entityIntId: profile.id,
            entityType: uploadConfig.entityType,
        });
        if (!result.success) {
            toast.error(result.error);
            return;
        }
        toast.success('Billede uploadet');
        await refreshProfile();
        router.refresh();
    }, [profile, uploadConfig, refreshProfile, router]);

    const handleWidgetClose = useCallback(async () => {
        await refreshProfile();
        router.refresh();
    }, [refreshProfile, router]);

    const handleSetAsProfile = useCallback(async (photoId: number) => {
        if (!profile) return;
        setLoadingProfileAction(photoId);
        const result = await updateProfilePhoto(profile.id, photoId);
        if (result.success) {
            toast.success('Profilbillede opdateret');
            await refreshProfile();
            router.refresh();
        } else {
            toast.error(result.error);
        }
        setLoadingProfileAction(null);
    }, [profile, refreshProfile, router]);

    const handleDeletePhoto = useCallback(async (photoId: number) => {
        if (!profile) return;
        setLoadingDeleteAction(photoId);
        const result = await deletePhoto(profile.id, photoId);
        if (result.success) {
            toast.success('Billede slettet');
            await refreshProfile();
            router.refresh();
        } else {
            toast.error(result.error);
        }
        setLoadingDeleteAction(null);
    }, [profile, refreshProfile, router]);

    return (
        <div className="space-y-2 border-t border-divider pt-3">
            {/* Label */}
            <div className="flex items-center gap-2 px-3">
                <p className="text-xs font-medium text-foreground/60">Billeder</p>
                <span className="text-xs text-foreground/40">({photos.length})</span>
            </div>

            {/* Fejlbesked */}
            {error && (
                <div className="mx-3 rounded-lg border border-danger/30 bg-danger/10 p-2">
                    <p className="text-xs text-danger">{error}</p>
                </div>
            )}

            {/* Thumbnail-rÃ¦kke + upload-zone */}
            <div className="flex gap-2 overflow-x-auto px-3 pb-1">

                {/* Eksisterende billeder */}
                {photos.map((photo) => {
                    const isProfile = photo.filePath === profile?.profilePhotoUrl;
                    const isProfileLoading = loadingProfileAction === photo.id;
                    const isDeleteLoading = loadingDeleteAction === photo.id;
                    const isBusy = isProfileLoading || isDeleteLoading;

                    return (
                        <div
                            key={photo.id}
                            className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden group border-2 transition-colors ${isProfile ? 'border-warning' : 'border-transparent'}`}
                        >
                            <Image
                                src={photo.filePath}
                                alt={photo.fileName}
                                fill
                                className="object-cover"
                                unoptimized
                            />

                            {isProfile && (
                                <div className="absolute top-1 left-1 rounded-full bg-warning/90 p-0.5">
                                    <FaStar size={9} className="text-white" />
                                </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                                {!isProfile && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetAsProfile(photo.id)}
                                        disabled={isBusy}
                                        title="Sæt som profilbillede"
                                        className="rounded-full bg-warning/80 p-1.5 transition-colors hover:bg-warning disabled:opacity-50"
                                    >
                                        {isProfileLoading
                                            ? <Spinner size="sm" />
                                            : <FaRegStar size={11} className="text-white" />
                                        }
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeletePhoto(photo.id)}
                                    disabled={isBusy}
                                    title="Slet billede"
                                    className="rounded-full bg-danger/80 p-1.5 transition-colors hover:bg-danger disabled:opacity-50"
                                >
                                    {isDeleteLoading
                                        ? <Spinner size="sm" />
                                        : <FaTrash size={11} className="text-white" />
                                    }
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Upload-zone â€” CloudinaryUploadButton er altid mountet (hvis config klar),
                     open() kaldes ved klik. Ingen script-lifecycle eller cleanup-problemer. */}
                {uploadConfig ? (
                    <CloudinaryUploadButton
                        uploadConfig={uploadConfig}
                        onPhotoUploaded={handlePhotoUploaded}
                        onClose={handleWidgetClose}
                    >
                        {(open) => (
                            <button
                                type="button"
                                onClick={() => open()}
                                title="Tilføj billede"
                                className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-foreground/20 text-foreground/40 transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary/60"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span className="text-center text-[10px] leading-tight">Tilføj<br />billede</span>
                            </button>
                        )}
                    </CloudinaryUploadButton>
                ) : (
                    <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-foreground/20 text-foreground/40 opacity-50">
                        {isLoadingConfig
                            ? <Spinner size="sm" />
                            : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            )
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
