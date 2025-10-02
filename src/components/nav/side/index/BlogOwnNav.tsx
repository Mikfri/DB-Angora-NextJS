// src/components/nav/side/index/BlogOwnNav.tsx
'use client';

import BlogOwnNavBase from '../base/BlogOwnNavBase';
import { BlogOwnNavClient } from '../client/BlogOwnNavClient';

// Ingen props nødvendige – alt hentes fra store'en
export default function BlogOwnNav() {
  return (
    <BlogOwnNavBase>
      <BlogOwnNavClient />
    </BlogOwnNavBase>
  );
}