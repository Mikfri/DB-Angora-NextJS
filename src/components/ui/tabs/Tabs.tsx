// src/components/ui/tabs/Tabs.tsx
'use client';

import React from 'react';
import { Tabs as HeroTabs, Tab as HeroTab } from '@heroui/react';
import CarouselTabs from './CarouselTabs';
import useMediaQuery from '@/hooks/useMediaQuery';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  items?: TabItem[];              // optional header items
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  variant?: 'solid' | 'bordered' | 'light' | 'underlined';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  classNames?: {
    base?: string;
    tabList?: string;
    cursor?: string;
    tab?: string;
    tabContent?: string;
    panel?: string;
  };
  'aria-label'?: string;
  children?: React.ReactNode;     // optional panels (HeroUI Tab components)
}

function isTabElement(child: React.ReactNode): child is React.ReactElement<{ value?: string; children?: React.ReactNode }> {
  return React.isValidElement(child) && typeof (child.props as any)?.value !== 'undefined';
}

export default function Tabs({ 
  items = [],
  activeKey, 
  onChange, 
  className = '',
  variant = 'underlined',
  color = 'primary',
  size = 'md',
  classNames,
  'aria-label': ariaLabel,
  children
}: TabsProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const childrenArray = React.Children.toArray(children) as React.ReactElement[];

  // If children (HeroUI <Tab> components) are present, use them for Desktop
  if (!isMobile) {
    if (childrenArray.length > 0) {
      return (
        <div className={className}>
          <HeroTabs
            selectedKey={activeKey}
            onSelectionChange={(key) => onChange(key as string)}
            aria-label={ariaLabel}
            variant={variant}
            color={color}
            size={size}
            classNames={{
              base: classNames?.base,
              tabList: classNames?.tabList,
              cursor: classNames?.cursor,
              tab: classNames?.tab,
              tabContent: classNames?.tabContent,
              panel: classNames?.panel,
            }}
          >
            {children}
          </HeroTabs>
        </div>
      );
    }

    // fallback to items -> HeroTabs
    return (
      <div className={className}>
        <HeroTabs
          selectedKey={activeKey}
          onSelectionChange={(key) => onChange(key as string)}
          aria-label={ariaLabel}
          variant={variant}
          color={color}
          size={size}
          classNames={{
            base: classNames?.base,
            tabList: classNames?.tabList,
            cursor: classNames?.cursor,
            tab: classNames?.tab,
            tabContent: classNames?.tabContent,
            panel: classNames?.panel,
          }}
        >
          {items.map((item) => (
            <HeroTab 
              key={item.key} 
              title={
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              }
            />
          ))}
        </HeroTabs>
      </div>
    );
  }

  // Mobile: carousel header from items or children -> use items header; panels rendered below
  // If items is empty but children exist, derive a simple header from children keys
  const headerItems = items.length > 0 ? items : childrenArray.map(child => ({
    key: String(child.key),
    label: (child.props as any)?.title ?? String(child.key),
    icon: undefined
  }));

  // find the selected child panel (if children are provided)
  const childArray = React.Children.toArray(children);
  const maybeSelectedChild = childArray.find((child) => isTabElement(child) && child.props.value === activeKey);
  const selectedChild = isTabElement(maybeSelectedChild) ? maybeSelectedChild : undefined;
  
  return (
    <div className="mt-3">
      {selectedChild ? selectedChild.props.children : null}
    </div>
  );
}