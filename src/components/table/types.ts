// src/components/table/types.ts
import { ReactNode } from "react";

export interface TableStyling {
  table?: string;
  th?: string;
  td?: string;
  tr?: string;
}

export interface TableConfig<T> {
    propertyLabels: Record<keyof T, string>;
    isEditing?: boolean;
    onEdit?: (key: keyof T, value: string) => void;
    editableFields?: Array<keyof T>;
    styling?: TableStyling;
    customRenderers?: {
      [K in keyof T]?: (value: T[K], isEditing?: boolean) => ReactNode;
    };
  }