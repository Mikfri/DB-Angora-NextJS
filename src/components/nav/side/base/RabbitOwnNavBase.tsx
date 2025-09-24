// src/components/nav/side/base/RabbitOwnNavBase.tsx
import { ReactNode } from 'react';
import NavBase from '../../base/NavBase';

interface RabbitOwnNavBaseProps {
  children: ReactNode;
}

export default function RabbitOwnNavBase({ 
  children
}: RabbitOwnNavBaseProps) {
  return (
    <NavBase title="Mine Kaniner">
      <div className="w-full">
        {children}
      </div>
    </NavBase>
  );
}