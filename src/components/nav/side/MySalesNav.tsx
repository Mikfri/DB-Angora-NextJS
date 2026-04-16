// src/components/nav/side/MySalesNav.tsx
import { MySalesNavClient } from './MySalesNavClient';

/**
 * MySalesNav - Navigation for user's own sale listings
 * Server wrapper that imports client logic
 */
export default function MySalesNav() {
  return (
    <nav className="side-nav">
      <MySalesNavClient />
    </nav>
  );
}
