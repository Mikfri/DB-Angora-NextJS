// src/components/nav/side/client/UserProfileNavClient.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MdMail, MdPhone, MdNumbers } from 'react-icons/md';
import { FaUserEdit } from 'react-icons/fa';
import { Button } from "@heroui/react";

interface UserProfileNavClientProps {
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
}

// Konstanter til sektioner
const SECTIONS = {
  PROFILE: 'Profiloplysninger',
  CONTACT: 'Kontaktoplysninger'
} as const;

// Standardtekster
const DEFAULT_TEXTS = {
  NO_PHONE: 'Intet telefonnummer angivet',
  NO_BREEDER_ID: 'Intet avlernummer'
} as const;

/**
 * Client-side komponent til brugerprofil navigation
 * Håndterer interaktivitet og tilstandsændringer
 */
export function UserProfileNavClient({
  breederRegNo,
  firstName,
  lastName,
  email,
  phone,
  profilePicture,
  onEdit,
  isEditing = false
}: UserProfileNavClientProps) {
  const [imageError, setImageError] = useState(false);
  const defaultImage = '/images/sideNavigationCard_UserProfile.jpg';
  const displayedImage = (!imageError && profilePicture) ? profilePicture : defaultImage;
  
  const fullName = `${firstName} ${lastName}`;
  
  return (
    <div className="w-full space-y-5">
      {/* Profilbillede */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative w-24 h-24">
          <Image
            src={displayedImage}
            alt={`${fullName} profilbillede`}
            fill
            sizes="96px"
            className="rounded-full object-cover border-2 border-zinc-700"
            onError={() => setImageError(true)}
          />
        </div>
        
        <h3 className="text-lg font-medium text-zinc-100 text-center">
          {fullName}
        </h3>
        
        {onEdit && (
          <Button
            size="sm"
            variant="light"
            color="primary"
            onPress={onEdit}
            isDisabled={isEditing}
            startContent={<FaUserEdit size={16} />}
            className="w-full"
          >
            {isEditing ? 'Redigerer...' : 'Redigér profil'}
          </Button>
        )}
      </div>
      
      <div className="space-y-5">
        {/* Avlernummer */}
        {breederRegNo && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-400">
              {SECTIONS.PROFILE}
            </h4>
            
            <InfoRow 
              icon={<MdNumbers className="text-zinc-400" />}
              label="Avlernummer"
              value={breederRegNo}
            />
          </div>
        )}
        
        {/* Kontaktoplysninger */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-zinc-400">
            {SECTIONS.CONTACT}
          </h4>
          
          <InfoRow 
            icon={<MdMail className="text-zinc-400" />}
            label="Email"
            value={email}
          />
          
          <InfoRow 
            icon={<MdPhone className="text-zinc-400" />}
            label="Telefon"
            value={phone || DEFAULT_TEXTS.NO_PHONE}
            isDefaultValue={!phone}
          />
        </div>
      </div>
    </div>
  );
}

// Hjælpekomponent til at vise inforækker
function InfoRow({ 
  icon, 
  label, 
  value,
  isDefaultValue = false
}: { 
  icon: React.ReactNode;
  label: string; 
  value: string;
  isDefaultValue?: boolean
}) {
  return (
    <div className="flex items-center gap-2 px-1">
      {icon}
      <div className="flex-1">
        <div className="text-xs text-zinc-500">{label}</div>
        <div className={`text-sm ${isDefaultValue ? 'text-zinc-500 italic' : 'text-zinc-200'}`}>
          {value}
        </div>
      </div>
    </div>
  );
}