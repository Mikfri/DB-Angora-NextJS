'use client';

import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children?: React.ReactNode;
}

export default function TabButton({ active = false, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap 
        ${active ? 'bg-primary text-white shadow' : 'bg-content1 text-foreground/80 hover:bg-content1/80'}`}
    >
      {children}
    </button>
  );
}