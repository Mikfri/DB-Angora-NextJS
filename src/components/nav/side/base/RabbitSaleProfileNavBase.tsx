// src/components/nav/side/base/RabbitSaleProfileNavBase.tsx
import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';
import { NavAction } from '@/types/navigationTypes';

interface RabbitSaleProfileNavBaseProps {
  children: ReactNode;
  title: string;
  footerActions?: NavAction[];
}

/**
 * Basis struktur for kanin salgs profil navigation
 * Følger samme mønster som RabbitProfileNavBase
 */
export default function RabbitSaleProfileNavBase({
  children,
  title,
  footerActions
}: RabbitSaleProfileNavBaseProps) {
  return (
    <NavBase title={title} footerActions={footerActions}>
      <div className="w-full">
        {children}
      </div>
    </NavBase>
  );
}