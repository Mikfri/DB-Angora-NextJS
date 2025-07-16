// src/app/annoncer/kaniner/[slug]/rabbitSaleProfile.tsx
'use client'
import { SaleDetailsProfileDTO } from '@/api/types/AngoraDTOs';
import { Card, CardBody, Divider } from "@heroui/react";
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { useState } from 'react';
import { IoEyeOutline, IoLocationOutline } from 'react-icons/io5';

interface Props {
  profile: SaleDetailsProfileDTO;
}

/**
 * GulOgGratis-inspireret design for kanin salgsprofiler
 * Tilpasset til smalere bredde pga. højre sideNav
 */
export default function RabbitSaleProfile({ profile }: Props) {
  // State til at håndtere valgt billede
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(
    profile.photos?.findIndex(p => p.isProfilePicture) || 0
  );

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
    <div className="w-full space-y-6">
      
      {/* Hero sektion med fuldt bred billede og titel/pris overlay */}
      <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50 overflow-hidden">
        <div className="relative">
          
          {/* Hovedbillede - fuld bredde */}
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <Image
              src={mainImageUrl}
              alt={profile.title || 'Kanin til salg'}
              className="object-cover transition-transform duration-300 hover:scale-105"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            
            {/* Overlay med billede info */}
            {profile.photos && profile.photos.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                {selectedPhotoIndex + 1} / {profile.photos.length}
              </div>
            )}

            {/* Titel og pris overlay - bottom left */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl lg:text-3xl font-bold text-white leading-tight mb-2">
                    {profile.title || 'Kanin til salg'}
                  </h1>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <IoLocationOutline />
                      <span>{profile.city ? `${profile.city}, ${profile.zipCode}` : 'Lokation ikke angivet'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoEyeOutline />
                      <span>{profile.viewCount || 0} visninger</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl lg:text-4xl font-bold text-amber-400">
                    {formatCurrency(profile.price)}
                  </div>
                  <div className="text-white/60 text-xs">
                    Oprettet {formatDate(profile.dateListed)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail galleri - under hovedbillede */}
          {profile.photos && profile.photos.length > 1 && (
            <div className="p-4 bg-zinc-900/30">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {profile.photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    className={`relative min-w-[80px] h-[80px] rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0
                      ${index === selectedPhotoIndex
                        ? 'border-primary shadow-lg shadow-primary/20' 
                        : 'border-zinc-600 opacity-70 hover:opacity-100 hover:border-zinc-500'}`}
                    onClick={() => handlePhotoSelect(index)}
                  >
                    <Image
                      src={photo.filePath}
                      alt={photo.fileName || `Billede ${index + 1}`}
                      className="object-cover"
                      fill
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Detaljeret information - enkelt kolonne pga. smalere plads */}
      <div className="space-y-6">
        
        {/* Beskrivelse */}
        <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50">
          <CardBody className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">Beskrivelse</h2>
            <div className="bg-zinc-900/50 p-4 rounded-lg">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {profile.description || 'Ingen beskrivelse tilgængelig.'}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Kanin Information */}
        <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50">
          <CardBody className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">Kanin Information</h2>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-zinc-700/50">
                <span className="text-zinc-400">Race:</span>
                <span className="text-zinc-200 font-medium">{entityProperties.Race || 'Ikke angivet'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-700/50">
                <span className="text-zinc-400">Farve:</span>
                <span className="text-zinc-200 font-medium">{entityProperties.Farve || 'Ikke angivet'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-700/50">
                <span className="text-zinc-400">Køn:</span>
                <span className="text-zinc-200 font-medium">{entityProperties.Køn || 'Ikke angivet'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-700/50">
                <span className="text-zinc-400">Fødselsdato:</span>
                <span className="text-zinc-200 font-medium">{entityProperties.Fødselsdato || 'Ikke angivet'}</span>
              </div>
            </div>

            {/* Salgs Detaljer */}
            <Divider className="my-6" />
            <h3 className="text-lg font-semibold mb-4 text-zinc-100">Salgs Detaljer</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-zinc-700/50">
                <span className="text-zinc-400">Boform:</span>
                <span className="text-zinc-200 font-medium">{entityTypeSaleProperties.Boligmiljø || 'Ikke angivet'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-700/50">
                <span className="text-zinc-400">Neutraliseret:</span>
                <span className="text-zinc-200 font-medium">{entityTypeSaleProperties.Neutraliseret === "Ja" ? "Ja" : "Nej"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-400">Bakketrænet:</span>
                <span className="text-zinc-200 font-medium">{entityTypeSaleProperties.Bakketrænet === "Ja" ? "Ja" : "Nej"}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}