// src/components/nav/side/UserProfileNavClient.tsx
'use client';

import { ReactNode } from 'react';
import { Divider } from "@heroui/react";
import { MdMail, MdNumbers, MdPhone } from 'react-icons/md';
import ProfileImage from '@/components/ui/ProfileImage';
import { useUserAccountProfileStore } from '@/store/userAccountProfileStore';

const SECTIONS = {
  USER_INFO: 'Bruger Information',
  BREEDER_INFO: 'Avler Info'
} as const;

const DEFAULT_TEXTS = {
  NOT_SPECIFIED: 'Ikke angivet',
  NO_BREEDER: 'Ingen avlerkonto tilknyttet'
} as const;

export function UserProfileNavClient() {
  const user = useUserAccountProfileStore(state => state.user);
  const breederAccount = useUserAccountProfileStore(state => state.breederAccount);

  const firstName = user?.firstName ?? '';
  const lastName = user?.lastName ?? '';
  const email = user?.email ?? '';
  const phone = user?.phone ?? '';
  const profilePicture = user?.profilePicture ?? null;
  const fullName = `${firstName} ${lastName}`.trim() || 'Bruger';

  return (
    <div className="w-full p-1 space-y-2">
      
      {/* Profilbillede */}
      <div className="flex justify-center">
        <div className="w-full max-w-[300px] aspect-square">
          <ProfileImage
            imageUrl={profilePicture}
            alt={fullName}
            className="w-full h-full"
          />
        </div>
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Bruger information sektion */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.USER_INFO}
        </h3>

        <div className="space-y-1">
          <InfoRow
            icon={<MdMail className="text-lg text-default-500" />}
            label="Email"
            value={email || DEFAULT_TEXTS.NOT_SPECIFIED}
            isDefaultValue={!email}
          />
          
          <InfoRow
            icon={<MdPhone className="text-lg text-default-500" />}
            label="Telefon"
            value={phone || DEFAULT_TEXTS.NOT_SPECIFIED}
            isDefaultValue={!phone}
          />
        </div>
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Avler info sektion */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.BREEDER_INFO}
        </h3>

        {breederAccount ? (
          <div className="space-y-1">
            <InfoRow
              icon={<MdNumbers className="text-lg text-default-500" />}
              label="Avlernr."
              value={breederAccount.breederRegNo}
            />
            
            {breederAccount.memberNo && (
              <InfoRow
                icon={<MdNumbers className="text-lg text-default-500" />}
                label="Medlemsnr."
                value={breederAccount.memberNo}
              />
            )}
          </div>
        ) : (
          <div className="text-zinc-500 italic text-sm py-1">
            {DEFAULT_TEXTS.NO_BREEDER}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  isDefaultValue = false
}: {
  icon: ReactNode;
  label: string;
  value: string;
  isDefaultValue?: boolean;
}) {
  return (
    <div className="py-0.5">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 min-w-[80px]">
          {icon}
          <span className="text-xs font-medium text-zinc-300">{label}</span>
        </div>
        
        <div className={`text-sm ${isDefaultValue ? 'text-zinc-500 italic' : 'text-zinc-100'}`}>
          {value}
        </div>
      </div>
    </div>
  );
}