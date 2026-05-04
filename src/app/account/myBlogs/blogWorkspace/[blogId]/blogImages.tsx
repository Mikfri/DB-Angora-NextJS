// src/app/account/myBlogs/blogWorkspace/[blogId]/blogImages.tsx

/**
 * Ansvar:
 * Håndterer bloggens billedbibliotek i workspace (upload, visning, featured og sletning).
 *
 * Funktion:
 * - Henter upload-konfiguration og åbner Cloudinary-widget
 * - Registrerer uploadede billeder på bloggen
 * - Viser eksisterende billeder og tillader featured/slet
 * - Udstiller opdateringshooks tilbage til parent ved ændringer
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Card } from '@heroui/react';
import { FaUpload, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import CloudinaryUploadButton from '@/components/cloudinary/CloudinaryUploadButton';
import CloudinaryImage from '@/components/cloudinary/CloudinaryImage';
import { 
    fetchBlogImageUploadConfigAction, 
    registerCloudinaryBlogPhotoAction,
    deleteBlogPhotoAction,
    updateBlogFeaturedImageAction 
} from '@/app/actions/blog/blogActions';
import type { CloudinaryUploadConfigDTO, PhotoPrivateDTO, CloudinaryPhotoRegistryRequestDTO } from '@/api/types/AngoraDTOs';
import { toast } from 'react-toastify';

interface BlogImageSectionProps {
    blogId: number;
    currentPhotos?: PhotoPrivateDTO[];
    featuredImageId?: number;
    onPhotosUpdated?: () => void;
}

export default function BlogImageSection({ 
    blogId, 
    currentPhotos = [], 
    featuredImageId,
    onPhotosUpdated 
}: BlogImageSectionProps) {
    const [photos, setPhotos] = useState<PhotoPrivateDTO[]>(currentPhotos);
    const [uploadConfig, setUploadConfig] = useState<CloudinaryUploadConfigDTO | null>(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isSettingFeatured, setIsSettingFeatured] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const openWidgetRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        setPhotos(currentPhotos);
    }, [currentPhotos]);

    // Hent upload-config ved mount så widgetten kan åbne øjeblikkeligt
    useEffect(() => {
        setIsLoadingConfig(true);
        setError(null);
        fetchBlogImageUploadConfigAction(blogId)
            .then((result) => {
                if (result.success) {
                    setUploadConfig(result.data);
                } else {
                    const errorMsg = `Kunne ikke hente upload konfiguration: ${result.error}`;
                    setError(errorMsg);
                    toast.error(errorMsg);
                }
            })
            .catch(() => {
                const errorMsg = 'Der skete en fejl ved forberedelse af upload';
                setError(errorMsg);
                toast.error(errorMsg);
            })
            .finally(() => setIsLoadingConfig(false));
    }, [blogId]);

    const handlePhotoUploaded = useCallback(async (photoData: CloudinaryPhotoRegistryRequestDTO) => {
        try {
            const result = await registerCloudinaryBlogPhotoAction(blogId, photoData);
            if (result.success) {
                setPhotos(prev => [...prev, result.data]);
                if (onPhotosUpdated) onPhotosUpdated();
                toast.success('Billede uploadet og registreret!');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Fejl ved registrering af billede';
            setError(errorMsg);
            toast.error(errorMsg);
            console.error('Registrering fejl:', error);
        }
    }, [blogId, onPhotosUpdated]);

    const handleDeletePhoto = useCallback(async (photoId: number) => {
        // Bekræftelsesdialog
        const photoToDelete = photos.find(p => p.id === photoId);
        const photoName = photoToDelete?.fileName || 'dette billede';
        
        // Brug browser confirm indtil du har en pænere modal
        if (!confirm(`Er du sikker på at du vil slette "${photoName}"?`)) return;

        setIsDeleting(photoId);
        setError(null);
        
        try {
            const result = await deleteBlogPhotoAction(blogId, photoId);
            if (result.success) {
                setPhotos(prev => prev.filter(p => p.id !== photoId));
                if (onPhotosUpdated) onPhotosUpdated();
                toast.success('Billede slettet!');
            } else {
                const errorMsg = `Kunne ikke slette billede: ${result.error}`;
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error) {
            const errorMsg = 'Der skete en fejl ved sletning af billedet';
            setError(errorMsg);
            toast.error(errorMsg);
            console.error('Sletning fejl:', error);
        } finally {
            setIsDeleting(null);
        }
    }, [blogId, onPhotosUpdated, photos]);

    const handleSetFeaturedImage = useCallback(async (photoId: number) => {
        setIsSettingFeatured(photoId);
        setError(null);
        
        try {
            const result = await updateBlogFeaturedImageAction(blogId, photoId);
            if (result.success) {
                if (onPhotosUpdated) onPhotosUpdated();
                toast.success('Featured image opdateret!');
            } else {
                const errorMsg = `Kunne ikke sætte featured image: ${result.error}`;
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error) {
            const errorMsg = 'Der skete en fejl ved opdatering af featured image';
            setError(errorMsg);
            toast.error(errorMsg);
            console.error('Featured image fejl:', error);
        } finally {
            setIsSettingFeatured(null);
        }
    }, [blogId, onPhotosUpdated]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-heading">Blog Billeder</h3>
                <Button
                    variant="primary"
                    onPress={() => openWidgetRef.current?.()}
                    isPending={isLoadingConfig}
                    isDisabled={isLoadingConfig || !uploadConfig}
                >
                    <FaUpload /> Upload Billede
                </Button>
            </div>

            {/* Fejlmeddelelse */}
            {error && (
                <Card className="bg-red-500/10 border-red-500/50">
                    <Card.Content>
                        <p className="text-red-300 text-sm">{error}</p>
                    </Card.Content>
                </Card>
            )}

            {/* CloudinaryUploadButton er usynligt mountet — open() bruges af upload-knapper */}
            {uploadConfig && (
                <CloudinaryUploadButton
                    uploadConfig={uploadConfig}
                    onPhotoUploaded={handlePhotoUploaded}
                >
                    {(open) => {
                        openWidgetRef.current = open;
                        return null;
                    }}
                </CloudinaryUploadButton>
            )}

            {/* Photos Grid */}
            {photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                        <Card key={photo.id} className="bg-content2 border-divider">
                            <Card.Content className="p-2">
                                <div className="relative">
                                    <CloudinaryImage
                                        publicId={photo.cloudinaryPublicId}
                                        alt={photo.fileName || 'Blog billede'}
                                        width={300}
                                        height={200}
                                        className="w-full h-48 object-cover rounded"
                                        fallbackSrc={photo.filePath}
                                    />
                                    
                                    {/* Featured indicator */}
                                    {featuredImageId === photo.id && (
                                        <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold">
                                            Featured
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-2 space-y-2">
                                    <p className="text-sm text-muted truncate">
                                        {photo.fileName || 'Unavngivet'}
                                    </p>
                                    
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={featuredImageId === photo.id ? "warning" as any : "ghost"}
                                            onPress={() => handleSetFeaturedImage(photo.id)}
                                            isPending={isSettingFeatured === photo.id}
                                            className="flex-1"
                                            isDisabled={isSettingFeatured !== null || isDeleting !== null}
                                        >
                                            {featuredImageId === photo.id ? <FaStar /> : <FaRegStar />}
                                            {featuredImageId === photo.id ? 'Featured' : 'Sæt Featured'}
                                        </Button>
                                        
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onPress={() => handleDeletePhoto(photo.id)}
                                            isPending={isDeleting === photo.id}
                                            isIconOnly
                                            isDisabled={isSettingFeatured !== null || isDeleting !== null}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="bg-content2 border-divider">
                    <Card.Content className="text-center py-8">
                        <p className="text-muted mb-4">Ingen billeder uploadet endnu</p>
                        <Button
                            variant="primary"
                            onPress={() => openWidgetRef.current?.()}
                            isPending={isLoadingConfig}
                            isDisabled={isLoadingConfig || !uploadConfig}
                        >
                            <FaUpload /> Upload Dit Første Billede
                        </Button>
                    </Card.Content>
                </Card>
            )}
        </div>
    );
}
