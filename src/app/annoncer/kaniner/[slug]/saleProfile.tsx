// src/app/sale/[slug]/saleProfile.tsx
'use client'
import { SaleDetailsProfileDTO } from '@/api/types/AngoraDTOs';
import { Card, CardBody, CardHeader, Divider, Chip, Button } from "@heroui/react";
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { useState } from 'react';
import { IoEyeOutline } from 'react-icons/io5';

interface Props {
  profile: SaleDetailsProfileDTO;
}

/**
 * Generisk komponent til visning af alle typer salgsprofiler
 */
export default function SaleProfile({ profile }: Props) {
  // State til at håndtere valgt billede
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(
    profile.photos?.findIndex(p => p.isProfilePicture) || 0
  );

  // Tjek entitetstype og tilpas visningen
  const isRabbit = profile.entityType.toLowerCase() === 'rabbit';
  const isWool = profile.entityType.toLowerCase() === 'wool';

  // Hent egenskaber fra objekterne for nemmere adgang
  const entityProperties = profile.entityProperties || {};
  const entityTypeSaleProperties = profile.entityTypeSaleProperties || {};

  // Håndter valg af foto i galleriet
  const handlePhotoSelect = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  // Få det aktive billede
  const activePhoto = profile.photos && profile.photos.length > 0 && selectedPhotoIndex >= 0
    ? profile.photos[selectedPhotoIndex]
    : null;

  const mainImageUrl = activePhoto?.filePath || profile.imageUrl || '/images/default-product.jpg';

  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
      <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50">
        <CardHeader className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            {/* Hovedbillede */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-2">
              <Image
                src={mainImageUrl}
                alt={profile.title || 'Salgsopslag'}
                className="object-cover rounded-lg"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Billedgalleri */}
            {profile.photos && profile.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {profile.photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    className={`relative min-w-[60px] h-[60px] rounded-md overflow-hidden border-2 transition-all
                      ${index === selectedPhotoIndex
                        ? 'border-primary scale-105'
                        : 'border-zinc-700 opacity-70 hover:opacity-100'}`}
                    onClick={() => handlePhotoSelect(index)}
                  >
                    <Image
                      src={photo.filePath}
                      alt={photo.fileName || `Billede ${index + 1}`}
                      className="object-cover"
                      fill
                      sizes="60px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold">{profile.title || 'Unavngivet'}</h1>
                  <div className="flex items-center text-zinc-400 text-sm">
                    <IoEyeOutline className="mr-1" />
                    <span>{profile.viewCount || 0} visninger</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <Chip
                    color="primary"
                    variant="flat"
                    size="sm"
                  >
                    {profile.entityType}
                  </Chip>

                  {profile.canBeShipped && (
                    <Chip
                      color="success"
                      variant="flat"
                      size="sm"
                    >
                      Kan sendes
                    </Chip>
                  )}
                </div>

                <Divider className="my-3" />

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-amber-500">
                      {formatCurrency(profile.price)}
                    </span>
                    <span className="text-xs text-zinc-400">
                      Oprettet {formatDate(profile.dateListed)}
                    </span>
                  </div>

                  <p className="text-zinc-300 bg-zinc-800/50 p-3 rounded-md mt-2 line-clamp-3">
                    {profile.description?.substring(0, 120)}
                    {profile.description && profile.description.length > 120 ? '...' : ''}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full"
                  as="a"
                  href={`tel:${profile.sellerContact}`}
                >
                  Kontakt Sælger
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Produkt Information - tilpasset efter entitetstype */}
              <h2 className="text-xl font-semibold mb-3">
                {isRabbit ? 'Kanin Information' : isWool ? 'Uld Information' : 'Produkt Information'}
              </h2>

              <div className="space-y-2">
                {isRabbit && (
                  <>
                    <p><span className="text-zinc-400">Race:</span> {entityProperties.Race || 'Ikke angivet'}</p>
                    <p><span className="text-zinc-400">Farve:</span> {entityProperties.Farve || 'Ikke angivet'}</p>
                    <p><span className="text-zinc-400">Køn:</span> {entityProperties.Køn || 'Ikke angivet'}</p>
                    <p><span className="text-zinc-400">Fødselsdato:</span> {entityProperties.Fødselsdato || 'Ikke angivet'}</p>
                  </>
                )}

                {isWool && (
                  <>
                    <p><span className="text-zinc-400">Type:</span> {entityProperties.Type || 'Ikke angivet'}</p>
                    <p><span className="text-zinc-400">Farve:</span> {entityProperties.Farve || 'Ikke angivet'}</p>
                    <p><span className="text-zinc-400">Vægt:</span> {entityProperties.Vægt || 'Ikke angivet'}</p>
                    <p><span className="text-zinc-400">Kvalitet:</span> {entityProperties.Kvalitet || 'Ikke angivet'}</p>
                  </>
                )}

                {!isRabbit && !isWool && (
                  <p className="text-zinc-400">Ingen specifikke produktdetaljer tilgængelige.</p>
                )}
              </div>

              {isRabbit && (
                <>
                  <Divider className="my-4" />

                  <h2 className="text-xl font-semibold mb-3">Salgs Detaljer</h2>
                  <div className="space-y-2">
                    <p>
                      <span className="text-zinc-400">Boform:</span> {entityTypeSaleProperties.Boligmiljø || 'Ikke angivet'}
                    </p>
                    <p>
                      <span className="text-zinc-400">Neutraliseret:</span> {entityTypeSaleProperties.Neutraliseret === "Ja" ? "Ja" : "Nej"}
                    </p>
                    <p>
                      <span className="text-zinc-400">Bakketrænet:</span> {entityTypeSaleProperties.Bakketrænet === "Ja" ? "Ja" : "Nej"}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Beskrivelse</h2>
              <div className="bg-zinc-900/50 p-4 rounded-lg mb-4">
                <p className="text-zinc-300 whitespace-pre-wrap">
                  {profile.description || 'Ingen beskrivelse tilgængelig.'}
                </p>
              </div>

              <h2 className="text-xl font-semibold mb-3">Kontakt Information</h2>
              <div className="space-y-2">
                <p><span className="text-zinc-400">Sælger:</span> {profile.sellerName || 'Ikke angivet'}</p>
                <p><span className="text-zinc-400">Telefon:</span> {profile.sellerContact || 'Ikke angivet'}</p>
                <p><span className="text-zinc-400">Lokation:</span> {profile.city ? `${profile.city}, ${profile.zipCode}` : 'Ikke angivet'}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}