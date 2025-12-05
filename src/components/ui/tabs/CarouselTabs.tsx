// src/components/ui/tabs/CarouselTabs.tsx
'use client';

import React, { useRef } from 'react';
import { Button } from '@heroui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface TabItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

interface CarouselTabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: 'solid' | 'bordered' | 'light' | 'underlined';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export default function CarouselTabs({
  items,
  activeKey,
  onChange,
  variant = 'underlined',
  color = 'primary',
}: CarouselTabsProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  // Styling baseret på variant
  const getTabClasses = (isActive: boolean) => {
    const base = 'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all whitespace-nowrap';
    
    if (variant === 'underlined') {
      return `${base} border-b-2 ${
        isActive 
          ? `border-${color} text-${color}` 
          : 'border-transparent text-foreground/60 hover:text-foreground/80'
      }`;
    }
    
    if (variant === 'solid') {
      return `${base} rounded-lg ${
        isActive 
          ? `bg-${color} text-white` 
          : 'bg-transparent text-foreground/60 hover:bg-content2'
      }`;
    }
    
    if (variant === 'bordered') {
      return `${base} rounded-lg border ${
        isActive 
          ? `border-${color} text-${color}` 
          : 'border-transparent text-foreground/60 hover:border-content3'
      }`;
    }
    
    // light
    return `${base} rounded-lg ${
      isActive 
        ? `bg-${color}/20 text-${color}` 
        : 'text-foreground/60 hover:bg-content2'
    }`;
  };

  // Hardcoded farver fordi Tailwind ikke kan parse dynamiske klasser
  const getActiveStyles = (isActive: boolean) => {
    if (!isActive) {
      return variant === 'underlined' 
        ? 'border-b-2 border-transparent text-foreground/60 hover:text-foreground/80'
        : 'text-foreground/60 hover:bg-content2';
    }

    const colorStyles: Record<string, string> = {
      primary: variant === 'underlined' 
        ? 'border-b-2 border-primary text-primary' 
        : 'bg-primary text-white',
      secondary: variant === 'underlined'
        ? 'border-b-2 border-secondary text-secondary'
        : 'bg-secondary text-white',
      success: variant === 'underlined'
        ? 'border-b-2 border-success text-success'
        : 'bg-success text-white',
      warning: variant === 'underlined'
        ? 'border-b-2 border-warning text-warning'
        : 'bg-warning text-white',
      danger: variant === 'underlined'
        ? 'border-b-2 border-danger text-danger'
        : 'bg-danger text-white',
      default: variant === 'underlined'
        ? 'border-b-2 border-foreground text-foreground'
        : 'bg-default text-foreground',
    };

    return colorStyles[color] || colorStyles.primary;
  };

  return (
    <div className="flex items-center gap-1">
      {/* Venstre pil */}
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={() => scrollBy('left')}
        aria-label="Scroll venstre"
        className="flex-shrink-0"
      >
        <FaChevronLeft className="w-3 h-3" />
      </Button>

      {/* Scrollable tabs container */}
      <div
        ref={scrollRef}
        className={`
          flex gap-1 overflow-x-auto no-scrollbar snap-x snap-mandatory touch-pan-x py-1 flex-1
          ${variant === 'underlined' ? 'border-b border-divider' : ''}
        `}
      >
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium 
                transition-all whitespace-nowrap snap-start
                ${variant === 'underlined' ? '' : 'rounded-lg'}
                ${getActiveStyles(isActive)}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Højre pil */}
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={() => scrollBy('right')}
        aria-label="Scroll højre"
        className="flex-shrink-0"
      >
        <FaChevronRight className="w-3 h-3" />
      </Button>
    </div>
  );
}