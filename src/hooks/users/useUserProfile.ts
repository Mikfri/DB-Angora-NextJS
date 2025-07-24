// src/hooks/users/useUserProfile.ts
import { useState } from "react";
import { User_ProfileDTO, User_UpdateProfileDTO } from "@/api/types/AngoraDTOs";
import { updateUserProfile } from "@/app/actions/account/accountActions";

type UserProfileUpdate = Partial<User_UpdateProfileDTO>;

export function useUserProfile(
  userProfile: User_ProfileDTO,
  setUserProfile: (profile: User_ProfileDTO) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<UserProfileUpdate>({});
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    setError(null);
    try {
      const updatePayload: User_UpdateProfileDTO = {
        firstName: editedData.firstName ?? userProfile.firstName,
        lastName: editedData.lastName ?? userProfile.lastName,
        roadNameAndNo: editedData.roadNameAndNo ?? userProfile.roadNameAndNo,
        zipCode: editedData.zipCode ?? userProfile.zipCode,
        city: editedData.city ?? userProfile.city,
        phone: editedData.phone ?? userProfile.phone,
      };
      const result = await updateUserProfile(userProfile.userId, updatePayload);
      if (!result.success || !result.data) {
        setError(result.error ?? "Ukendt fejl");
        setIsSaving(false);
        return;
      }
      setIsEditing(false);
      setEditedData({});
      setIsSaving(false);
      setUserProfile(result.data); // ← OPDATER PROFILEN I UI!
    } catch (err) {
      setError("Der opstod en fejl ved opdatering.");
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