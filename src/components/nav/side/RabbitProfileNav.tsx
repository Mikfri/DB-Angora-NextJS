// src/components/nav/side/RabbitProfileNav.tsx
import { RabbitProfileNavClient } from './RabbitProfileNavClient';

/**
 * RabbitProfileNav - Navigation for rabbit profile
 * Server wrapper that imports client logic
 */
export default function RabbitProfileNav() {
  return (
    <nav className="side-nav">
      <RabbitProfileNavClient />
    </nav>
  );
}