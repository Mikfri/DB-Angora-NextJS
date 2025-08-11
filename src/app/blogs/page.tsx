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

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: Props) {
  // Konverter searchParams til Blog_CardFilterDTO
  const filter: Blog_CardFilterDTO = {
    authorFullName: typeof searchParams.AuthorFullName === 'string' ? searchParams.AuthorFullName : null,
    searchTerm: typeof searchParams.SearchTerm === 'string' ? searchParams.SearchTerm : null,
    tagFilter: typeof searchParams.TagFilter === 'string' ? searchParams.TagFilter : null,
    blogSortOption: null, // Ikke brugt for nu
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