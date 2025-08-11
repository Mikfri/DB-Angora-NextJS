// src/components/nav/side/base/BlogNavBase.tsx// src/components/nav/side/base/BlogNavBase.tsx
import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';

interface BlogNavBaseProps {
  children: ReactNode;
}

/**
 * Server Component for BlogNav
 * Contains the base structure for the blog navigation
 */
export default function BlogNavBase({ children }: BlogNavBaseProps) {
  return (
    <NavBase title="Blog">
      <div className="w-full">
        {children}
      </div>
    </NavBase>
  );
}