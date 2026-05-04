// src/app/account/myBlogs/blogWorkspace/[blogId]/blogFormFields.tsx

/**
 * Ansvar:
 * Centraliserer rendering af blog-metadatafelter (ikke selve content-editoren).
 *
 * Funktion:
 * - Definerer labels og visningslogik for metadatafelter
 * - Renderer read-only eller redigerbar variant pr. felt
 * - Holder felt-specifikke input-komponenter samlet ét sted
 */

import { ReactNode } from "react";
import { TextArea } from "@heroui/react";
import { HeroSelect, HeroSelectItem } from '@/components/ui/heroui';
import { Blog_UpdateDTO } from "@/api/types/AngoraDTOs";
import EnumAutocomplete from "@/components/ui/custom/autocomplete/EnumAutocomplete";

// Opdater editableFieldLabels - fjern title, subtitle og content
export const editableFieldLabels: Record<Exclude<keyof Blog_UpdateDTO, 'title' | 'subtitle' | 'content'>, string> = {
  visibilityLevel: "Synlighed",
  category: "Kategori",
  tags: "Tags",
  metaDescription: "Meta beskrivelse",
};

// Visibility options
const visibilityOptions = [
  { value: "Public", label: "Offentlig" },
  { value: "PaidContent", label: "Betalt indhold" }
];

function renderViewMode(
  key: Exclude<keyof Blog_UpdateDTO, 'title' | 'subtitle' | 'content'>,
  value: unknown,
  textClassName: string
): ReactNode {
  if (key === "visibilityLevel") {
    const option = visibilityOptions.find(opt => opt.value === value);
    return <span className={textClassName}>{option?.label || value?.toString() || "Ikke angivet"}</span>;
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

  if (key === "visibilityLevel") {
    return (
      <HeroSelect
        value={value as string ?? null}
        onChange={(v) => updateField(key, v)}
        placeholder="Vælg synlighed"
        className={className}
      >
        {visibilityOptions.map((option) => (
          <HeroSelectItem key={option.value} id={option.value} textValue={option.label}>
            {option.label}
          </HeroSelectItem>
        ))}
      </HeroSelect>
    );
  }

  if (key === "metaDescription" || key === "tags") {
    return (
      <TextArea
        id={`${key}-input`}
        value={value?.toString() || ""}
        onChange={(e) => updateField(key, e.target.value)}
        className={className}
        placeholder={key === "metaDescription" ? "SEO beskrivelse..." : "Komma-separerede tags..."}
        rows={2}
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
