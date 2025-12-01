// src/components/nav/side/RabbitSaleProfileNavClient.tsx
'use client';

import { ReactNode } from 'react';
import { Divider, Chip, Spinner } from '@heroui/react';
import ProfileImage from '@/components/ui/ProfileImage';
import { IoLocationOutline, IoCallOutline, IoTimeOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineLocalShipping } from 'react-icons/md';
import { FaUserCircle } from "react-icons/fa";
import { formatDate } from '@/utils/formatters';
import { useRabbitSaleProfile } from '@/contexts/RabbitSaleProfileContext';

const SECTIONS = {
  SELLER: 'Sælger',
  SALE_INFO: 'Salgs Information',
  CONTACT: 'Kontakt'
} as const;

const DEFAULT_TEXTS = {
  SELLER_NOT_FOUND: 'Ikke angivet',
  LOCATION_NOT_FOUND: 'Ikke angivet',
  CONTACT_NOT_FOUND: 'Ikke angivet'
} as const;

/**
 * Client-side komponent til kanin salgs profil navigation
 * Viser sælger og kontaktinformation
 */
export function RabbitSaleProfileNavClient() {
  const { profile, isLoading, error } = useRabbitSaleProfile();

  if (isLoading) {
    return (
      <div className="w-full p-4 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full p-4 text-center text-zinc-500">
        Kunne ikke hente data
      </div>
    );
  }
  
  const sellerText = profile.sellerName || DEFAULT_TEXTS.SELLER_NOT_FOUND;
  const locationText = profile.city && profile.zipCode 
    ? `${profile.city}, ${profile.zipCode}` 
    : DEFAULT_TEXTS.LOCATION_NOT_FOUND;
  const contactText = profile.sellerContact || DEFAULT_TEXTS.CONTACT_NOT_FOUND;
  const displayName = profile.title || 'Kanin til salg';

  return (
    <div className="w-full p-1 space-y-2">
      
      {/* Kanin billede */}
      <div className="flex justify-center">
        <div className="w-full max-w-[300px] aspect-square">
          <ProfileImage 
            imageUrl={profile.sellerImageUrl} 
            alt={displayName}
            className="w-full h-full"
          />
        </div>
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Salgs information sektion */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.SALE_INFO}
        </h3>

        <div className="space-y-1">
          {/* Oprettet dato */}
          <InfoRow 
            icon={<IoTimeOutline className="text-lg text-default-500" />}
            label="Oprettet" 
            value={formatDate(profile.dateListed)}
          />
          
          {/* Visninger */}
          <InfoRow 
            icon={<IoEyeOutline className="text-lg text-default-500" />}
            label="Visninger" 
            value={`${profile.viewCount || 0} visninger`}
          />
        </div>
        
        {/* Forsendelse chip */}
        {profile.canBeShipped && (
          <div className="mt-2">
            <Chip 
              color="success" 
              variant="flat" 
              size="sm" 
              startContent={<MdOutlineLocalShipping />}
              className="text-xs"
            >
              Kan sendes
            </Chip>
          </div>
        )}
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Sælger sektion */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.SELLER}
        </h3>

        <div className="space-y-1">
          {/* Sælger navn */}
          <InfoRow 
            icon={<FaUserCircle className="text-lg text-default-500" />}
            label="Navn" 
            value={sellerText}
            isDefaultValue={!profile.sellerName}
          />
          
          {/* Lokation */}
          <InfoRow 
            icon={<IoLocationOutline className="text-lg text-default-500" />}
            label="Lokation" 
            value={locationText}
            isDefaultValue={!profile.city || !profile.zipCode}
          />
        </div>
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Kontakt sektion */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.CONTACT}
        </h3>

        <div className="space-y-2">
          {/* Telefonnummer display */}
          <InfoRow 
            icon={<IoCallOutline className="text-lg text-default-500" />}
            label="Telefon" 
            value={contactText}
            isDefaultValue={!profile.sellerContact}
          />
        </div>
      </div>
    </div>
  );
}

// Hjælpekomponent til info rækker
function InfoRow({ 
  icon, 
  label, 
  value,
  isDefaultValue = false,
  isHighlighted = false
}: { 
  icon: ReactNode; 
  label: string; 
  value: string;
  isDefaultValue?: boolean;
  isHighlighted?: boolean;
}) {
  return (
    <div className="py-0.5">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 min-w-[80px]">
          {icon}
          <span className="text-xs font-medium text-zinc-300">{label}</span>
        </div>
        
        <div className={`text-sm ${
          isHighlighted 
            ? 'text-amber-400 font-semibold' 
            : isDefaultValue 
              ? 'text-zinc-500 italic' 
              : 'text-zinc-100'
        }`}>
          {value}
        </div>
      </div>
    </div>
  );
}