// src/app/account/profile/userProfile.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useNav } from '@/components/providers/Providers';
import UserProfileNav from '@/components/nav/side/index/UserProfileNav';
import MyNav from '@/components/nav/side/index/MyNav';
import UserDetails from './userDetails';
import { useUserProfile } from '@/hooks/users/useUserProfile';
import SideNavLayout from '@/components/layouts/SideNavLayout';
import { User_ProfileDTO } from "@/api/types/AngoraDTOs";

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
    handleSave,
  } = useUserProfile(userProfile);
  
  const { setSecondaryNav } = useNav();

  // Memoize the navigation component to prevent unnecessary re-renders
  const navComponent = useMemo(() => (
    <UserProfileNav
      breederRegNo={userProfile.breederRegNo}
      firstName={userProfile.firstName}
      lastName={userProfile.lastName}
      email={userProfile.email}
      phone={userProfile.phone}
      profilePicture={userProfile.profilePicture}
      onEdit={() => setIsEditing(true)}
      isEditing={isEditing}
    />
  ), [userProfile, isEditing, setIsEditing]);

  // Set up secondary navigation
  useEffect(() => {
    setSecondaryNav(<MyNav />);
    
    return () => {
      setSecondaryNav(null);
    };
  }, [setSecondaryNav]);

  const detailsProps = {
    userProfile,
    isEditing,
    isSaving,
    editedData,
    setEditedData,
    setIsEditing,
    handleSave
  };

  // Create the content component
  const content = (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Min profil</h1>
      </div>
      
      <UserDetails {...detailsProps} />
    </div>
  );

  // Wrap everything in SideNavLayout like in RabbitProfile
  return (
    <SideNavLayout sideNav={navComponent}>
      {content}
    </SideNavLayout>
  );
}