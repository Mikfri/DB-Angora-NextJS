// src/components/nav/side/index/RabbitProfileNav.tsx
'use client';

import RabbitProfileNavBase from '../base/RabbitProfileNavBase';
import { RabbitProfileNavClient } from '../client/RabbitProfileNavClient';

/**
 * Navigation komponent for kaninprofil.
 * Simpel wrapper uden logic - alt håndteres i RabbitProfileNavClient.
 */
export default function RabbitProfileNav() {
  return (
    <RabbitProfileNavBase title="Kaninprofil">
      <RabbitProfileNavClient />
    </RabbitProfileNavBase>
  );
}