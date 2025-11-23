// src/app/HomeContent.tsx
'use client';
import WelcomeSection from './_components/WelcomeSection';
import NewsSection from './_components/NewsSection';
import PatchNotesSection from './_components/PatchNotesSection';
import type { BlogsLatestByCategoryDTO } from '@/api/types/AngoraDTOs';

interface Props {
  updatesData: BlogsLatestByCategoryDTO | null;
}

export default function HomeContent({ updatesData }: Props) {
  return (
    <div className="main-content-container">
      <div className="flex flex-col gap-12">
        <WelcomeSection />
        <NewsSection />
        <PatchNotesSection data={updatesData} />
      </div>
    </div>
  );
}