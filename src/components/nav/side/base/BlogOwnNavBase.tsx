// src/components/nav/side/base/BlogOwnNavBase.tsx// src/components/nav/side/base/BlogOwnNavBase.tsx

import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';

interface BlogOwnNavBaseProps {
  children: ReactNode;
}

export default function BlogOwnNavBase({ 
  children
}: BlogOwnNavBaseProps) {
  return (
    <NavBase title="Mine Blogs">
      <div className="w-full">
        {children}
      </div>
    </NavBase>
  );
}