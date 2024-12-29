'use client';
import { useState } from "react";
import { User_ProfileDTO } from "@/Types/backendTypes";
import { toast } from "react-toastify";

export function useUserProfile(initialProfile: User_ProfileDTO) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedData, setEditedData] = useState<User_ProfileDTO>({ ...initialProfile });

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await fetch('/api/auth/token');
            const { accessToken } = await response.json();

            if (!accessToken) {
                toast.error("Du er ikke logget ind");
                return;
            }

            // Add API logic to save the updated user profile here.
            toast.success("Profilen blev opdateret!");
            setIsEditing(false);
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
        setEditedData,
        setIsEditing,
        handleSave,
    };
}
