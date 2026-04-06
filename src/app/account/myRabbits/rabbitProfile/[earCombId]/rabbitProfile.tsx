// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitProfile.tsx
"use client";

import Tabs, { TabItem } from '@/components/ui/tabs/Tabs';
import { Tab as HeroTab } from '@heroui/react';
import { RabbitSaleDetailsEmbeddedDTO } from '@/api/types/AngoraDTOs';
import { useRabbitProfile } from '@/contexts/RabbitProfileContext';
import RabbitDetails from './rabbitDetails';
import RabbitChildren from './rabbitChildren';
import RabbitSaleSection from './rabbitSaleSection';
import RabbitPedigree from './rabbitPedigree';
import { useCallback, useState } from 'react';
import { RiInformationLine } from "react-icons/ri";
import { RiPriceTag3Line, RiPriceTag3Fill } from "react-icons/ri";
import { GiFamilyTree } from 'react-icons/gi';
import { LuNetwork } from 'react-icons/lu';

export default function RabbitProfile() {
  const {
    profile,
    isEditing,
    isSaving,
    editedData,
    setIsEditing,
    setEditedData,
    handleSave,
    handleCancelEdit,
    patchProfile,
  } = useRabbitProfile();

  const [active, setActive] = useState('details');

  const handleSaleDetailsChange = useCallback((saleDetails: RabbitSaleDetailsEmbeddedDTO | null) => {
    patchProfile({ saleDetailsEmbedded: saleDetails });
  }, [patchProfile]);

  if (!profile || !editedData) return null;

  const displayName = profile.nickName || profile.earCombId;
  const childrenCount = profile.children?.length || 0;

  const items: TabItem[] = [
    { key: 'details', label: 'Detaljer', icon: <RiInformationLine className="w-4 h-4" /> },
    { key: 'children', label: 'Afkom', icon: <LuNetwork className="w-4 h-4" /> },
    { key: 'pedigree', label: 'Stamtavle', icon: <GiFamilyTree className="w-4 h-4" /> },
    { key: 'sale', label: 'Salgsprofil', icon: profile.saleDetailsEmbedded ? <RiPriceTag3Fill className="w-4 h-4 text-blue-400" /> : <RiPriceTag3Line className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">{displayName}</h1>
      </div>

      <Tabs
        items={items}
        activeKey={active}
        onChange={setActive}
        aria-label="Kanin information"
        variant="underlined"
        color="primary"
        classNames={{
          tabList: "gap-6 w-full relative p-0 border-b border-zinc-700/50",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary",
        }}
      >
        <HeroTab key="details" title={
          <div className="flex items-center space-x-2">
            <RiInformationLine className="text-xl" />
            <span>Detaljer</span>
          </div>
        }>
          <RabbitDetails
            rabbitProfile={profile}
            isEditing={isEditing}
            isSaving={isSaving}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancelEdit}
            editedData={editedData}
            setEditedData={setEditedData}
          />
        </HeroTab>

        <HeroTab key="children" title={
          <div className="flex items-center space-x-2">
            <LuNetwork className="text-xl" />
            <span>Afkom</span>
            {childrenCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                {childrenCount}
              </span>
            )}
          </div>
        }>
          <RabbitChildren>{profile.children || []}</RabbitChildren>
        </HeroTab>

        <HeroTab key="pedigree" title={
          <div className="flex items-center space-x-2">
            <GiFamilyTree className="text-xl" />
            <span>Stamtavle</span>
          </div>
        }>
          <RabbitPedigree earCombId={profile.earCombId} />
        </HeroTab>

        <HeroTab key="sale" title={
          <div className="flex items-center space-x-2">
            {profile.saleDetailsEmbedded
              ? <RiPriceTag3Fill className="text-xl text-blue-400" />
              : <RiPriceTag3Line className="text-xl" />}
            <span>Salgsprofil</span>
          </div>
        }>
          <RabbitSaleSection
            rabbitProfile={profile}
            onSaleDetailsChange={handleSaleDetailsChange}
          />
        </HeroTab>
      </Tabs>
    </div>
  );
}