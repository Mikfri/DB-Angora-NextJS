// src/app/account/profile/userProfile.tsx
'use client';

import { User_ProfileDTO } from "@/api/types/AngoraDTOs";
import { useUserProfile, type EditableUserProfile } from "@/hooks/users/useUserProfile";
import { useNav } from "@/components/providers/Providers";
import { useEffect, useMemo } from 'react';
import UserProfileNav from "@/components/nav/side/variants/userProfileNav";
import MyNav from "@/components/nav/side/index/MyNav";
import UserDetails from "./userDetails";

interface Props {
    userProfile: User_ProfileDTO;
}

export default function UserProfile({ userProfile }: Props) {
    const { 
        isEditing, 
        isSaving, 
        editedData, 
        setEditedData, 
        setIsEditing, 
        handleSave 
    } = useUserProfile(userProfile);
    
    const { setPrimaryNav, setSecondaryNav } = useNav();

    // Memoize the navigation data
    const navData = useMemo(() => ({
        breederRegNo: userProfile.breederRegNo,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phone: userProfile.phone,
        onEdit: () => setIsEditing(true),
        isEditing
    }), [userProfile, isEditing, setIsEditing]);

    // Set up navigation
    useEffect(() => {
        setPrimaryNav(<UserProfileNav {...navData} />);
        setSecondaryNav(<MyNav />);

        return () => {
            setPrimaryNav(null);
            setSecondaryNav(null);
        };
    }, [navData, setPrimaryNav, setSecondaryNav]);

    const detailsProps = {
        userProfile,
        isEditing,
        isSaving,
        editedData: editedData as EditableUserProfile, // Type assertion for compatibility
        setEditedData: setEditedData as (data: Partial<EditableUserProfile>) => void,
        setIsEditing,
        handleSave
    };

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-zinc-100">
                    {userProfile.firstName} {userProfile.lastName}
                </h1>
            </div>

            <UserDetails {...detailsProps} />
        </div>
    );
}