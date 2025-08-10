// src/components/nav/side/index/RabbitSaleProfileNav.tsx
'use client';

import RabbitSaleProfileNavBase from '../base/RabbitSaleProfileNavBase';
import { RabbitSaleProfileNavClient } from '../client/RabbitSaleProfileNavClient';
import { SaleDetailsProfileDTO } from '@/api/types/AngoraDTOs';

interface RabbitSaleProfileNavProps {
  profile: SaleDetailsProfileDTO;
}

/**
 * Navigation komponent for kanin salgsprofil.
 * Viser sælgerinfo og kontaktmuligheder
 */
export default function RabbitSaleProfileNav({ profile }: RabbitSaleProfileNavProps) {
  // Vis navn - brug title eller fallback
  const displayName = profile.title || 'Kanin til salg';
  
  return (
    <RabbitSaleProfileNavBase title={displayName}>
      <RabbitSaleProfileNavClient
        sellerName={profile.sellerName}
        sellerContact={profile.sellerContact}
        city={profile.city}
        zipCode={profile.zipCode}
        price={profile.price}
        dateListed={profile.dateListed}
        viewCount={profile.viewCount}
        canBeShipped={profile.canBeShipped}
        imageUrl={profile.sellerImageUrl ?? null} // Sikrer kun string|null
        title={profile.title}
      />
    </RabbitSaleProfileNavBase>
  );
}