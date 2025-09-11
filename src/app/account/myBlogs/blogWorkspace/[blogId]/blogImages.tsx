// src/app/account/myBlogs/blogWorkspace/[blogId]/blogImages.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, CardHeader, Spinner } from '@heroui/react';
import { FaUpload, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import SimpleCloudinaryWidget from '@/components/cloudinary/SimpleCloudinaryWidget';
import CloudinaryImage from '@/components/cloudinary/CloudinaryImage';
import { 
    fetchBlogImageUploadConfigAction, 
    registerCloudinaryBlogPhotoAction,
    deleteBlogPhotoAction,
    updateBlogFeaturedImageAction 
} from '@/app/actions/blog/blogActions';
import type { CloudinaryUploadConfigDTO, PhotoPrivateDTO, CloudinaryPhotoRegistryRequestDTO, PhotoDeleteDTO } from '@/api/types/AngoraDTOs';
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
    const [showUpload, setShowUpload] = useState(false);
    const [uploadConfig, setUploadConfig] = useState<CloudinaryUploadConfigDTO | null>(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isSettingFeatured, setIsSettingFeatured] = useState<number | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setPhotos(currentPhotos);
    }, [currentPhotos]);

    const handleUploadClick = useCallback(async () => {
        setIsLoadingConfig(true);
        setError(null);
        
        try {
            const result = await fetchBlogImageUploadConfigAction(blogId);
            if (result.success) {
                setUploadConfig(result.data);
                setShowUpload(true);
                toast.success('Upload konfiguration hentet');
            } else {
                const errorMsg = `Kunne ikke hente upload konfiguration: ${result.error}`;
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error) {
            const errorMsg = 'Der skete en fejl ved forberedelse af upload';
            setError(errorMsg);
            toast.error(errorMsg);
            console.error('Upload config fejl:', error);
        } finally {
            setIsLoadingConfig(false);
        }
    }, [blogId]);

    const handlePhotoUploaded = useCallback(async (photoData: CloudinaryPhotoRegistryRequestDTO) => {
        setIsRegistering(true);
        
        try {
            const result = await registerCloudinaryBlogPhotoAction(blogId, photoData);
            if (result.success) {
                setPhotos(prev => [...prev, result.data]);
                setShowUpload(false);
                setUploadConfig(null);
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
            throw error; // Lad widget håndtere fejlen
        } finally {
            setIsRegistering(false);
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
            const deletionDTO: PhotoDeleteDTO = {
                photoId: photoId,
                entityIntId: blogId
            };

            const result = await deleteBlogPhotoAction(deletionDTO);
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

    const handleCloseUpload = useCallback(() => {
        setShowUpload(false);
        setUploadConfig(null);
        setError(null);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-zinc-100">Blog Billeder</h3>
                <Button
                    color="primary"
                    onPress={handleUploadClick}
                    isLoading={isLoadingConfig}
                    startContent={<FaUpload />}
                    isDisabled={isLoadingConfig}
                >
                    Upload Billede
                </Button>
            </div>

            {/* Fejlmeddelelse */}
            {error && (
                <Card className="bg-red-500/10 border-red-500/50">
                    <CardBody>
                        <p className="text-red-300 text-sm">{error}</p>
                    </CardBody>
                </Card>
            )}

            {/* Upload Widget */}
            {showUpload && uploadConfig && (
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                        <div className="flex justify-between items-center w-full">
                            <h4 className="text-zinc-100">Upload Nyt Billede</h4>
                            <Button
                                size="sm"
                                variant="light"
                                onPress={handleCloseUpload}
                                isDisabled={isRegistering}
                            >
                                Luk
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {isRegistering && (
                            <div className="flex items-center gap-2 mb-4 text-blue-400">
                                <Spinner size="sm" color="primary" />
                                <span>Registrerer billede...</span>
                            </div>
                        )}
                        <SimpleCloudinaryWidget
                            uploadConfig={uploadConfig}
                            onPhotoUploaded={handlePhotoUploaded}
                            onComplete={handleCloseUpload}
                            onClose={handleCloseUpload}
                            widgetKey={`blog-${blogId}-${Date.now()}`}
                            forceReload={true}
                        />
                    </CardBody>
                </Card>
            )}

            {/* Photos Grid */}
            {photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                        <Card key={photo.id} className="bg-zinc-800 border-zinc-700">
                            <CardBody className="p-2">
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
                                    <p className="text-sm text-zinc-400 truncate">
                                        {photo.fileName || 'Unavngivet'}
                                    </p>
                                    
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="light"
                                            color={featuredImageId === photo.id ? "warning" : "default"}
                                            onPress={() => handleSetFeaturedImage(photo.id)}
                                            isLoading={isSettingFeatured === photo.id}
                                            startContent={featuredImageId === photo.id ? <FaStar /> : <FaRegStar />}
                                            className="flex-1"
                                            isDisabled={isSettingFeatured !== null || isDeleting !== null}
                                        >
                                            {featuredImageId === photo.id ? 'Featured' : 'Sæt Featured'}
                                        </Button>
                                        
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="light"
                                            onPress={() => handleDeletePhoto(photo.id)}
                                            isLoading={isDeleting === photo.id}
                                            isIconOnly
                                            isDisabled={isSettingFeatured !== null || isDeleting !== null}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardBody className="text-center py-8">
                        <p className="text-zinc-400 mb-4">Ingen billeder uploadet endnu</p>
                        <Button
                            color="primary"
                            onPress={handleUploadClick}
                            isLoading={isLoadingConfig}
                            startContent={<FaUpload />}
                        >
                            Upload Dit Første Billede
                        </Button>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}