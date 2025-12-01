// src/components/nav/side/BlogWorkspaceNav.tsx
import { BlogWorkspaceNavClient } from './BlogWorkspaceNavClient';

/**
 * BlogWorkspaceNav - Navigation for blog workspace
 * Server wrapper that imports client logic
 */
export default function BlogWorkspaceNav() {
  return (
    <nav className="side-nav">
      <BlogWorkspaceNavClient />
    </nav>
  );
}