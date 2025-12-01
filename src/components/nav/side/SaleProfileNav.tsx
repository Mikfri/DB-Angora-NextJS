// src/components/nav/side/SaleProfileNav.tsx
import { SaleProfileNavClient } from './SaleProfileNavClient';

/**
 * SaleProfileNav - Navigation for sale profile
 * Henter data fra context
 */
export default function SaleProfileNav() {
  return (
    <nav className="side-nav">
      <SaleProfileNavClient />
    </nav>
  );
}