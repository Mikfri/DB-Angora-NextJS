// src/components/nav/side/SaleGalleryNav.tsx
'use client';

import { useSaleProfile } from '@/contexts/SaleProfileContext';
import { ImageGallery } from '@/components/ui/custom/gallery';
import { Spinner } from '@heroui/react';

export default function SaleGalleryNav() {
    const { profile, isLoading } = useSaleProfile();

    if (isLoading) {
        return (
            <div className="w-full flex justify-center p-4">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!profile) return null;

    const extraPhotos = profile.photos ?? [];
    const profilePhotoAlreadyInPhotos = profile.profilePhotoUrl
        && extraPhotos.some(p => p.filePath === profile.profilePhotoUrl);
    const galleryPhotos = [
        ...(profile.profilePhotoUrl && !profilePhotoAlreadyInPhotos
            ? [{ id: 'profile', filePath: profile.profilePhotoUrl, fileName: 'Profilbillede' }]
            : []),
        ...extraPhotos,
    ];

    return (
        <ImageGallery
            photos={galleryPhotos}
            alt={profile.saleDetails?.title || 'Annonce billede'}
        />
    );
}
