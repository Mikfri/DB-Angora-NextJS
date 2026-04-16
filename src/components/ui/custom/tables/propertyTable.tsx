// src/components/ui/custom/tables/PropertyTable.tsx

'use client';

import { Chip } from '@/components/ui/heroui';
import type { ReactNode } from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { PropertyTableItem, PropertyTableProps } from './propertyTable.types';

function renderHeroValue(item: PropertyTableItem): ReactNode {
  const { type = 'text', value } = item;

  if (value === null || value === undefined || value === '') {
    return <span className="text-foreground/40 italic">-</span>;
  }

  switch (type) {
    case 'boolean': {
      const booleanValue = typeof value === 'boolean' ? value : String(value).toLowerCase() === 'true';
      return (
        <Chip size="sm" variant="soft" className="text-xs font-semibold">
          {booleanValue ? 'Ja' : 'Nej'}
        </Chip>
      );
    }
    case 'date': {
      if (typeof value === 'string' || value instanceof Date) {
        return formatDate(typeof value === 'string' ? value : value.toISOString());
      }
      return value;
    }
    case 'currency':
      if (typeof value === 'number') return formatCurrency(value);
      return value;
    case 'link':
      if (typeof value === 'string') {
        return (
          <a href={value} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80 transition-colors">
            {value}
          </a>
        );
      }
      return value;
    case 'badge':
      return (
        <Chip color="default" size="sm" variant="soft" className="text-xs font-semibold">
          {value}
        </Chip>
      );
    default:
      return <span>{value}</span>;
  }
}

export default function PropertyTable({
  items,
  className = '',
  emptyText = 'Ingen oplysninger tilgængelige',
  useCard = true,
  title,
  isEditing = false,
}: PropertyTableProps) {
  const containerClass = [
    'rounded-lg overflow-hidden',
    useCard ? 'border border-divider bg-surface' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      {title && (
        <p className="px-3 py-2 text-sm font-semibold text-foreground border-b border-divider">{title}</p>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b border-divider">
            <th className="px-3 py-1.5 text-left text-xs font-medium text-foreground/60 w-1/3">Egenskab</th>
            <th className="px-3 py-1.5 text-left text-xs font-medium text-foreground/60">Værdi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-divider">
          {items.length === 0 && (
            <tr><td colSpan={2} className="px-3 py-3 text-sm italic text-foreground/40">{emptyText}</td></tr>
          )}
          {items.map((item) => (
            <tr key={item.label} className={item.className}>
              <td className="px-3 py-1.5 text-xs font-medium text-foreground/60 w-1/3 align-middle">
                {item.label}
              </td>
              <td className="px-3 py-1.5 text-sm text-foreground align-middle">
                <div className="flex flex-col gap-0.5">
                  <div className={item.editNode && !isEditing ? 'pointer-events-none opacity-50' : undefined}>
                    {item.editNode ? item.editNode : renderHeroValue(item)}
                  </div>
                  {item.hint && <span className="text-xs text-foreground/50">{item.hint}</span>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
