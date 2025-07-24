// src/hooks/breeders/useBreederAccount.ts
import { useState } from "react";
import { BreederAccount_PrivateProfileDTO, BreederAccount_UpdateDTO } from "@/api/types/AngoraDTOs";
import { updateBreederAccount } from "@/app/actions/breederAccount/breederAccountActions";

type BreederAccountUpdate = Partial<BreederAccount_UpdateDTO>;

export function useBreederAccount(
  breederAccount: BreederAccount_PrivateProfileDTO,
  userId: string,
  setBreederAccount: (profile: BreederAccount_PrivateProfileDTO) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<BreederAccountUpdate>({});
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    setError(null);
    try {
      const updatePayload: BreederAccount_UpdateDTO = {
        breederBrandName: editedData.breederBrandName ?? breederAccount.breederBrandName,
        breederBrandDescription: editedData.breederBrandDescription ?? breederAccount.breederBrandDescription,
        isFindable: editedData.isFindable ?? breederAccount.isFindable,
      };
      const result = await updateBreederAccount(userId, updatePayload);

      if (!result.success || !result.data) {
        setError(result.error ?? "Ukendt fejl");
        setIsSaving(false);
        return;
      }
      setIsEditing(false);
      setEditedData({});
      setIsSaving(false);
      setBreederAccount(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Der opstod en fejl ved opdatering.");
      setIsSaving(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    isSaving,
    editedData,
    setEditedData,
    handleSave,
    error,
  };
}