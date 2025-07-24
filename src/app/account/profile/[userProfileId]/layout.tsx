// src/app/account/profile/[userProfileId]/layout.tsx
import { Suspense } from 'react';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import UserProfileNav from '@/components/nav/side/index/UserProfileNav';
import { getUserProfile } from '@/app/actions/account/accountActions';

export default async function UserProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userProfileId: string }>;
}) {
  // Next.js 15+: params skal awaites!
  const resolvedParams = await params;
  const userProfileId = resolvedParams.userProfileId;

  // Hent brugerdata på serveren (bruges kun til SSR/hydration)
  const result = await getUserProfile(userProfileId);
  const user = result?.success ? result.data : null;
  console.log("layout user:", user);
  console.log("layout params.userProfileId:", userProfileId);

  return (
    <SideNavLayout
      sideNav={
        <Suspense fallback={<div className="p-4">Indlæser navigation...</div>}>
          <UserProfileNav />
        </Suspense>
      }
    >
      {/* children får initiale brugerdata som prop fra page.tsx */}
      {children}
    </SideNavLayout>
  );
}