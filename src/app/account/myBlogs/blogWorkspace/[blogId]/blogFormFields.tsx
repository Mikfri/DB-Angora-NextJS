// src/app/account/myBlogs/blogWorkspace/[blogId]/blogFormFields.tsx

/**
 * blogFormFields.tsx
 * 
 * Ansvar:
 * Håndterer rendering af METADATA-felter for en blog (synlighed, kategori, tags, metaDescription).
 * Titel, undertitel og content håndteres IKKE her - de håndteres i BlogContentEditor.tsx.
 * 
 * Funktioner:
 * - renderBlogField(): Renderer et enkelt metadata-felt (view eller edit mode)
 * - renderViewMode(): Viser read-only visning af metadata
 * - renderEditMode(): Viser redigerbare input-felter for metadata
 * - editableFieldLabels: Definerer danske labels for metadata-felter
 * 
 * Bruges af: blogWorkspace.tsx (til metadata-sektionen)
 */

import React, { ReactNode } from "react";
import { Textarea, Select, SelectItem } from "@heroui/react";
import { Blog_DTO, Blog_UpdateDTO } from "@/api/types/AngoraDTOs";
import EnumAutocomplete from "@/components/enumHandlers/enumAutocomplete";

// Opdater editableFieldLabels - fjern title, subtitle og content
export const editableFieldLabels: Record<Exclude<keyof Blog_UpdateDTO, 'title' | 'subtitle' | 'content'>, string> = {
    visibilityLevel: "Synlighed",
    category: "Kategori",
    tags: "Tags",
    metaDescription: "Meta beskrivelse",
    authorId: "Forfatter ID"
};

// Visibility options
const visibilityOptions = [
    { value: "Public", label: "Offentlig" },
    { value: "PaidContent", label: "Betalt indhold" }
];

function renderViewMode(
    key: Exclude<keyof Blog_UpdateDTO, 'title' | 'subtitle' | 'content'>,  // ✅ Ændret her
    value: unknown,
    textClassName: string
): ReactNode {
    if (key === "visibilityLevel") {
        const option = visibilityOptions.find(opt => opt.value === value);
        return <span className={textClassName}>{option?.label || value?.toString() || "Ikke angivet"}</span>;
    }

    if (key === "authorId") {
        return <span className="text-muted italic">Ikke redigerbar</span>;
    }

    return <span className={textClassName}>{value?.toString() || "Ikke angivet"}</span>;
}

// Opdater signaturen til at tage updateField
function renderEditMode(
  key: Exclude<keyof Blog_UpdateDTO, 'title' | 'subtitle' | 'content'>,
  value: unknown,
  isEditing: boolean,
  updateField: (key: any, value: any) => void,
  className: string
): ReactNode {
  if (key === "authorId") {
    return <span className="text-muted italic">Ikke redigerbar</span>;
  }

  if (key === "visibilityLevel") {
    return (
      <Select
        id={`${key}-input`}
        selectedKeys={value ? [value as string] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as string;
          updateField(key, selectedKey);
        }}
        className={className}
        placeholder="Vælg synlighed"
      >
        {visibilityOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    );
  }

  if (key === "metaDescription" || key === "tags") {
    return (
      <Textarea
        id={`${key}-input`}
        value={value?.toString() || ""}
        onChange={(e) => updateField(key, e.target.value)}
        className={className}
        placeholder={key === "metaDescription" ? "SEO beskrivelse..." : "Komma-separerede tags..."}
        minRows={2}
        maxRows={4}
      />
    );
  }

  if (key === "category") {
    return (
      <EnumAutocomplete
        enumType="BlogCategories"
        value={typeof value === 'string' ? value : null}  // <-- Fix: sikrer string | null
        onChange={val => updateField(key, val ?? "")}
        label="Kategori"
        placeholder="Vælg kategori"
      />
    );
  }

  return null;
}

// Opdater renderBlogField til at sende updateField
export function renderBlogField(
  key: Exclude<keyof Blog_UpdateDTO, 'title' | 'subtitle' | 'content'>,
  value: unknown,
  isEditing: boolean,
  updateField: (key: any, value: any) => void,
  isChanged?: boolean
): ReactNode {
  const inputClassName = `transition-colors duration-200 ${isChanged ? 'border-amber-400' : ''}`;
  const textClassName = isChanged ? 'text-amber-400' : 'text-body';

  if (!isEditing) {
    return renderViewMode(key, value, textClassName);
  }

  return renderEditMode(key, value, isEditing, updateField, inputClassName);
}