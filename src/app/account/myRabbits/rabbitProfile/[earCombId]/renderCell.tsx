// src/utils/renderCell.tsx
import React, { ReactNode } from "react";
import { PiRabbitFill, PiRabbit } from "react-icons/pi";
import { Input, Switch } from "@heroui/react";
import { Rabbit_ProfileDTO, Rabbit_UpdateDTO } from "@/Types/AngoraDTOs";
import EnumAutocomplete from "@/components/enumHandlers/enumAutocomplete";

// Helper function for parent validation
function isParentValid(placeholderId: string | null, actualId: string | null): boolean {
  return !!placeholderId && placeholderId === actualId;
}

// First, add the editableFieldLabels constant at the top with other constants
const editableFieldLabels: Record<keyof Rabbit_UpdateDTO, string> = {
  nickName: "Navn",
  race: "Race",
  color: "Farve",
  dateOfBirth: "Fødselsdato",
  dateOfDeath: "Dødsdato",
  gender: "Køn",
  forSale: "Til salg",
  forBreeding: "Til avl",
  fatherId_Placeholder: "Far ID",
  motherId_Placeholder: "Mor ID"
};

export function renderCell(
  key: keyof Rabbit_UpdateDTO,
  value: unknown,
  isEditing: boolean,
  editedData: Rabbit_ProfileDTO,
  setEditedData: (data: Rabbit_ProfileDTO) => void,
  rabbitProfile?: Rabbit_ProfileDTO,
  isChanged?: boolean
): ReactNode {
  const inputClassName = `transition-colors duration-200 ${isChanged ? 'border-amber-400' : ''
    }`;
  const textClassName = isChanged ? 'text-amber-400' : 'text-zinc-300';

  if (!isEditing) {
    return renderViewMode(key, value, rabbitProfile, textClassName);
  }

  return renderEditMode(key, editedData, setEditedData, inputClassName);
}

// Helper function for view mode rendering
function renderViewMode(
  key: keyof Rabbit_UpdateDTO,
  value: unknown,
  rabbitProfile: Rabbit_ProfileDTO | undefined,
  textClassName: string
): ReactNode {
  // Date fields
  if (key === "dateOfBirth" || key === "dateOfDeath") {
    return (
      <span className={textClassName}>
        {value ? new Date(value as string).toLocaleDateString() : "Ikke angivet"}
      </span>
    );
  }

  // Parent fields
  if (key === "fatherId_Placeholder" || key === "motherId_Placeholder") {
    if (!rabbitProfile || !value) return null;

    const actualId = key === "fatherId_Placeholder"
      ? rabbitProfile.father_EarCombId
      : rabbitProfile.mother_EarCombId;
    const parentValid = isParentValid(value as string, actualId ?? null);

    return (
      <div className="flex items-center gap-2">
        {parentValid ? (
          <PiRabbitFill
            className="w-5 h-5 text-blue-500"
            title="Forælder findes i systemet"
          />
        ) : (
          <PiRabbit
            className="w-5 h-5 text-zinc-400"
            title="Forælder findes ikke i systemet"
          />
        )}
        <span className="text-zinc-300">
          {String(value)}
        </span>
      </div>
    );
  }

  return <span className={textClassName}>{value?.toString() || "Ikke angivet"}</span>;
}

// Helper function for edit mode rendering
function renderEditMode(
  key: keyof Rabbit_UpdateDTO,
  editedData: Rabbit_ProfileDTO,
  setEditedData: (data: Rabbit_ProfileDTO) => void,
  className: string
): ReactNode {
  // Enum inputs (moved to top since it's more specific)
  if (key === "race" || key === "color" || key === "gender") {
    const enumType = key === "race" ? "Race" : key === "color" ? "Color" : "Gender";
    return (
      <EnumAutocomplete
        id={`${key}-input`}
        enumType={enumType}
        value={editedData[key]}
        onChange={(newVal) => setEditedData({ ...editedData, [key]: newVal })}
        label={editableFieldLabels[key]}
        aria-labelledby={`${key}-label`}
        placeholder={`Vælg ${editableFieldLabels[key].toLowerCase()}`}
      />
    );
  }

  // Boolean switches
  if (key === "forSale" || key === "forBreeding") {
    return (
      <Switch
        id={`${key}-input`}
        size="sm"
        isSelected={editedData[key] === "Ja"}
        onValueChange={(checked) =>
          setEditedData({ ...editedData, [key]: checked ? "Ja" : "Nej" })
        }
        className={className}
        aria-label={editableFieldLabels[key]}
      />
    );
  }

  // Date inputs
  if (key === "dateOfBirth" || key === "dateOfDeath") {
    // Format the date value for the input
    let dateValue = '';
    if (editedData[key]) {
      const date = new Date(editedData[key] as string);
      dateValue = date.toISOString().split('T')[0]; // Gets YYYY-MM-DD format
    }

    return (
      <Input
        id={`${key}-input`}
        size="sm"
        type="date"
        value={dateValue}
        onChange={(e) => {
          // When a new date is selected, format it consistently
          const newDate = e.target.value
            ? new Date(e.target.value).toISOString().split('T')[0]  // Convert to YYYY-MM-DD
            : null;
          setEditedData({ ...editedData, [key]: newDate });
        }}
        className={className}
        aria-label={editableFieldLabels[key]}
      />
    );
  }

  // Parent ID inputs
  if (key === "fatherId_Placeholder" || key === "motherId_Placeholder") {
    return (
      <Input
        id={`${key}-input`}
        size="sm"
        value={editedData[key] as string || ''}
        onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
        className={className}
        aria-label={editableFieldLabels[key]}
        placeholder="Indtast øremærke ID"
      />
    );
  }

  // Text input (default case)
  return (
    <Input
      id={`${key}-input`}
      size="sm"
      value={editedData[key]?.toString() || ""}
      onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
      className={className}
      aria-label={editableFieldLabels[key]}
    />
  );
}