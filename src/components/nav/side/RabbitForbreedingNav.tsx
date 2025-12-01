// src/components/nav/side/RabbitBreedingNav.tsx
import { RabbitForbreedingNavClient } from './RabbitForbreedingNavClient';

/**
 * RabbitBreedingNav - Navigation for breeding rabbits
 * Server wrapper that imports client logic
 */
export default function RabbitForbreedingNav() {
    return (
        <nav className="side-nav">
            <RabbitForbreedingNavClient />
        </nav>
    );
}