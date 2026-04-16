'use client';
import type { BlogsLatestByCategoryDTO } from '@/api/types/AngoraDTOs';
import BlogCompactCard from '@/components/cards/blogCompactCard';
import BlogFeaturedCard from '@/components/cards/blogFeaturedCard';
import { Card } from '@/components/ui/heroui';

interface Props {
  data: BlogsLatestByCategoryDTO | null;
}

export default function PatchNotesSection({ data }: Props) {
  if (!data || !data.featured) {
    return (
      <section id="updates" className="flex flex-col justify-center items-center gap-6">
        <h2 className="text-heading text-2xl">Opdateringer</h2>
        <p className="text-muted">Ingen opdateringer tilgængelige.</p>
      </section>
    );
  }

  const { featured, next } = data;

  return (
    <section id="updates" className="flex flex-col gap-6">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6">
        {/* Section header med CRAP principper */}
        <div className="section-header">
          <h2 className="section-title">Opdateringer</h2>
          <p className="section-description">
            Opdateringer indeholder release‑noter om nye funktioner, fejlrettelser og forbedringer — hurtigt overblik så brugere kan se hvad der er ændret.
          </p>
        </div>

        {/* 2-kolonne layout (spejlvendt): 'next' til venstre, 'featured' til højre på md+ */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-6 w-full items-stretch">
          {/* Venstre kolonne: Kompakte cards stablede (med placeholders op til 3) */}
          <div className="grid gap-5 h-full grid-rows-3">
            {(next ?? []).map(blog => (
              <BlogCompactCard key={blog.id} blog={blog} className="h-full" />
            ))}
            {Array.from({ length: Math.max(0, 3 - (next ? next.length : 0)) }).map((_, idx) => (
              <Card
                key={`placeholder-${idx}`}
                className="backdrop-blur-md backdrop-saturate-150 border select-none overflow-hidden h-full"
                style={{
                  background: 'var(--card-bg-gradient)',
                  borderColor: 'var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  flexDirection: 'row',
                  alignItems: 'stretch',
                  padding: 0,
                  gap: 0,
                }}
              >
                <div className="w-28 lg:w-32 shrink-0 bg-surface-muted/40" />
                <div className="flex-1 flex items-center px-4 py-3">
                  <p className="text-sm text-muted italic">Intet indhold tilgængeligt</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Højre kolonne: Featured card med stort billede */}
          <div className="h-full">
            <BlogFeaturedCard blog={featured} />
          </div>
        </div>
      </div>
    </section>
  );
}
