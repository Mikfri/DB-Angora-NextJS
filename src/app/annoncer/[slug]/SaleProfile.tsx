// src/app/annoncer/[slug]/SaleProfile.tsx
'use client'
import { SaleDetailsProfileDTO } from '@/api/types/AngoraDTOs';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PropertyTable, PropertyTableItem } from '@/components/ui/custom/tables';
import { ImageGallery } from '@/components/ui/custom/gallery';
import { Chip, ScrollShadow } from '@heroui/react';
import { IoTimeOutline } from 'react-icons/io5';
import { MdOutlineLocalShipping } from 'react-icons/md';

const ENTITY_TYPE_LABELS: Record<string, string> = {
    'Rabbit':       'Kanin',
    'WoolCardedSD': 'Kardet uld',
    'WoolRawSD':    'Rå uld',
    'YarnSD':       'Garn',
    'PeltSD':       'Skind',
};

interface Props {
    profile: SaleDetailsProfileDTO;
}

export default function SaleProfile({ profile }: Props) {
    const saleDetails = profile.saleDetails;
    const entityProperties = profile.entityProperties || {};
    const entityTypeSaleProperties = saleDetails?.entityTypeSaleProperties || {};

    const entityLabel = ENTITY_TYPE_LABELS[saleDetails?.entityType] ?? saleDetails?.entityType ?? 'Annonce';

    // Byg galleri-liste (profilePhoto + extra photos, undgå dubletter)
    const extraPhotos = profile.photos ?? [];
    const profilePhotoAlreadyInPhotos = profile.profilePhotoUrl
        && extraPhotos.some(p => p.filePath === profile.profilePhotoUrl);
    const galleryPhotos = [
        ...(profile.profilePhotoUrl && !profilePhotoAlreadyInPhotos
            ? [{ id: 'profile', filePath: profile.profilePhotoUrl, fileName: 'Profilbillede' }]
            : []),
        ...extraPhotos,
    ];

    // Entity-specifikke properties fra backend-dictionary
    const entityPropItems: PropertyTableItem[] = Object.entries(entityProperties)
        .map(([key, value]) => ({ label: key, value: value || undefined }));

    const entitySalePropItems: PropertyTableItem[] = Object.entries(entityTypeSaleProperties)
        .map(([key, value]) => ({ label: key, value: value || undefined }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* VENSTRE: Galleri — sticky */}
            <div>
                <div className="sticky top-20">
                    <div className="content-cell p-3">
                        <ImageGallery
                            photos={galleryPhotos}
                            fallbackUrl={profile.profilePhotoUrl}
                            alt={saleDetails?.title || entityLabel}
                        />
                    </div>
                </div>
            </div>

            {/* HØJRE: Titel, pris, beskrivelse, specifikationer */}
            <div className="space-y-4">

                {/* Titel + pris + beskrivelse — ét samlet kort */}
                <div className="content-cell p-5 flex flex-col h-[min(55vw,640px)]">
                    <div className="mb-3">
                        <h1 className="text-2xl font-bold text-foreground leading-tight mb-1">
                            {saleDetails?.title || `${entityLabel} til salg`}
                        </h1>
                        <p className="text-2xl font-bold text-amber-500">
                            {formatCurrency(saleDetails?.price || 0)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2 min-h-7">
                            {saleDetails?.dateListed && (
                                <span className="flex items-center gap-1 text-xs text-foreground/50">
                                    <IoTimeOutline />
                                    {formatDate(saleDetails.dateListed)}
                                </span>
                            )}
                            {saleDetails?.canBeShipped && (
                                <Chip color="success" variant="soft" size="sm" className="text-xs">
                                    <MdOutlineLocalShipping className="inline mr-1" /> Kan sendes
                                </Chip>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 min-h-0">
                        <ScrollShadow className="flex-1 min-h-0 rounded-lg border border-divider bg-surface-secondary px-3 py-2">
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                {saleDetails?.description || 'Ingen beskrivelse tilgængelig.'}
                            </p>
                        </ScrollShadow>
                    </div>
                </div>

                {/* Entity-specifikke egenskaber */}
                {entityPropItems.length > 0 && (
                    <PropertyTable
                        title={`${entityLabel} information`}
                        items={entityPropItems}
                    />
                )}

                {entitySalePropItems.length > 0 && (
                    <PropertyTable
                        title="Specifikationer"
                        items={entitySalePropItems}
                    />
                )}
            </div>
        </div>
    );
}