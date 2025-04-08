// src/app/account/myRabbits/rabbitProfile/[earCombId]/RabbitProfileSideNav.tsx
'use client';

import { Spinner } from "@heroui/react";
import { useRabbitProfile } from '@/contexts/RabbitProfileContext';
import RabbitProfileNav from '@/components/nav/side/index/RabbitProfileNav';

export default function RabbitProfileSideNav() {
  const { profile, isLoading, error } = useRabbitProfile();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spinner size="md" color="primary" />
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className="p-4 text-sm text-zinc-400">
        Kunne ikke indlæse kanindetaljer
      </div>
    );
  }
  
  return (
    <RabbitProfileNav
      earCombId={profile.earCombId}
      nickName={profile.nickName || profile.earCombId}
      originFullName={profile.originFullName}
      ownerFullName={profile.ownerFullName}
      approvedRaceColorCombination={profile.approvedRaceColorCombination}
      isJuvenile={profile.isJuvenile}
      profilePicture={profile.profilePicture}
    />
  );
}