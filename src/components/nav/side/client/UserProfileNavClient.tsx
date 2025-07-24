// src/components/nav/side/client/UserProfileNavClient.tsx
'use client';

import { MdMail, MdNumbers, MdPhone } from 'react-icons/md';
import { FaUserEdit } from 'react-icons/fa';
import { Button } from "@heroui/react";
import { BreederAccount_PrivateProfileDTO } from '@/api/types/AngoraDTOs';
import ProfileImage from '@/components/ui/ProfileImage';

interface UserProfileNavClientProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  profilePicture?: string | null;
  breederAccount?: BreederAccount_PrivateProfileDTO | null;
  onEdit?: () => void;
  isEditing?: boolean;
}

export function UserProfileNavClient({
  firstName,
  lastName,
  email,
  phone,
  profilePicture,
  breederAccount,
  onEdit,
  isEditing = false
}: UserProfileNavClientProps) {
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="w-full p-1 space-y-2">
      {/* Profilbillede og navn */}
      <div className="flex justify-center">
        <div className="w-full max-w-[300px] aspect-square">
          <ProfileImage
            imageUrl={profilePicture}
            alt={fullName}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-zinc-700/50 my-2" />

      {/* 2-kolonne layout for info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {/* Bruger information */}
        <div className="col-span-2">
          <h4 className="text-[13px] font-medium text-zinc-400 mb-0.5">Bruger information</h4>
        </div>
        <InfoRow
          icon={<MdMail className="text-zinc-400" />}
          label="Email"
          value={email}
        />
        {phone && (
          <InfoRow
            icon={<MdPhone className="text-zinc-400" />}
            label="Telefon"
            value={phone}
          />
        )}
      </div>

      {/* Divider */}
      <div className="border-b border-zinc-700/50 my-2" />

      {/* Avler info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div className="col-span-2">
          <h4 className="text-[13px] font-medium text-zinc-400 mb-0.5">Avler info</h4>
        </div>
        {breederAccount ? (
          <>
            <InfoRow
              icon={<MdNumbers className="text-zinc-400" />}
              label="Avlernummer"
              value={breederAccount.breederRegNo}
            />
            {breederAccount.memberNo && (
              <InfoRow
                icon={<MdNumbers className="text-zinc-400" />}
                label="Medlemsnummer"
                value={breederAccount.memberNo}
              />
            )}
          </>
        ) : (
          <div className="col-span-2 text-zinc-500 italic text-sm">
            Ingen avlerkonto tilknyttet.
          </div>
        )}
      </div>

      {/* Rediger-knap */}
      {onEdit && (
        <Button
          size="sm"
          variant="light"
          color="primary"
          onPress={onEdit}
          isDisabled={isEditing}
          startContent={<FaUserEdit size={16} />}
          className="w-full mt-3"
        >
          {isEditing ? 'Redigerer...' : 'Redigér profil'}
        </Button>
      )}
    </div>
  );
}

// Hjælpekomponent til at vise inforækker i 2-kolonne stil
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
    <>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs font-medium text-zinc-300">{label}</span>
      </div>
      <div className={`text-sm ${isDefaultValue ? 'text-zinc-500 italic' : 'text-zinc-100'}`}>
        {value}
      </div>
    </>
  );
}