// src/components/nav/side/RabbitOwnNav.tsx
import { RabbitOwnNavClient } from './RabbitOwnNavClient';

/**
 * RabbitOwnNav - Navigation for user's own rabbits
 * Server wrapper that imports client logic
 */
export default function RabbitOwnNav() {
  return (
    <nav className="side-nav">
      <RabbitOwnNavClient />
    </nav>
  );
}