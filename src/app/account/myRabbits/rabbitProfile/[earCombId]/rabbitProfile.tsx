// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitProfile.tsx
"use client";

import Tabs, { TabItem } from '@/components/ui/custom/tabs/Tabs';
import { RabbitSaleProfilePrivateDTO } from '@/api/types/AngoraDTOs';
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

  const handleSaleDetailsChange = useCallback((saleDetails: RabbitSaleProfilePrivateDTO | null) => {
    patchProfile({ saleDetailsEmbedded: saleDetails });
  }, [patchProfile]);

  if (!profile || !editedData) return null;

  const childrenCount = profile.children?.length || 0;

  const items: TabItem[] = [
    {
      key: 'details',
      label: 'Detaljer',
      icon: <RiInformationLine className="w-4 h-4" />,
      content: (
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
      )
    },
    {
      key: 'children',
      label: 'Afkom',
      icon: <LuNetwork className="w-4 h-4" />,
      content: <RabbitChildren>{profile.children || []}</RabbitChildren>
    },
    {
      key: 'pedigree',
      label: 'Stamtavle',
      icon: <GiFamilyTree className="w-4 h-4" />,
      content: <RabbitPedigree earCombId={profile.earCombId} />
    },
    {
      key: 'sale',
      label: 'Salgsprofil',
      icon: profile.saleDetailsEmbedded ? <RiPriceTag3Fill className="w-4 h-4 text-blue-400" /> : <RiPriceTag3Line className="w-4 h-4" />,
      content: (
        <RabbitSaleSection
          rabbitProfile={profile}
          onSaleDetailsChange={handleSaleDetailsChange}
        />
      )
    }
  ];

  return (
    <Tabs
      items={items}
      activeKey={active}
      onChange={setActive}
      aria-label="Kanin information"
    />
  );
}
