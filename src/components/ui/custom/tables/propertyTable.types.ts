import type { ReactNode } from 'react';

export type PropertyTableValueType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'currency'
  | 'badge'
  | 'link';

export interface PropertyTableItem {
  label: string;
  value?: ReactNode;
  editNode?: ReactNode;
  type?: PropertyTableValueType;
  hint?: string;
  className?: string;
  required?: boolean;
}

export interface PropertyTableProps {
  items: PropertyTableItem[];
  className?: string;
  variant?: 'default' | 'compact';
  emptyText?: string;
  useCard?: boolean;
  title?: string;
  titleBadge?: ReactNode;
  isEditing?: boolean;
}