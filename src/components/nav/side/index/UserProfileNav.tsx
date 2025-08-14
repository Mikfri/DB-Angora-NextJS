// src/components/nav/side/index/UserProfileNav.tsx
'use client';

import { useMemo } from 'react';
import UserProfileNavBase from '../base/UserProfileNavBase';
import { UserProfileNavClient } from '../client/UserProfileNavClient';
import { NavAction } from '@/types/navigationTypes';
import { useUserAccountProfileStore } from '@/store/userAccountProfileStore';

interface UserProfileNavProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profilePicture?: string | null;
  onEdit?: () => void;
  isEditing?: boolean;
  footerActions?: NavAction[];
}

/**
 * Kombineret UserProfileNav komponent der integrerer base og client
 * Denne komponent bruges i applikationen for at simplificere import
 */
export default function UserProfileNav(props: UserProfileNavProps = {}) {
  // Læs user fra global store
  const user = useUserAccountProfileStore(state => state.user);
  const breederAccount = useUserAccountProfileStore(state => state.breederAccount);

  // Brug user-data fra store hvis ikke givet som prop
  const firstName = props.firstName ?? user?.firstName ?? '';
  const lastName = props.lastName ?? user?.lastName ?? '';
  const email = props.email ?? user?.email ?? '';
  const phone = props.phone ?? user?.phone ?? '';
  const profilePicture = props.profilePicture ?? user?.profilePicture ?? null;

  const title = useMemo(() => `Profil: ${firstName} ${lastName}`, [firstName, lastName]);

  return (
    <UserProfileNavBase title={title} footerActions={props.footerActions}>
      <UserProfileNavClient
        firstName={firstName}
        lastName={lastName}
        email={email}
        phone={phone}
        profilePicture={profilePicture}
        breederAccount={breederAccount}
        onEdit={props.onEdit}
        isEditing={props.isEditing}
      />
    </UserProfileNavBase>
  );
}