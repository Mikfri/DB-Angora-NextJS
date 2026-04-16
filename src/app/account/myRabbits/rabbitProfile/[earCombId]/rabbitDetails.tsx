// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitDetails.tsx
'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/heroui';
import { Rabbit_ProfileDTO, Rabbit_UpdateDTO } from "@/api/types/AngoraDTOs";
import PhotoSection from './rabbitPhotoSection';
import { editableFieldLabels, renderEditNode } from './rabbitFormFields';
import { PropertyTable } from '@/components/ui/custom/tables';
import { FaEdit } from 'react-icons/fa';

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

  const tableItems = (Object.keys(editableFieldLabels) as Array<keyof Rabbit_UpdateDTO>).map((key) => ({
    label: editableFieldLabels[key],
    editNode: renderEditNode(key, editedData, setEditedData, changedFields.has(key)),
    className: changedFields.has(key) ? 'bg-amber-400/5' : '',
  }));

  return (
    <div className="space-y-8">
      {/* Hovedcontainer der holder info og foto side ved side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venstre side: Kanin information */}
        <div className="lg:col-span-2">
          <div className="bg-surface backdrop-blur-md rounded-lg border border-divider overflow-hidden h-full">
            {/* Form Header med knapper */}
            <div className="flex justify-between items-center p-4 border-b border-divider">
              <h3 className="text-foreground font-medium">Kanin Information</h3>
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && isEditing && (
                  <span className="text-amber-400 text-sm animate-pulse mr-4">
                    Der er ændringer som ikke er gemt
                  </span>
                )}
                {!isEditing ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-warning"
                    onPress={() => setIsEditing(true)}
                  >
                    <FaEdit size={16} /> Rediger
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-success-foreground bg-success"
                      onPress={handleSave}
                      isDisabled={isSaving || !hasUnsavedChanges}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {isSaving ? 'Gemmer...' : 'Gem'}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={handleCancelWithReset}
                      isDisabled={isSaving}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      Annuller
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-4">
              <PropertyTable items={tableItems} className="bg-content1" useCard={false} isEditing={isEditing} />
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
