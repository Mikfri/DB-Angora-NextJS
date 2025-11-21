// Server Component (ingen 'use client' direktiv)
import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';
import { NavAction } from '@/types/navigationTypes';

interface RabbitProfileNavBaseProps {
  title: string;
  children: ReactNode;
  footerActions?: NavAction[]; // Gør optional
}

export default function RabbitProfileNavBase({ 
  title, 
  children, 
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