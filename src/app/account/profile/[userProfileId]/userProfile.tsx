// src/app/account/profile/[userProfileId]/userProfile.tsx
'use client';

import { useEffect, useState } from 'react';
import { Tabs, Tab } from "@heroui/react";
import UserDetails from './userDetails';
import { User_ProfileDTO } from "@/api/types/AngoraDTOs";
import { useUserProfile } from '@/hooks/users/useUserProfile';
import BreederAccountDetails from './breederDetails';
import { useUserAccountProfileStore } from '@/store/userAccountProfileStore';

interface Props {
  userProfile: User_ProfileDTO;
}

export default function UserProfile({ userProfile: initialProfile }: Props) {
  const [userProfile, setUserProfile] = useState<User_ProfileDTO>(initialProfile);
  const [activeTab, setActiveTab] = useState<string>('details');
  const setUser = useUserAccountProfileStore(state => state.setUser);
  const setBreederAccount = useUserAccountProfileStore(state => state.setBreederAccount);

  useEffect(() => {
    setUser(userProfile);
  }, [userProfile, setUser]);

  const {
    isEditing,
    setIsEditing,
    isSaving,
    editedData,
    setEditedData,
    handleSave,
    error,
    // Password change props
    handleChangePassword,
    isChangingPassword,
    changePasswordError,
    changePasswordSuccess,
  } = useUserProfile(userProfile, setUserProfile);

  const displayName = `${userProfile.firstName} ${userProfile.lastName}`;

  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">
          {displayName}
        </h1>
        {error && (
          <div className="text-red-400 mt-2">{error}</div>
        )}
      </div>

      <Tabs
        aria-label="Brugerprofil"
        selectedKey={activeTab}
        onSelectionChange={key => setActiveTab(key as string)}
        variant="underlined"
        color="primary"
        classNames={{
          tabList: "gap-6 w-full relative p-0 border-b border-zinc-700/50",
          cursor: "w-full bg-blue-500",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-blue-500",
          panel: "pt-5"
        }}
      >
        <Tab key="details" title={<span>Profiloplysninger</span>}>
          <UserDetails
            userProfile={userProfile}
            isEditing={isEditing}
            isSaving={isSaving}
            editedData={editedData}
            setEditedData={setEditedData}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            // Password props
            handleChangePassword={handleChangePassword}
            isChangingPassword={isChangingPassword}
            changePasswordError={changePasswordError}
            changePasswordSuccess={changePasswordSuccess}
          />
        </Tab>
        <Tab key="breeder" title={<span>Avlerkonto</span>}>
          {userProfile.breederAccount ? (
            <BreederAccountDetails
              breederAccount={userProfile.breederAccount}
              userId={userProfile.userId}
              setBreederAccount={updated => {
                setUserProfile({
                  ...userProfile,
                  breederAccount: updated
                });
                setBreederAccount(updated);
              }}
            />
          ) : (
            <div className="text-zinc-400">Ingen avlerkonto tilknyttet.</div>
          )}
        </Tab>
        {/* <Tab key="favoristes" title={<span>Favoritter</span>}>
          <div className="text-zinc-400">Denne funktion er under udvikling.</div>
        </Tab> */}
      </Tabs>
    </div>
  );
}