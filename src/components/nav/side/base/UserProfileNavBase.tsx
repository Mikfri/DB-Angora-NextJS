// src/components/nav/side/base/UserProfileNavBase.tsx
import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';
import { NavAction } from '@/types/navigation';

interface UserProfileNavBaseProps {
  children: ReactNode;
  title: string;
  footerActions?: NavAction[];
}

/**
 * Server-komponent for brugerprofilnavigation
 * Fungerer som base struktur der håndterer layout
 */
export default function UserProfileNavBase({
  children,
  title,
  footerActions
}: UserProfileNavBaseProps) {
  return (
    <NavBase title={title} footerActions={footerActions}>
      <div className="w-full">
        {children}
      </div>
    </NavBase>
  );
}