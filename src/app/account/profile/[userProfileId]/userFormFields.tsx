// src/app/account/profile/[userProfileId]/userFormFields.tsx
import { User_ProfileDTO, User_UpdateProfileDTO } from "@/api/types/AngoraDTOs";
import { Input } from "@heroui/react";

export const editableUserFieldLabels: Record<keyof User_UpdateProfileDTO, string> = {
    firstName: "Fornavn",
    lastName: "Efternavn",
    roadNameAndNo: "Vej og husnummer",
    zipCode: "Postnummer",
    city: "By",
    phone: "Telefon"
};

export function renderUserCell(
    key: keyof User_UpdateProfileDTO,
    value: unknown,
    isEditing: boolean,
    editedData: Partial<User_UpdateProfileDTO>,
    setEditedData: (data: Partial<User_UpdateProfileDTO>) => void,
    userProfile?: User_ProfileDTO,
    isChanged?: boolean
) {
    const inputClassName = `transition-colors duration-200 ${isChanged ? 'border-amber-400' : ''}`;
    const textClassName = isChanged ? 'text-amber-400' : 'text-zinc-300';

    if (!isEditing) {
        return <span className={textClassName}>{value?.toString() || "Ikke angivet"}</span>;
    }

    // Special case for zipCode (number)
    if (key === "zipCode") {
        return (
            <Input
                id={`${key}-input`}
                size="sm"
                type="number"
                value={
                    editedData.zipCode !== undefined
                        ? String(editedData.zipCode)
                        : value !== undefined && value !== null
                            ? String(value)
                            : ""
                } onChange={e => setEditedData({ ...editedData, zipCode: parseInt(e.target.value) })}
                className={inputClassName}
                aria-label={editableUserFieldLabels[key]}
            />
        );
    }

    // Default text input
    return (
        <Input
            id={`${key}-input`}
            size="sm"
            value={editedData[key]?.toString() ?? value?.toString() ?? ""}
            onChange={e => setEditedData({ ...editedData, [key]: e.target.value })}
            className={inputClassName}
            aria-label={editableUserFieldLabels[key]}
        />
    );
}