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
        <section id="welcome">
          <WelcomeSection />
        </section>
        
        <section id="news">
          <NewsSection />
        </section>
        
        <section id="updates">
          <PatchNotesSection data={updatesData} />
        </section>
      </div>
    </div>
  );
}