// src/app/account/rabbitsForbreeding/rabbitBreedingProfile/[earCombId]/rabbitBreedingProfile.tsx

"use client";

import { Rabbit_ForbreedingProfileDTO } from '@/api/types/AngoraDTOs';
import { Tabs, Tab } from "@heroui/react";
import { useMemo } from 'react';
import RabbitBreedingDetails from './rabbitBreedingDetails';
import RabbitBreedingPhotoCarousel from './rabbitBreedingPhotoCarousel';
import RabbitBreedingSaleDetailsView from './rabbitBreedingSaleDetails';
import RabbitBreedingPedigree from './rabbitBreedingPedigree';
import { RiInformationLine, RiPriceTag3Line, RiPriceTag3Fill } from "react-icons/ri";
import { FaTreeCity } from "react-icons/fa6";

interface RabbitBreedingProfileProps {
  profile: Rabbit_ForbreedingProfileDTO;
}

export default function RabbitBreedingProfile({ profile }: RabbitBreedingProfileProps) {
  const displayName = profile.nickName || profile.earCombId;

  const detailsTab = useMemo(() => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RabbitBreedingDetails rabbit={profile} />
      </div>
      <div className="lg:col-span-1">
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50 p-4 h-full">
          <h3 className="text-zinc-100 font-medium mb-4">Billeder</h3>
          <RabbitBreedingPhotoCarousel photos={profile.photos} />
        </div>
      </div>
    </div>
  ), [profile]);

  const pedigreeTab = useMemo(() => (
    <RabbitBreedingPedigree earCombId={profile.earCombId} />
  ), [profile.earCombId]);

  const saleTab = useMemo(() => {
    if (profile.saleDetailsEmbedded) {
      return <RabbitBreedingSaleDetailsView saleDetails={profile.saleDetailsEmbedded} />;
    }
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50 p-6 text-center">
        <p className="text-zinc-400">Denne kanin er ikke sat til salg.</p>
      </div>
    );
  }, [profile.saleDetailsEmbedded]);

  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">{displayName}</h1>
        <p className="text-sm text-zinc-400 mt-1">Avlsprofil</p>
      </div>

      <Tabs
        aria-label="Kanin avlsinformation"
        variant="underlined"
        color="primary"
        classNames={{
          tabList: "gap-6 w-full relative p-0 border-b border-zinc-700/50",
          cursor: "w-full bg-blue-500",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-blue-500",
          panel: "pt-5"
        }}
      >
        <Tab
          key="details"
          title={
            <div className="flex items-center space-x-2">
              <RiInformationLine className="text-xl" />
              <span>Detaljer</span>
            </div>
          }
        >
          {detailsTab}
        </Tab>

        <Tab
          key="pedigree"
          title={
            <div className="flex items-center space-x-2">
              <FaTreeCity className="text-xl" />
              <span>Stamtavle</span>
            </div>
          }
        >
          {pedigreeTab}
        </Tab>

        <Tab
          key="sale"
          title={
            <div className="flex items-center space-x-2">
              {profile.saleDetailsEmbedded ? (
                <RiPriceTag3Fill className="text-xl text-blue-400" />
              ) : (
                <RiPriceTag3Line className="text-xl" />
              )}
              <span>Salgsprofil</span>
            </div>
          }
        >
          {saleTab}
        </Tab>
      </Tabs>
    </div>
  );
}