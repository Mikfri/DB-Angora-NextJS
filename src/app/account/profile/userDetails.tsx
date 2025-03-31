// src/app/account/profile/userDetails.tsx
'use client';

import { EditableUserProfile } from "@/hooks/users/useUserProfile";
import { User_ProfileDTO } from "@/api/types/AngoraDTOs";
import { Input, Button } from "@heroui/react";
import { useState, useEffect } from 'react';

interface Props {
    userProfile: User_ProfileDTO;
    isEditing: boolean;
    isSaving: boolean;
    editedData: EditableUserProfile;
    setEditedData: (data: Partial<EditableUserProfile>) => void;
    setIsEditing: (isEditing: boolean) => void;
    handleSave: () => Promise<void>;
}

export default function UserDetails({
    userProfile,
    isEditing,
    isSaving,
    editedData,
    setEditedData,
    setIsEditing,
    handleSave
}: Props) {
    const [changedFields, setChangedFields] = useState<Set<keyof EditableUserProfile>>(new Set());

    // Track changes
    useEffect(() => {
        if (!isEditing) return;
        
        const newChangedFields = new Set<keyof EditableUserProfile>();
        Object.keys(editedData).forEach(key => {
            const k = key as keyof EditableUserProfile;
            if (editedData[k] !== userProfile[k]) {
                newChangedFields.add(k);
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
        <div className="space-y-6">
            {/* Edit Controls */}
            <div className="flex justify-between items-center">
                {hasUnsavedChanges && isEditing && (
                    <span className="text-amber-400 text-sm animate-pulse">
                        Der er ændringer som ikke er gemt
                    </span>
                )}
                <div className="flex justify-end flex-1">
                    {!isEditing ? (
                        <Button 
                            size="sm" 
                            color="primary"
                            onPress={() => setIsEditing(true)}
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

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-zinc-200">Personlige oplysninger</h2>
                    <Input
                        label="Fornavn"
                        value={editedData.firstName ?? userProfile.firstName}
                        onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                        isDisabled={!isEditing}
                        required
                    />
                    <Input
                        label="Efternavn"
                        value={editedData.lastName ?? userProfile.lastName}
                        onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                        isDisabled={!isEditing}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={editedData.email ?? userProfile.email}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        isDisabled={!isEditing}
                        required
                    />
                    <Input
                        label="Telefon"
                        type="tel"
                        value={editedData.phone ?? userProfile.phone}
                        onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                        isDisabled={!isEditing}
                        required
                    />
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-zinc-200">Adresse</h2>
                    <Input
                        label="Vej og husnummer"
                        value={editedData.roadNameAndNo ?? userProfile.roadNameAndNo}
                        onChange={(e) => setEditedData({ ...editedData, roadNameAndNo: e.target.value })}
                        isDisabled={!isEditing}
                        required
                    />
                    <Input
                        label="By"
                        value={editedData.city ?? userProfile.city}
                        onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
                        isDisabled={!isEditing}
                        required
                    />
                    <Input
                        label="Postnummer"
                        type="number"
                        value={String(editedData.zipCode ?? userProfile.zipCode)}
                        onChange={(e) => setEditedData({ ...editedData, zipCode: parseInt(e.target.value) })}
                        isDisabled={!isEditing}
                        required
                    />
                </div>
            </div>
        </div>
    );
}