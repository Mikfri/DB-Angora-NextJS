// src/app/_components/NewsSection.tsx

import type { BlogsLatestByCategoryDTO } from '@/api/types/AngoraDTOs';
import BlogCompactCard from '@/components/cards/blogCompactCard';
import BlogFeaturedCard from '@/components/cards/blogFeaturedCard';

interface Props {
  data: BlogsLatestByCategoryDTO | null;
}

export default function NewsSection({ data }: Props) {
  if (!data || !data.featured) {
    return (
      <section id="news" className="flex flex-col justify-center items-center gap-6">
        <h2 className="text-heading text-2xl">Nyheder</h2>
        <p className="text-muted">Ingen nyheder tilgængelige.</p>
      </section>
    );
  }

  const { featured, next } = data;

  return (
    <section id="news" className="flex flex-col gap-6">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6">
        {/* Section header med CRAP principper */}
        <div className="section-header">
          <h2 className="section-title">Bagom DenBlå-Angora</h2>
          <p className="section-description">
            Bagom DenBlå-Angora deler historier, interviews og indblik i projektet — bag scenen, samarbejdspartnere og kommende initiativer.
          </p>
        </div>
 
        {/* 2-kolonne layout inspireret af DKK.dk */}
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6 w-full items-stretch">
          <div className="h-full">
            <BlogFeaturedCard blog={featured} />
          </div>
 
          {next && next.length > 0 && (
            <div className="grid gap-5">
              {next.map(blog => (
                <BlogCompactCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}