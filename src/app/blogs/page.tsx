// src/app/blogs/page.tsx

import { Metadata } from 'next';
import { fetchBlogsAction } from '../actions/blog/blogActions';
import { Suspense } from 'react';
import BlogList from './blogList';
import type { Blog_CardFilterDTO } from '@/api/types/AngoraDTOs';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blogindlæg',
    description: 'Læs spændende blogindlæg om angorakaniner, avl, pasning og meget mere fra eksperter i kaninavl.',
    keywords: 'angora kaniner blog, kaninavl tips, angora pasning, kaninpleje, avlstips',
    openGraph: {
      title: 'Blogindlæg - Den Blå Angora',
      description: 'Læs spændende blogindlæg om angorakaniner, avl, pasning og meget mere.',
      images: ['/images/DB-Angora.png'],
    }
  };
}


export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[]>> }) {
  const resolvedSearchParams = await searchParams;
  
  const filter: Blog_CardFilterDTO = {
    authorFullName: typeof resolvedSearchParams?.AuthorFullName === 'string' ? resolvedSearchParams.AuthorFullName : null,
    searchTerm: typeof resolvedSearchParams?.SearchTerm === 'string' ? resolvedSearchParams.SearchTerm : null,
    tagFilter: typeof resolvedSearchParams?.TagFilter === 'string' ? resolvedSearchParams.TagFilter : null,
    categoryFilter: typeof resolvedSearchParams?.CategoryFilter === 'string' ? resolvedSearchParams.CategoryFilter : null, // TILFØJET
    blogSortOption: typeof resolvedSearchParams?.BlogSortOption === 'string' ? resolvedSearchParams.BlogSortOption : null, // TILFØJET
    page: 1,
    pageSize: 12
  };

  const result = await fetchBlogsAction(filter);

  // Tilføj blog-specifik struktureret data
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Den Blå Angora - Blog",
    "description": "Blogindlæg om kaninregister opdateringer, angorakaniner, avl, pasning og meget mere",
    "url": "https://db-angora.dk/blogs",
    "publisher": {
      "@type": "Organization",
      "name": "Den Blå Angora",
      "logo": "https://db-angora.dk/images/DB-Angora.png"
    },
    "inLanguage": "da-DK"
  };

  // Håndter result baseret på success/error pattern
  const blogs = result.success ? result.data.data : [];
  const paging = result.success ? result.data : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Suspense fallback={<div>Indlæser blogindlæg...</div>}>
        <BlogList blogs={blogs} paging={paging} />
      </Suspense>
    </>
  );
}