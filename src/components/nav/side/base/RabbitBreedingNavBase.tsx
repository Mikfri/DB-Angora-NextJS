// src/components/nav/side/base/RabbitBreedingNavBase.tsx
import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';

interface RabbitBreedingNavBaseProps {
  children: ReactNode;
}

/**
 * Server Component for RabbitBreedingNav
 * Contains the base structure for the breeding navigation
 */
export default function RabbitBreedingNavBase({ 
  children
}: RabbitBreedingNavBaseProps) {
  return (
    <NavBase title="Avlskaniner">
      <div className="w-full">
        {children}
      </div>
    </NavBase>
  );
}