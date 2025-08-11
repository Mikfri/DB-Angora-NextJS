// src/components/nav/side/index/BlogNav.tsx

'use client';
import BlogNavBase from '../base/BlogNavBase';
import BlogNavClient from '../client/BlogNavClient';

export default function BlogNav() {
  return (
    <BlogNavBase>
      <BlogNavClient />
    </BlogNavBase>
  );
}