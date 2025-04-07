// src/app/account/myRabbits/rabbitProfile/[earCombId]/layout.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import RabbitProfileNav from '@/components/nav/side/index/RabbitProfileNav';
import { getRabbitProfile } from '@/app/actions/rabbit/profile';

// Vi kan fjerne Rabbit_BasicInfoDTO, da vi nu bruger flere felter fra Rabbit_ProfileDTO
// import { Rabbit_BasicInfoDTO } from '@/api/types/AngoraDTOs';
import { Rabbit_ProfileDTO } from '@/api/types/AngoraDTOs';

export default function RabbitProfileLayout({
  children
}: {
  children: React.ReactNode
}) {
  const params = useParams();
  const earCombId = params.earCombId as string;

  // Opdateret type til at bruge det fulde Rabbit_ProfileDTO objekt
  const [rabbitInfo, setRabbitInfo] = useState<Rabbit_ProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hent kun basale data til navigation - skal være en let operation
  const loadBasicInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getRabbitProfile(earCombId);

      if (result.success) {
        // Gem hele profilen, så vi kan bruge flere felter i navigation
        setRabbitInfo(result.data);
      }
    } catch (error) {
      console.error('Fejl ved hentning af kanininfo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [earCombId]);

  useEffect(() => {
    loadBasicInfo();
  }, [loadBasicInfo]);

  // Mens vi loader, vis blot indholdet uden sidenav
  if (isLoading || !rabbitInfo) {
    return children;
  }


  return (
    <SideNavLayout
      sideNav={
        <RabbitProfileNav
          earCombId={rabbitInfo.earCombId}
          nickName={rabbitInfo.nickName || rabbitInfo.earCombId}
          originFullName={rabbitInfo.originFullName}
          ownerFullName={rabbitInfo.ownerFullName}
          approvedRaceColorCombination={rabbitInfo.approvedRaceColorCombination}
          isJuvenile={rabbitInfo.isJuvenile}
          profilePicture={rabbitInfo.profilePicture}
        // Fjernede ekstra felter da vi ikke bruger dem længere
        // gender={rabbitInfo.gender}
        // race={rabbitInfo.race}
        // color={rabbitInfo.color}
        // birthdate={formattedBirthdate}
        />
      }
    >
      {children}
    </SideNavLayout>
  );
}