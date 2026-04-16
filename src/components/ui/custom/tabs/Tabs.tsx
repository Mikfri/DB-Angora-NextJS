// src/components/ui/custom/tabs/Tabs.tsx

/**
 * Tabs wrapper for app (desk+mobil).
 * Bruger HeroUI <Tabs> med secondary-variant (underline indicator).
 * Tab-listen er scrollbar på mobil via overflow-x-auto.
 */

'use client';

import React from 'react';
import { Tabs as HeroTabs } from '@/components/ui/heroui';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  content?: React.ReactNode;
}

interface TabsProps {
  items?: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  'aria-label'?: string;
}

export default function Tabs({
  items = [],
  activeKey,
  onChange,
  className = '',
  variant = 'secondary',
  'aria-label': ariaLabel,
}: TabsProps) {
  return (
    <div className={`rounded-xl border border-divider bg-surface-secondary overflow-hidden ${className}`.trim()}>
      <HeroTabs
        selectedKey={activeKey}
        onSelectionChange={(key) => onChange(key as string)}
        aria-label={ariaLabel}
        variant={variant}
      >
        <HeroTabs.ListContainer>
          <HeroTabs.List className="bg-transparent overflow-x-auto">
            {items.map((item, index) => (
              <HeroTabs.Tab key={item.key} id={item.key}>
                {index > 0 && <HeroTabs.Separator />}
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <HeroTabs.Indicator />
              </HeroTabs.Tab>
            ))}
          </HeroTabs.List>
        </HeroTabs.ListContainer>

        {items.map((item) => (
          <HeroTabs.Panel key={item.key} id={item.key} className="p-4">
            {item.content}
          </HeroTabs.Panel>
        ))}
      </HeroTabs>
    </div>
  );
}

