// src/components/nav/side/RabbitSaleNav.tsx
import { RabbitSaleNavClient } from './RabbitSaleNavClient';

/**
 * RabbitSaleNav - Navigation for rabbits for sale
 * Server wrapper that imports client logic
 */
export default function RabbitSaleNav() {
  return (
    <nav className="side-nav">
      <RabbitSaleNavClient />
    </nav>
  );
}