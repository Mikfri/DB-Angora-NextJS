// src/components/nav/side/index/UserProfileNav.tsx
'use client';

import { useMemo } from 'react';
import UserProfileNavBase from '../base/UserProfileNavBase';
import { UserProfileNavClient } from '../client/UserProfileNavClient';
import { NavAction } from '@/types/navigation';

interface UserProfileNavProps {
  // Brugerdata
  breederRegNo: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture?: string | null;
  
  // Redigeringsfunktionalitet
  onEdit?: () => void;
  isEditing?: boolean;
  
  // Ekstra actions
  footerActions?: NavAction[];
}

/**
 * Kombineret UserProfileNav komponent der integrerer base og client
 * Denne komponent bruges i applikationen for at simplificere import
 */
export default function UserProfileNav({
  breederRegNo,
  firstName,
  lastName,
  email,
  phone,
  profilePicture,
  onEdit,
  isEditing,
  footerActions
}: UserProfileNavProps) {
  // Generer en dynamisk titel baseret på for- og efternavn
  const title = useMemo(() => `Profil: ${firstName} ${lastName}`, [firstName, lastName]);
  
  return (
    <UserProfileNavBase title={title} footerActions={footerActions}>
      <UserProfileNavClient
        breederRegNo={breederRegNo}
        firstName={firstName}
        lastName={lastName}
        email={email}
        phone={phone}
        profilePicture={profilePicture}
        onEdit={onEdit}
        isEditing={isEditing}
      />
    </UserProfileNavBase>
  );
}