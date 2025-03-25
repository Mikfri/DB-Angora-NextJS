// src/components/cloudinary/SimpleModal.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function SimpleModal({ isOpen, onClose, children, title }: SimpleModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      // Lås scroll på body når modal er åben
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Genetabler scroll når komponenten unmounts
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Forhindrer events i at boble op
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Renderingstjek for SSR
  if (!mounted || !isOpen) return null;

  // Opret en portal til modal-indholdet
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-lg w-full max-w-3xl mx-4 overflow-hidden shadow-2xl"
        onClick={stopPropagation}
      >
        {title && (
          <div className="px-4 py-3 flex justify-between items-center border-b border-zinc-800">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              type="button"
              className="text-zinc-400 hover:text-white"
              onClick={onClose}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-4">
          {children}
          <div id="modal-debug" className="hidden"></div>
        </div>
      </div>
    </div>,
    document.body
  );
}