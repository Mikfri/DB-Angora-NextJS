// src/components/nav/side/MyNav.tsx
import { MyNavClient } from './MyNavClient';

/**
 * MyNav - Primary navigation component
 * Server wrapper that imports client logic
 */
export default function MyNav() {
  return (
    <nav className="side-nav">
      <MyNavClient />
    </nav>
  );
}