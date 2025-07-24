// src/app/account/profile/[userProfileId]/breederDetails.tsx
'use client';

import { BreederAccount_PrivateProfileDTO } from "@/api/types/AngoraDTOs";
import { useBreederAccount } from "@/hooks/breeders/useBreederAccount";
import { Button } from "@heroui/react";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import { editableBreederFieldLabels, renderBreederCell } from "./breederFormFields";

type BreederProfileUpdate = Partial<Pick<BreederAccount_PrivateProfileDTO, "breederBrandName" | "breederBrandDescription" | "isFindable">>;

interface Props {
  breederAccount: BreederAccount_PrivateProfileDTO;
  userId: string;
  setBreederAccount: (profile: BreederAccount_PrivateProfileDTO) => void;
}

export default function BreederAccountDetails({ breederAccount, userId, setBreederAccount }: Props) {
  const {
    isEditing,
    setIsEditing,
    isSaving,
    editedData,
    setEditedData,
    handleSave,
  } = useBreederAccount(breederAccount, userId, setBreederAccount);

  const [changedFields, setChangedFields] = useState<Set<keyof BreederProfileUpdate>>(new Set());

  useEffect(() => {
    if (!isEditing) {
      setChangedFields(new Set());
      return;
    }
    const newChangedFields = new Set<keyof BreederProfileUpdate>();
    (Object.keys(editableBreederFieldLabels) as Array<keyof BreederProfileUpdate>).forEach(key => {
      if (editedData[key] !== undefined && editedData[key] !== breederAccount[key]) {
        newChangedFields.add(key);
      }
    });
    setChangedFields(newChangedFields);
  }, [editedData, breederAccount, isEditing]);

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
    setChangedFields(new Set());
  };

  const hasUnsavedChanges = changedFields.size > 0;

  return (
    <div className="bg-zinc-900/60 rounded-lg border border-zinc-700/50 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-zinc-700/50">
        <span className="text-base font-semibold text-zinc-200">Avlerkonto</span>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && isEditing && (
            <span className="text-amber-400 text-sm animate-pulse mr-2">
              Der er ændringer som ikke er gemt
            </span>
          )}
          {!isEditing ? (
            <Button
              size="sm"
              variant="light"
              color="warning"
              onPress={() => setIsEditing(true)}
              startContent={<FaEdit size={16} />}
            >
              Rediger
            </Button>
          ) : (
            <div className="space-x-2">
              <Button
                size="sm"
                color="success"
                onPress={handleSave}
                isDisabled={isSaving || !hasUnsavedChanges}
                className="text-white"
              >
                {isSaving ? "Gemmer..." : "Gem"}
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
      <form className="grid gap-4 p-4">
        {(Object.keys(editableBreederFieldLabels) as Array<keyof BreederProfileUpdate>).map(key => (
          <div key={key} className="grid grid-cols-1 sm:grid-cols-[200px,1fr] gap-2 items-center">
            <label
              htmlFor={`${key}-input`}
              id={`${key}-label`}
              className={`font-medium ${changedFields.has(key) ? 'text-amber-400' : 'text-zinc-300'}`}
            >
              {editableBreederFieldLabels[key]}
            </label>
            <div className="w-full">
              {renderBreederCell(
                key,
                breederAccount[key],
                isEditing,
                editedData,
                setEditedData,
                breederAccount,
                changedFields.has(key)
              )}
            </div>
          </div>
        ))}
      </form>
    </div>
  );
}