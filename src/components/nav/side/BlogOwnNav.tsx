// src/components/nav/side/BlogOwnNav.tsx
import { BlogOwnNavClient } from './BlogOwnNavClient';

/**
 * BlogOwnNav - Navigation for user's own blogs
 * Server wrapper that imports client logic
 */
export default function BlogOwnNav() {
  return (
    <nav className="side-nav">
      <BlogOwnNavClient />
    </nav>
  );
}