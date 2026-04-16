// src/components/nav/side/SaleItemsNav.tsx
import { SaleItemsNavClient } from './SaleItemsNavClient';

/**
 * SaleItemsNav - Filtrerings-navigation for salgsannoncer
 * Server wrapper der importerer client logik
 */
export default function SaleItemsNav() {
    return (
        <nav className="side-nav">
            <SaleItemsNavClient />
        </nav>
    );
}