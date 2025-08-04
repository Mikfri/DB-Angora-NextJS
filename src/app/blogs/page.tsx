// src/app/blogs/page.tsx

import { Metadata } from 'next';
import { fetchBlogsAction } from '../actions/blog/blogActions';
import { Suspense } from 'react';
import BlogList from './blogList';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blogindlæg - DenBlå Angora',
    description: 'Læs spændende blogindlæg om angorakaniner, avl, pasning og meget mere fra eksperter i kaninavl.',
    keywords: 'angora kaniner blog, kaninavl tips, angora pasning, kaninpleje, avlstips',
    openGraph: {
      title: 'Blogindlæg - DenBlå Angora',
      description: 'Læs spændende blogindlæg om angorakaniner, avl, pasning og meget mere.',
      images: ['/images/DB-Angora.png'],
    }
  };
}

export default async function Page() {
  // Standard filter (side 1, 12 pr side)
  const filter = { page: 1, pageSize: 12 };
  const result = await fetchBlogsAction(filter);

  // Tilføj blog-specifik struktureret data
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "DenBlå-Angora Blog",
    "description": "Blogindlæg om angorakaniner, avl, pasning og meget mere",
    "url": "https://db-angora.dk/blogs",
    "publisher": {
      "@type": "Organization",
      "name": "DenBlå-Angora",
      "logo": "https://db-angora.dk/images/DB-Angora.png"
    },
    "inLanguage": "da-DK"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Suspense fallback={<div>Indlæser blogindlæg...</div>}>
        <BlogList blogs={result?.data ?? []} paging={result ?? undefined} />
      </Suspense>
    </>
  );
}