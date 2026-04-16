// src/app/annoncer/[slug]/SaleProfile.tsx
'use client'
import { SaleDetailsProfileDTO } from '@/api/types/AngoraDTOs';
import { formatCurrency } from '@/utils/formatters';
import { PropertyTable, PropertyTableItem } from '@/components/ui/custom/tables';
import { ReadOnlyTextArea } from '@/components/ui/custom/textareas';
import { ImageGallery } from '@/components/ui/custom/gallery';

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

    // Byg gallery-photos: profilePhotoUrl som første billede (hvis ikke allerede i photos[])
    const extraPhotos = profile.photos ?? [];
    const profilePhotoAlreadyInPhotos = profile.profilePhotoUrl
        && extraPhotos.some(p => p.filePath === profile.profilePhotoUrl);
    const galleryPhotos = [
        ...(profile.profilePhotoUrl && !profilePhotoAlreadyInPhotos
            ? [{ id: 'profile', filePath: profile.profilePhotoUrl, fileName: 'Profilbillede' }]
            : []),
        ...extraPhotos,
    ];

    // Base salgsdetaljer til PropertyTable
    const baseItems: PropertyTableItem[] = [
        { label: 'Pris',         value: saleDetails?.price,       type: 'currency' },
        { label: 'Kan leveres',  value: saleDetails?.canBeShipped, type: 'boolean' },
        { label: 'Oprettet',     value: saleDetails?.dateListed,  type: 'date' },
        { label: 'Visninger',    value: saleDetails?.viewCount ?? 0 },
        { label: 'Lokation',     value: profile.city ? `${profile.city}, ${profile.zipCode}` : undefined },
        { label: 'Sælger',       value: profile.sellerName },
    ];

    // Entity-specifikke properties fra backend-dictionary
    const entityPropItems: PropertyTableItem[] = Object.entries(entityProperties)
        .map(([key, value]) => ({ label: key, value: value || undefined }));

    const entitySalePropItems: PropertyTableItem[] = Object.entries(entityTypeSaleProperties)
        .map(([key, value]) => ({ label: key, value: value || undefined }));

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Venstre kolonne — galleri (sticky) */}
            <div className="lg:col-span-3">
                <div className="sticky top-20 bg-surface border border-divider rounded-2xl p-3 shadow-sm">
                    <ImageGallery
                        photos={galleryPhotos}
                        alt={saleDetails?.title || `${entityLabel} til salg`}
                    />
                </div>
            </div>

            {/* Højre kolonne — titel, pris, beskrivelse, tabeller */}
            <div className="lg:col-span-2 self-start">
                <div className="bg-surface border border-divider rounded-2xl p-5 shadow-sm space-y-4">

                    <div>
                        <h1 className="text-2xl font-bold text-foreground leading-tight mb-1">
                            {saleDetails?.title || `${entityLabel} til salg`}
                        </h1>
                        <p className="text-2xl font-bold text-amber-500">
                            {formatCurrency(saleDetails?.price || 0)}
                        </p>
                    </div>

                    <ReadOnlyTextArea
                        value={saleDetails?.description || 'Ingen beskrivelse tilgængelig.'}
                        label="Beskrivelse"
                        rows={5}
                    />

                    <PropertyTable
                        title="Salgsdetaljer"
                        items={baseItems}
                        useCard={false}
                    />

                {entityPropItems.length > 0 && (
                    <PropertyTable
                        title={`${entityLabel} information`}
                        items={entityPropItems}
                        useCard={false}
                    />
                )}

                {entitySalePropItems.length > 0 && (
                    <PropertyTable
                        title="Specifikationer"
                        items={entitySalePropItems}
                        useCard={false}
                    />
                )}

                </div>
            </div>
        </div>
    );
}