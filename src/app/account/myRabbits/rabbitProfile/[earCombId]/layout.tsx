// src/app/account/myRabbits/rabbitProfile/[earCombId]/layout.tsx
'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import { RabbitProfileProvider } from '@/contexts/RabbitProfileContext';
import RabbitProfileNav from '@/components/nav/side/index/RabbitProfileNav';

// Loading component for sidenav
function SideNavLoading() {
  return (
    <div className="w-full h-full bg-zinc-800/50 animate-pulse">
      <div className="p-4">
        <div className="h-8 w-3/4 bg-zinc-700 rounded mb-4"></div>
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-6 bg-zinc-700 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RabbitProfileLayout({
  children
}: {
  children: React.ReactNode
}) {
  const params = useParams();
  const earCombId = params.earCombId as string;

  return (
    <RabbitProfileProvider earCombId={earCombId}>
      <SideNavLayout
        sideNav={
          <Suspense fallback={<SideNavLoading />}>
            <RabbitProfileNav
              earCombId={earCombId}
              nickName={null}
              originFullName={null}
              ownerFullName={null}
              approvedRaceColorCombination={null}
              isJuvenile={null}
              profilePicture={null}
              inbreedingCoefficient={null}
            />
          </Suspense>
        }
      >
        {children}
      </SideNavLayout>
    </RabbitProfileProvider>
  );
}