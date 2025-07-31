// src/app/account/profile/[userProfileId]/userDetails.tsx

'use client';

import { User_ProfileDTO, User_UpdateProfileDTO } from "@/api/types/AngoraDTOs";
import { editableUserFieldLabels, renderUserCell } from "./userFormFields";
import { Button } from "@heroui/react";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import PasswordSection from "./userPasswordSection";

type UserProfileUpdate = Partial<User_UpdateProfileDTO>;

interface Props {
    userProfile: User_ProfileDTO;
    isEditing: boolean;
    isSaving: boolean;
    editedData: UserProfileUpdate;
    setEditedData: (data: UserProfileUpdate) => void;
    setIsEditing: (isEditing: boolean) => void;
    handleSave: () => Promise<void>;
    // Password props fra hook
    handleChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    isChangingPassword: boolean;
    changePasswordError: string | null;
    changePasswordSuccess: boolean;
}

export default function UserDetails({
    userProfile,
    isEditing,
    isSaving,
    editedData,
    setEditedData,
    setIsEditing,
    handleSave,
    handleChangePassword,
    isChangingPassword,
    changePasswordError,
    changePasswordSuccess,
}: Props) {
    const [changedFields, setChangedFields] = useState<Set<keyof User_UpdateProfileDTO>>(new Set());

    useEffect(() => {
        if (!isEditing) {
            setChangedFields(new Set());
            return;
        }
        const newChangedFields = new Set<keyof User_UpdateProfileDTO>();
        (Object.keys(editableUserFieldLabels) as Array<keyof User_UpdateProfileDTO>).forEach(key => {
            if (editedData[key] !== undefined && editedData[key] !== userProfile[key]) {
                newChangedFields.add(key);
            }
        });
        setChangedFields(newChangedFields);
    }, [editedData, userProfile, isEditing]);

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({});
        setChangedFields(new Set());
    };

    const hasUnsavedChanges = changedFields.size > 0;

    return (
        <div>
            <div className="bg-zinc-900/60 rounded-lg border border-zinc-700/50 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-zinc-700/50">
                    <span className="text-base font-semibold text-zinc-200">Bruger information</span>
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
                    {(Object.keys(editableUserFieldLabels) as Array<keyof User_UpdateProfileDTO>).map(key => (
                        <div key={key} className="grid grid-cols-1 sm:grid-cols-[200px,1fr] gap-2 items-center">
                            <label
                                htmlFor={`${key}-input`}
                                id={`${key}-label`}
                                className={`font-medium ${changedFields.has(key) ? 'text-amber-400' : 'text-zinc-300'}`}
                            >
                                {editableUserFieldLabels[key]}
                            </label>
                            <div className="w-full">
                                {renderUserCell(
                                    key,
                                    userProfile[key],
                                    isEditing,
                                    editedData,
                                    setEditedData,
                                    userProfile,
                                    changedFields.has(key)
                                )}
                            </div>
                        </div>
                    ))}
                </form>
            </div>
            {/* Password section */}
            <PasswordSection
                isChangingPassword={isChangingPassword}
                changePasswordError={changePasswordError}
                changePasswordSuccess={changePasswordSuccess}
                handleChangePassword={handleChangePassword}
            />
        </div>
    );
}