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
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
      <div className="flex flex-col gap-12">
        <WelcomeSection />
        <NewsSection />
        <PatchNotesSection data={updatesData} />
      </div>
    </div>
  );
}