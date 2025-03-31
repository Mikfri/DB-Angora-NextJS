// src/components/nav/side/base/RabbitSaleNavBase.tsx
import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';

interface RabbitSaleNavBaseProps {
  children: ReactNode;
}

/**
 * Server Component for RabbitSaleNav
 * Contains the base structure for the sale navigation
 */
export default function RabbitSaleNavBase({ 
  children
}: RabbitSaleNavBaseProps) {
  return (
    <NavBase title="Kaniner til salg">
      <div className="w-full">
        {children}
      </div>
    </NavBase>
  );
}