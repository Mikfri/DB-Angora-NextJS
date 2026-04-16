// src/components/ui/custom/cards/ClickableCard.tsx
'use client';

import { Card } from '@/components/ui/heroui';
import type { ComponentPropsWithoutRef, MouseEventHandler, ReactNode } from 'react';

export type ClickableCardProps = Omit<ComponentPropsWithoutRef<typeof Card>, 'onClick'> & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

function ClickableCardContent({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
      {children}
    </div>
  );
}

export default function ClickableCard({ className = '', style, onClick, ...props }: ClickableCardProps) {
  const card = (
    <Card
      {...props}
      style={{
        background: 'var(--card-bg-gradient)',
        borderColor: 'var(--card-border)',
        padding: 0,
        gap: 0,
        ...style,
      }}
      className={`transition-all duration-300 backdrop-blur-md backdrop-saturate-150 border select-none group overflow-hidden shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] ${className}`}
    />
  );

  if (!onClick) {
    return card;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-full p-0 border-none bg-transparent text-left"
      style={{ cursor: 'pointer' }}
    >
      {card}
    </button>
  );
}

ClickableCard.Content = ClickableCardContent;