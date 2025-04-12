// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitDetails.tsx
'use client'

import { useState, useEffect } from 'react';
import { Button } from "@heroui/react";
import { Rabbit_ProfileDTO, Rabbit_UpdateDTO } from "@/api/types/AngoraDTOs";
import PhotoSection from './rabbitPhotoSection';
import { editableFieldLabels, renderCell } from './rabbitFormFields';

interface RabbitDetailsProps {
  rabbitProfile: Rabbit_ProfileDTO;
  isEditing: boolean;
  isSaving: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleSave: () => void;
  handleCancel: () => void;
  editedData: Rabbit_ProfileDTO;
  setEditedData: (data: Rabbit_ProfileDTO) => void;
}

export default function RabbitDetails({
  rabbitProfile,
  isEditing,
  isSaving,
  setIsEditing,
  handleSave,
  handleCancel,
  editedData,
  setEditedData
}: RabbitDetailsProps) {
  const [changedFields, setChangedFields] = useState<Set<keyof Rabbit_UpdateDTO>>(new Set());

  // Ved cancel, nulstil også changedFields
  const handleCancelWithReset = () => {
    handleCancel(); // Kald parent handler
    setChangedFields(new Set()); // Clear tracked changes lokalt
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
          const date1 = originalValue ? new Date(originalValue as string).getTime() : null;
          const date2 = currentValue ? new Date(currentValue as string).getTime() : null;
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
    <div className="space-y-8">
      {/* Hovedcontainer der holder info og foto side ved side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venstre side: Kanin information */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50 overflow-hidden h-full">
            {/* Form Header med knapper */}
            <div className="flex justify-between items-center p-4 border-b border-zinc-700/50">
              <h3 className="text-zinc-100 font-medium">Kanin Information</h3>
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && isEditing && (
                  <span className="text-amber-400 text-sm animate-pulse mr-4">
                    Der er ændringer som ikke er gemt
                  </span>
                )}
                {!isEditing ? (
                  <Button
                    size="sm"
                    color="warning"
                    variant="light"
                    onPress={() => setIsEditing(true)}
                    startContent={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    }
                  >
                    Rediger
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      color="success"
                      onPress={handleSave}
                      isDisabled={isSaving || !hasUnsavedChanges}
                      className='text-white'
                      startContent={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      }
                    >
                      {isSaving ? 'Gemmer...' : 'Gem'}
                    </Button>
                    <Button
                      size="sm"
                      color="secondary"
                      variant="ghost"
                      onPress={handleCancelWithReset}
                      isDisabled={isSaving}
                      startContent={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      }
                    >
                      Annuller
                    </Button>
                  </>
                )}
              </div>            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="grid gap-4 p-4">
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
        </div>

        {/* Højre side: Foto sektion (kun vist når ikke i redigeringstilstand) */}
        {!isEditing && (
          <div className="lg:col-span-1">
            <PhotoSection earCombId={rabbitProfile.earCombId} />
          </div>
        )}
      </div>
    </div>
  );
}