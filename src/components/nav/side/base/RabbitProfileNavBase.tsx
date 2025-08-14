// Server Component (ingen 'use client' direktiv)
import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';
import { NavAction } from '@/types/navigationTypes';

interface RabbitProfileNavBaseProps {
  children: ReactNode;
  title: string;
  footerActions?: NavAction[]; // Ændret type til NavAction[] fra vores shared types
}

/**
 * Basis struktur for kaninprofilnavigation
 * Følger samme mønster som RabbitOwnNavBase
 */
export default function RabbitProfileNavBase({
  children,
  title,
  footerActions
}: RabbitProfileNavBaseProps) {
  return (
    <NavBase title={title} footerActions={footerActions}>
      <div className="w-full">
        {children}
      </div>
    </NavBase>
  );
}