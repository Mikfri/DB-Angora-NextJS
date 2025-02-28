// src/account/myRabbits/rabbitProfile/[earCombId]/rabbitDetails.tsx
'use client'

import { useState, useEffect } from 'react';
import { Button } from "@heroui/react";
import { Rabbit_ProfileDTO, Rabbit_UpdateDTO } from "@/api/types/AngoraDTOs";
import { renderCell } from "@/app/account/myRabbits/rabbitProfile/[earCombId]/renderCell";

interface RabbitDetailsProps {
  rabbitProfile: Rabbit_ProfileDTO;
  isEditing: boolean;
  isSaving: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleSave: () => void;
  editedData: Rabbit_ProfileDTO;
  setEditedData: (data: Rabbit_ProfileDTO) => void;
}

const editableFieldLabels: Record<keyof Rabbit_UpdateDTO, string> = {
  nickName: "Navn",
  race: "Race",
  color: "Farve",
  dateOfBirth: "Fødselsdato",
  dateOfDeath: "Dødsdato",
  gender: "Køn",
  forBreeding: "Til avl",
  fatherId_Placeholder: "Far ID",
  motherId_Placeholder: "Mor ID"
};

export default function RabbitDetails({
  rabbitProfile,
  isEditing,
  isSaving,
  setIsEditing,
  handleSave,
  editedData,
  setEditedData
}: RabbitDetailsProps) {
  const [changedFields, setChangedFields] = useState<Set<keyof Rabbit_UpdateDTO>>(new Set());

  // Reset function to handle cancel
  const handleCancel = () => {
    setEditedData(rabbitProfile); // Reset to original values
    setChangedFields(new Set()); // Clear tracked changes
    setIsEditing(false);
  };

  // Track changes
  useEffect(() => {
    if (!isEditing) return; // Only track changes while editing

    const newChangedFields = new Set<keyof Rabbit_UpdateDTO>();
    (Object.keys(editableFieldLabels) as Array<keyof Rabbit_UpdateDTO>).forEach(key => {
      const originalValue = rabbitProfile[key];
      const currentValue = editedData[key];

      // Simple equality check - works for primitives and null
      if (originalValue !== currentValue) {
        // Special handling for dates
        if (key === 'dateOfBirth' || key === 'dateOfDeath') {
          const date1 = originalValue ? new Date(originalValue).getTime() : null;
          const date2 = currentValue ? new Date(currentValue).getTime() : null;
          if (date1 !== date2) {
            newChangedFields.add(key);
          }
        } else {
          newChangedFields.add(key);
        }
      }
    });
    setChangedFields(newChangedFields);
  }, [editedData, rabbitProfile, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  const hasUnsavedChanges = changedFields.size > 0;

  return (
    <div className="space-y-4">
      {/* Action Buttons and Change Indicator */}
      <div className="flex justify-between items-center">
        {hasUnsavedChanges && isEditing && (
          <span className="text-amber-400 text-sm animate-pulse">
            Der er ændringer som ikke er gemt
          </span>
        )}
        <div className="flex justify-end flex-1">
          {!isEditing ? (
            <Button size="sm" onPress={() => setIsEditing(true)}>
              Rediger
            </Button>
          ) : (
            <div className="space-x-2">
              <Button 
                size="sm" 
                color="success"
                onPress={handleSave} 
                isDisabled={isSaving || !hasUnsavedChanges}
                className='text-white'
              >
                {isSaving ? 'Gemmer...' : 'Gem'}
              </Button>
              <Button
                size="sm"
                color="secondary"
                onPress={handleCancel}
                isDisabled={isSaving}
              >
                Annuller
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-4 p-4 bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50">
        {(Object.keys(editableFieldLabels) as Array<keyof Rabbit_UpdateDTO>).map((key) => (
          <div key={key} className="grid grid-cols-1 sm:grid-cols-[200px,1fr] gap-2 items-center">
            <label
              htmlFor={`${key}-input`}
              id={`${key}-label`}
              className={`font-medium ${changedFields.has(key) ? 'text-amber-400' : 'text-zinc-300'}`}
            >
              {editableFieldLabels[key]}
            </label>
            <div className="w-full">
              {renderCell(
                key,
                rabbitProfile[key],
                isEditing,
                editedData,
                setEditedData,
                rabbitProfile,
                changedFields.has(key)
              )}
            </div>
          </div>
        ))}
      </form>
    </div>
  );
}