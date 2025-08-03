// src/app/blogs/page.tsx

import { Metadata } from 'next';
import { fetchBlogsAction } from '../actions/blog/blogActions';
import { Suspense } from 'react';
import BlogList from './blogList';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blogindlæg - DenBlå Angora',
    description: 'Læs spændende blogindlæg om angorakaniner, avl, pasning og meget mere.',
  };
}

export default async function Page() {
  // Standard filter (side 1, 12 pr side)
  const filter = { page: 1, pageSize: 12 };
  const result = await fetchBlogsAction(filter);

  return (
    <Suspense fallback={<div>Indlæser blogindlæg...</div>}>
      <BlogList blogs={result?.data ?? []} paging={result ?? undefined} />
    </Suspense>
  );
}