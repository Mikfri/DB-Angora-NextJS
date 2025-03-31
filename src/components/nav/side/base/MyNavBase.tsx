// src/components/nav/side/variants/MyNavBase.tsx
import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';

interface MyNavBaseProps {
  children: ReactNode;
}

/**
 * Server Component for MyNav
 * Contains the base structure for the navigation
 */
export default function MyNavBase({ children }: MyNavBaseProps) {
  return (
    <NavBase title="Navigation">
      <div className="w-full">
        {children}
      </div>
    </NavBase>
  );
}