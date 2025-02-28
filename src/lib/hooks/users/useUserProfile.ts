'use client';
import { useState } from "react";
import { User_ProfileDTO } from "@/api/types/AngoraDTOs";
import { toast } from "react-toastify";

// Export the type and rename it to EditableUserProfile
export type EditableUserProfile = {
    [K in keyof User_ProfileDTO]?: User_ProfileDTO[K] | null;
};

// Define update type based on User_ProfileDTO
type UserProfileUpdate = {
    [K in keyof User_ProfileDTO]?: User_ProfileDTO[K] | null;
};

interface UseUserProfileReturn {
    isEditing: boolean;
    isSaving: boolean;
    editedData: UserProfileUpdate;
    setEditedData: (data: Partial<UserProfileUpdate>) => void;
    setIsEditing: (value: boolean) => void;
    handleSave: () => Promise<void>;
}

export function useUserProfile(initialProfile: User_ProfileDTO): UseUserProfileReturn {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedData, setEditedData] = useState<UserProfileUpdate>({});

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await fetch('/api/auth/token');
            const { accessToken } = await response.json();

            if (!accessToken) {
                toast.error("Du er ikke logget ind");
                return;
            }

            // Filter out unchanged values
            const updateData = Object.entries(editedData).reduce((acc, [key, value]) => {
                const k = key as keyof User_ProfileDTO;
                if (value !== initialProfile[k]) {
                    // acc[k] = value;
                }
                return acc;
            }, {} as UserProfileUpdate);

            if (Object.keys(updateData).length > 0) {
                // TODO: Add API call when endpoint is ready
                // const updateResponse = await fetch('/api/user/profile', {
                //     method: 'PATCH',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': `Bearer ${accessToken}`
                //     },
                //     body: JSON.stringify(updateData)
                // });

                toast.success("Profilen blev opdateret!");
                setIsEditing(false);
                setEditedData({});
            } else {
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error saving user profile:", error);
            toast.error("Der skete en fejl ved opdatering af profilen");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        isEditing,
        isSaving,
        editedData,
        setEditedData: (data: Partial<UserProfileUpdate>) => 
            setEditedData(current => ({ ...current, ...data })),
        setIsEditing,
        handleSave,
    };
}