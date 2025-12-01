// src/components/nav/side/BlogNav.tsx
import { BlogNavClient } from './BlogNavClient';

/**
 * BlogNav - Blog filtering navigation
 * Server wrapper that imports client logic
 */
export default function BlogNav() {
  return (
    <nav className="side-nav">
      <BlogNavClient />
    </nav>
  );
}