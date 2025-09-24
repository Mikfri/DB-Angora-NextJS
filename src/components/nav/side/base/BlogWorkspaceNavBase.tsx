// src/components/nav/side/base/BlogWorkspaceNavBase.tsx

import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';
import { NavAction } from '@/types/navigationTypes';

interface BlogWorkspaceNavBaseProps {
  children: ReactNode;
  title: string;
  footerActions?: NavAction[];
}

/**
 * Server-side base for BlogWorkspace navigation.
 * Wrapper for layout og footer actions.
 */
export default function BlogWorkspaceNavBase({
  children,
  title,
  footerActions
}: BlogWorkspaceNavBaseProps) {
  return (
    <NavBase title={title} footerActions={footerActions}>
      <div className="w-full">
        {children}
      </div>
    </NavBase>
  );
}