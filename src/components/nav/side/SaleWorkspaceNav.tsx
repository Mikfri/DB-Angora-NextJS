// src/components/nav/side/SaleWorkspaceNav.tsx

import { SaleWorkspaceNavClient } from './SaleWorkspaceNavClient';

/**
 * SaleWorkspaceNav - Navigation for sale workspace pages (/account/mySales/[entityType]/[id])
 * Server wrapper that imports client logic.
 * Data fetched via SaleWorkspaceContext (wraps the route in layoutWrapper.tsx).
 */
export default function SaleWorkspaceNav() {
    return (
        <nav className="side-nav">
            <SaleWorkspaceNavClient />
        </nav>
    );
}
