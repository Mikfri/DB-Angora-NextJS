// src/app/account/rabbitsForbreeding/rabbitBreedingProfile/[earCombId]/rabbitBreedingProfile.tsx

"use client";

import { Rabbit_ForbreedingProfileDTO } from '@/api/types/AngoraDTOs';
import CustomTabs, { TabItem } from '@/components/ui/custom/tabs/Tabs';
import { useState } from 'react';
import RabbitBreedingDetails from './rabbitBreedingDetails';
import RabbitBreedingPhotoCarousel from './rabbitBreedingPhotoCarousel';
import RabbitBreedingSaleDetailsView from './rabbitBreedingSaleDetails';
import RabbitBreedingPedigree from './rabbitBreedingPedigree';
import { RiInformationLine, RiPriceTag3Line, RiPriceTag3Fill } from "react-icons/ri";
import { GiFamilyTree } from 'react-icons/gi';

interface RabbitBreedingProfileProps {
  profile: Rabbit_ForbreedingProfileDTO;
}

export default function RabbitBreedingProfile({ profile }: RabbitBreedingProfileProps) {
  const [activeTab, setActiveTab] = useState('details');

  const detailsTab = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RabbitBreedingDetails rabbit={profile} />
      </div>
      <div className="lg:col-span-1">
        <div className="bg-surface border border-border rounded-lg p-4 h-full">
          <h3 className="text-foreground font-medium mb-4">Billeder</h3>
          <RabbitBreedingPhotoCarousel photos={profile.photos} />
        </div>
      </div>
    </div>
  );

  const saleTab = profile.saleDetailsEmbedded
    ? <RabbitBreedingSaleDetailsView saleDetails={profile.saleDetailsEmbedded} />
    : (
      <div className="bg-surface border border-border rounded-lg p-6 text-center">
        <p className="text-foreground/60">Denne kanin er ikke sat til salg.</p>
      </div>
    );

  const items: TabItem[] = [
    {
      key: 'details',
      label: 'Detaljer',
      icon: <RiInformationLine className="w-4 h-4" />,
      content: detailsTab,
    },
    {
      key: 'pedigree',
      label: 'Stamtavle',
      icon: <GiFamilyTree className="w-4 h-4" />,
      content: <RabbitBreedingPedigree earCombId={profile.earCombId} />,
    },
    {
      key: 'sale',
      label: 'Salgsprofil',
      icon: profile.saleDetailsEmbedded
        ? <RiPriceTag3Fill className="w-4 h-4 text-blue-400" />
        : <RiPriceTag3Line className="w-4 h-4" />,
      content: saleTab,
    },
  ];

  return (
    <CustomTabs
      aria-label="Kanin avlsinformation"
      activeKey={activeTab}
      onChange={setActiveTab}
      items={items}
    />
  );
}
