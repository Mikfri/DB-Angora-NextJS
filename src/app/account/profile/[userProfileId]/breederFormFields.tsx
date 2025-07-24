// src/app/account/profile/[userProfileId]/breederFormFields.tsx
import { BreederAccount_PrivateProfileDTO } from "@/api/types/AngoraDTOs";
import { Input, Switch } from "@heroui/react";

export const editableBreederFieldLabels: Record<keyof Partial<Pick<BreederAccount_PrivateProfileDTO, "breederBrandName" | "breederBrandDescription" | "isFindable">>, string> = {
  breederBrandName: "Navn",
  breederBrandDescription: "Beskrivelse",
  isFindable: "Findbar"
};

export function renderBreederCell(
  key: keyof typeof editableBreederFieldLabels,
  value: unknown,
  isEditing: boolean,
  editedData: Partial<BreederAccount_PrivateProfileDTO>,
  setEditedData: (data: Partial<BreederAccount_PrivateProfileDTO>) => void,
  breederAccount?: BreederAccount_PrivateProfileDTO,
  isChanged?: boolean
) {
  const inputClassName = `transition-colors duration-200 ${isChanged ? 'border-amber-400' : ''}`;
  const textClassName = isChanged ? 'text-amber-400' : 'text-zinc-300';

  if (!isEditing) {
    return <span className={textClassName}>{value?.toString() || "Ikke angivet"}</span>;
  }

  if (key === "isFindable") {
    return (
      <Switch
        isSelected={editedData.isFindable ?? breederAccount?.isFindable ?? false}
        onChange={e => setEditedData({ ...editedData, isFindable: e.target.checked })}
        className="ml-2"
      >
        {(editedData.isFindable ?? breederAccount?.isFindable) ? "Ja" : "Nej"}
      </Switch>
    );
  }

  return (
    <Input
      id={`${key}-input`}
      size="sm"
      value={editedData[key]?.toString() ?? value?.toString() ?? ""}
      onChange={e => setEditedData({ ...editedData, [key]: e.target.value })}
      className={inputClassName}
      aria-label={editableBreederFieldLabels[key]}
    />
  );
}