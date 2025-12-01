// src/components/nav/side/RabbitSaleProfileNav.tsx
import { RabbitSaleProfileNavClient } from './RabbitSaleProfileNavClient';

/**
 * RabbitSaleProfileNav - Navigation for rabbit sale profile
 * Henter data fra context (ligesom RabbitProfileNav)
 */
export default function RabbitSaleProfileNav() {
  return (
    <nav className="side-nav">
      <RabbitSaleProfileNavClient />
    </nav>
  );
}